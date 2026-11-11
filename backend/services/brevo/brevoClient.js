// backend/services/brevo/brevoClient.js
// Єдина точка виклику Brevo REST API (transactional email).
// Ключ читається лише з process.env і ніколи не потрапляє у frontend чи логи.
const crypto = require("crypto");

const BREVO_URL = "https://api.brevo.com/v3/smtp/email";
const TIMEOUT_MS = 10_000;
const MAX_ATTEMPTS = 3;
const DEDUPE_TTL_MS = 60 * 1000; // однаковий лист не йде частіше ніж раз на хвилину

// dedupeKey -> timestamp останньої успішної відправки
const recentlySent = new Map();

class BrevoError extends Error {
  constructor(
    message,
    { status = null, code = "UNKNOWN", retryable = false } = {},
  ) {
    super(message);
    this.name = "BrevoError";
    this.status = status;
    this.code = code;
    this.retryable = retryable;
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Маскування для логів: "olena.s@x.com" -> "ol***@x.com"
const maskEmail = (email = "") => {
  const [user = "", domain = ""] = String(email).split("@");
  return `${user.slice(0, 2)}***@${domain}`;
};

function getConfig() {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME || "Українці в Європі";

  if (!apiKey || !senderEmail) {
    throw new BrevoError(
      "Brevo не налаштовано: відсутні BREVO_API_KEY або BREVO_SENDER_EMAIL",
      {
        code: "CONFIG",
      },
    );
  }
  return { apiKey, senderEmail, senderName };
}

function purgeExpired(now) {
  for (const [key, ts] of recentlySent) {
    if (now - ts > DEDUPE_TTL_MS) recentlySent.delete(key);
  }
}

/**
 * Надсилає транзакційний лист через Brevo.
 * @returns {Promise<{messageId?: string, skipped?: boolean}>}
 * @throws {BrevoError}
 */
async function sendTransactional({
  to,
  subject,
  html,
  text,
  replyTo,
  kind = "generic",
}) {
  const { apiKey, senderEmail, senderName } = getConfig();

  if (typeof to !== "string" || !EMAIL_RE.test(to)) {
    throw new BrevoError("Некоректна адреса отримувача", {
      code: "VALIDATION",
    });
  }
  if (!subject || !html) {
    throw new BrevoError("Порожня тема або тіло листа", { code: "VALIDATION" });
  }

  // Захист від CRLF-ін'єкцій у заголовку
  const safeSubject = String(subject)
    .replace(/[\r\n]+/g, " ")
    .slice(0, 998);

  const now = Date.now();
  purgeExpired(now);
  const dedupeKey = crypto
    .createHash("sha256")
    .update([to, safeSubject, html].join("|"))
    .digest("hex");
  if (recentlySent.has(dedupeKey)) {
    console.warn(`[brevo] duplicate skipped kind=${kind} to=${maskEmail(to)}`);
    return { skipped: true };
  }

  const body = {
    sender: { name: senderName, email: senderEmail },
    to: [{ email: to }],
    subject: safeSubject,
    htmlContent: html,
    ...(text ? { textContent: text } : {}),
    ...(replyTo && EMAIL_RE.test(replyTo)
      ? { replyTo: { email: replyTo } }
      : {}),
    tags: [kind],
  };

  let lastError;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(BREVO_URL, {
        method: "POST",
        headers: {
          "api-key": apiKey,
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });

      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        recentlySent.set(dedupeKey, Date.now());
        console.log(
          `[brevo] sent kind=${kind} to=${maskEmail(to)} id=${data.messageId ?? "?"} attempt=${attempt}`,
        );
        return { messageId: data.messageId };
      }

      // Тіло помилки містить лише code/message від Brevo. Логуємо тільки code.
      const errJson = await res.json().catch(() => ({}));
      const retryable = res.status === 429 || res.status >= 500;
      lastError = new BrevoError(`Brevo HTTP ${res.status}`, {
        status: res.status,
        code: errJson.code || "HTTP_ERROR",
        retryable,
      });
      if (!retryable) break;
    } catch (err) {
      // Мережева помилка або таймаут
      lastError = new BrevoError(`Мережева помилка: ${err.name}`, {
        code: "NETWORK",
        retryable: true,
      });
    }

    console.warn(
      `[brevo] attempt ${attempt} failed kind=${kind} code=${lastError.code} status=${lastError.status}`,
    );
    if (attempt < MAX_ATTEMPTS) await sleep(500 * 2 ** (attempt - 1));
  }

  console.error(
    `[brevo] FAILED kind=${kind} to=${maskEmail(to)} code=${lastError.code}`,
  );
  throw lastError;
}

module.exports = { sendTransactional, BrevoError, maskEmail };
