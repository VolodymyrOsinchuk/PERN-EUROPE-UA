// backend/services/brevo/templates.js
// Адаптивні HTML-шаблони у фірмових кольорах сайту:
// синій #0057B8 / #003d82, жовтий #FFD700.
// Верстка табличними блоками з inline-стилями для сумісності з поштовими клієнтами.

const BRAND = {
  blue: "#0057B8",
  dark: "#003d82",
  gold: "#FFD700",
  bg: "#f4f6fb",
  text: "#1e293b",
  muted: "#64748b",
};

const clientUrl = () =>
  (process.env.CLIENT_URL || "http://localhost:5173").replace(/\/+$/, "");

const esc = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );

const fmtDate = (d = new Date()) =>
  d.toLocaleString("uk-UA", {
    timeZone: "Europe/Warsaw",
    dateStyle: "medium",
    timeStyle: "short",
  });

const H1 = `margin:0 0 16px;font-size:24px;line-height:1.3;color:${BRAND.dark};`;
const P = `margin:0 0 16px;`;
const SMALL = `margin:16px 0 0;font-size:13px;color:${BRAND.muted};`;

function button(href, label) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;">
  <tr><td class="btn" style="background:${BRAND.blue};border-radius:10px;">
    <a href="${esc(href)}" style="display:inline-block;padding:14px 28px;color:#ffffff;text-decoration:none;font-weight:bold;font-size:16px;">${esc(label)}</a>
  </td></tr></table>`;
}

function layout({ preheader = "", title, body, footer }) {
  return `<!DOCTYPE html>
<html lang="uk">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<title>${esc(title)}</title>
<style>
  @media only screen and (max-width:620px) {
    .container { width:100% !important; max-width:100% !important; }
    .px { padding-left:20px !important; padding-right:20px !important; }
    .btn { display:block !important; text-align:center; }
    .btn a { display:block !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${BRAND.bg};font-family:Arial,Helvetica,sans-serif;color:${BRAND.text};">
<span style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.bg};">
<tr><td align="center" style="padding:24px 12px;">
  <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0"
         style="width:600px;max-width:600px;background:#ffffff;border-radius:14px;overflow:hidden;">
    <tr><td class="px" style="background:linear-gradient(135deg,${BRAND.blue},${BRAND.dark});padding:28px 32px;">
      <div style="font-size:20px;font-weight:bold;color:${BRAND.gold};letter-spacing:0.3px;">🇺🇦 Українці в Європі</div>
    </td></tr>
    <tr><td style="height:4px;background:${BRAND.gold};font-size:0;line-height:0;">&nbsp;</td></tr>
    <tr><td class="px" style="padding:32px;font-size:16px;line-height:1.6;">${body}</td></tr>
    <tr><td class="px" style="padding:20px 32px;background:#f8fafc;font-size:12px;line-height:1.5;color:${BRAND.muted};">
      ${footer ?? "Ви отримали цей лист, оскільки маєте акаунт на сайті «Українці в Європі»."}<br>
      © ${new Date().getFullYear()} Українці в Європі
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`;
}

function build(kind, { subject, preheader, body, text, footer }) {
  return {
    kind,
    subject,
    html: layout({ preheader, title: subject, body, footer }),
    text,
  };
}

/* ───────── Авторизація та акаунт ───────── */

const welcome = ({ firstName }) =>
  build("welcome", {
    subject: "Ласкаво просимо до «Українці в Європі»!",
    preheader: "Раді бачити вас у спільноті",
    body: `<h1 style="${H1}">Вітаємо, ${esc(firstName)}!</h1>
      <p style="${P}">Дякуємо за реєстрацію. Тут ви знайдете актуальні новини, оголошення, події та підтримку спільноти українців у Європі.</p>
      ${button(`${clientUrl()}/`, "Перейти на сайт")}
      <p style="${P}">Щоб отримати повний доступ, підтвердьте свою електронну пошту. Окремий лист з посиланням уже надіслано.</p>`,
    text: `Вітаємо, ${firstName}! Дякуємо за реєстрацію на платформі «Українці в Європі». ${clientUrl()}/`,
  });

const verifyEmail = ({ firstName, token }) => {
  const link = `${clientUrl()}/verify-account/${token}`;
  return build("verify_email", {
    subject: "Підтвердження електронної пошти",
    preheader: "Підтвердіть email, щоб активувати акаунт",
    body: `<h1 style="${H1}">Підтвердіть свою пошту</h1>
      <p style="${P}">Привіт, ${esc(firstName)}! Натисніть кнопку нижче, щоб активувати акаунт.</p>
      ${button(link, "Підтвердити акаунт")}
      <p style="${P}">Якщо кнопка не працює, скопіюйте посилання у браузер:<br>
        <span style="word-break:break-all;font-size:13px;color:${BRAND.muted};">${esc(link)}</span></p>
      <p style="${SMALL}">⏳ Посилання дійсне 24 години. Якщо ви не реєструвалися, просто проігноруйте цей лист.</p>`,
    text: `Підтвердіть пошту: ${link} (дійсне 24 години).`,
  });
};

const passwordReset = ({ firstName, token }) => {
  const link = `${clientUrl()}/reset-password/${token}`;
  return build("password_reset", {
    subject: "Відновлення пароля",
    preheader: "Запит на зміну пароля для вашого акаунту",
    body: `<h1 style="${H1}">Відновлення пароля</h1>
      <p style="${P}">Привіт, ${esc(firstName)}. Ми отримали запит на скидання пароля для вашого акаунту.</p>
      ${button(link, "Створити новий пароль")}
      <p style="${P}">Якщо кнопка не працює, скопіюйте посилання у браузер:<br>
        <span style="word-break:break-all;font-size:13px;color:${BRAND.muted};">${esc(link)}</span></p>
      <p style="${SMALL}">⏳ Посилання дійсне 1 годину і діє лише один раз. Якщо це були не ви, ваш пароль залишиться без змін.</p>`,
    text: `Відновлення пароля: ${link} (дійсне 1 годину).`,
  });
};

const passwordChanged = ({ firstName, when = new Date() }) =>
  build("password_changed", {
    subject: "Ваш пароль змінено",
    preheader: "Пароль вашого акаунту було змінено",
    body: `<h1 style="${H1}">Пароль змінено</h1>
      <p style="${P}">Привіт, ${esc(firstName)}. Пароль вашого акаунту було успішно змінено <strong>${esc(fmtDate(when))}</strong>.</p>
      <p style="${P}">Якщо це зробили не ви, негайно зверніться до нас через форму на сайті та відновіть доступ.</p>
      ${button(`${clientUrl()}/contact`, "Повідомити про проблему")}`,
    text: `Ваш пароль змінено ${fmtDate(when)}. Якщо це не ви, зверніться до нас: ${clientUrl()}/contact`,
  });

const securityAlert = ({ firstName, event, ip, when = new Date() }) =>
  build("security_alert", {
    subject: "Попередження безпеки акаунту",
    preheader: `Подія: ${event}`,
    body: `<h1 style="${H1}">Важлива подія в акаунті</h1>
      <p style="${P}">Привіт, ${esc(firstName)}. Ми помітили таку подію:</p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 16px;background:#f8fafc;border-radius:10px;width:100%;">
        <tr><td style="padding:14px 18px;font-size:14px;line-height:1.7;">
          <strong>Подія:</strong> ${esc(event)}<br>
          <strong>Час:</strong> ${esc(fmtDate(when))}<br>
          ${ip ? `<strong>IP-адреса:</strong> ${esc(ip)}` : ""}
        </td></tr></table>
      <p style="${P}">Якщо це були ви, нічого робити не потрібно. Інакше змініть пароль і зверніться до нас.</p>`,
    text: `Подія в акаунті: ${event}, ${fmtDate(when)}. Якщо це не ви, змініть пароль.`,
  });

/* ───────── Форма зворотного зв'язку ───────── */

const contactAdmin = ({ name, email, subject, message, when = new Date() }) =>
  build("contact_admin", {
    subject: `Нове повідомлення з сайту: ${subject}`,
    preheader: `Від ${name} <${email}>`,
    footer: "Службове повідомлення з форми зворотного зв'язку сайту.",
    body: `<h1 style="${H1}">Нове повідомлення</h1>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 16px;width:100%;font-size:14px;line-height:1.7;">
        <tr><td style="padding:4px 0;width:90px;color:${BRAND.muted};">Ім'я</td><td>${esc(name)}</td></tr>
        <tr><td style="padding:4px 0;color:${BRAND.muted};">Email</td><td>${esc(email)}</td></tr>
        <tr><td style="padding:4px 0;color:${BRAND.muted};">Тема</td><td>${esc(subject)}</td></tr>
        <tr><td style="padding:4px 0;color:${BRAND.muted};">Час</td><td>${esc(fmtDate(when))}</td></tr>
      </table>
      <div style="padding:16px 18px;background:#f8fafc;border-left:4px solid ${BRAND.blue};border-radius:6px;white-space:pre-wrap;">${esc(message)}</div>
      <p style="${SMALL}">Щоб відповісти, натисніть «Відповісти»: лист піде на адресу відправника.</p>`,
    text: `Від: ${name} <${email}>\nТема: ${subject}\n\n${message}`,
  });

const contactAck = ({ name, subject }) =>
  build("contact_ack", {
    subject: "Ми отримали ваше повідомлення",
    preheader: "Дякуємо, ми відповімо найближчим часом",
    body: `<h1 style="${H1}">Дякуємо, ${esc(name)}!</h1>
      <p style="${P}">Ми отримали ваше повідомлення з темою «<strong>${esc(subject)}</strong>» і відповімо найближчим часом.</p>
      <p style="${P}">Робочий час: Пн–Пт, 9:00–18:00 (CET).</p>
      ${button(`${clientUrl()}/`, "Повернутися на сайт")}`,
    text: `Дякуємо, ${name}! Ми отримали ваше повідомлення «${subject}» і відповімо найближчим часом.`,
  });

/* ───────── Оголошення та системні ───────── */

const adContact = ({ adTitle, adId, senderName, senderEmail, message }) => {
  const adLink = `${clientUrl()}/ads/${encodeURIComponent(adId)}`;
  return build("ad_contact", {
    subject: `Нове повідомлення: ${adTitle}`,
    preheader: `${senderName} написав(ла) вам щодо оголошення`,
    body: `<h1 style="${H1}">Нове повідомлення щодо оголошення</h1>
      <p style="${P}"><strong>${esc(senderName)}</strong> написав(ла) вам щодо оголошення
        «<a href="${esc(adLink)}" style="color:${BRAND.blue};">${esc(adTitle)}</a>»:</p>
      <div style="padding:16px 18px;background:#f8fafc;border-left:4px solid ${BRAND.blue};border-radius:6px;white-space:pre-wrap;">${esc(message)}</div>
      <p style="${SMALL}">Щоб відповісти, натисніть «Відповісти». Лист піде на ${esc(senderEmail)}.</p>`,
    text: `${senderName} (${senderEmail}) написав(ла) щодо «${adTitle}»:\n\n${message}\n\n${adLink}`,
  });
};

const adminAlert = ({ title, details }) =>
  build("admin_alert", {
    subject: `[Система] ${title}`,
    preheader: "Системне сповіщення",
    footer: "Автоматичне системне сповіщення.",
    body: `<h1 style="${H1}">${esc(title)}</h1>
      <div style="padding:14px 18px;background:#fff7ed;border-left:4px solid #f59e0b;border-radius:6px;font-size:14px;white-space:pre-wrap;">${esc(details)}</div>
      <p style="${SMALL}">Час: ${esc(fmtDate())}</p>`,
    text: `${title}\n\n${details}`,
  });

module.exports = {
  welcome,
  verifyEmail,
  passwordReset,
  passwordChanged,
  securityAlert,
  contactAdmin,
  contactAck,
  adContact,
  adminAlert,
};
