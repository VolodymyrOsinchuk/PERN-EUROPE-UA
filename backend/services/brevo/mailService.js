// backend/services/brevo/mailService.js
// Бізнес-рівень: які листи, кому і коли. Не знає про HTTP.
// Усі функції повертають boolean і не кидають помилок назовні,
// щоб збій пошти не ламав основний запит (сумісно з попереднім emailService).
const { sendTransactional } = require("./brevoClient");
const config = require("../../config/config");

const T = require("./templates");

const adminEmail = () =>
  process.env.BREVO_ADMIN_EMAIL || process.env.BREVO_SENDER_EMAIL;

async function deliver(tpl, to, replyTo) {
  try {
    await sendTransactional({ to, ...tpl, replyTo });
    return true;
  } catch (err) {
    console.error(
      `[mail] ${tpl.kind} не надіслано: ${err.code || err.message}`,
    );
    return false;
  }
}

/* ───────── Авторизація ───────── */

const sendWelcomeEmail = (email, firstName) =>
  deliver(T.welcome({ firstName }), email);

const sendVerificationEmail = (email, firstName, token) =>
  deliver(T.verifyEmail({ firstName, token }), email);

const sendPasswordResetEmail = (email, firstName, token) =>
  deliver(T.passwordReset({ firstName, token }), email);

const sendPasswordChangedEmail = (email, firstName) =>
  deliver(T.passwordChanged({ firstName }), email);

const sendSecurityAlert = (email, firstName, { event, ip } = {}) =>
  deliver(T.securityAlert({ firstName, event, ip }), email);

/* ───────── Контакти ───────── */

const sendContactNotification = ({ name, email, subject, message }) => {
  const to = adminEmail();
  if (!to) return Promise.resolve(false);
  return deliver(T.contactAdmin({ name, email, subject, message }), to, email);
};

const sendContactAcknowledgement = ({ name, email, subject }) =>
  deliver(T.contactAck({ name, subject }), email);

/* ───────── Оголошення (сумісно з messageController) ───────── */

const sendAdContactEmail = ({
  to,
  adId,
  adTitle,
  senderName,
  senderEmail,
  message,
}) =>
  deliver(
    T.adContact({ adId, adTitle, senderName, senderEmail, message }),
    to,
    senderEmail,
  );

// Додати в backend/services/brevo/mailService.js і до module.exports
const escapeHtml = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const sendEmailChangeConfirmation = (to, name, token) => {
  const url = `${config.client.url}/confirm-email-change/${token}`;
  return deliver(
    {
      kind: "emailChange",
      subject: "Підтвердіть нову адресу електронної пошти",
      html: `
        <p>Вітаємо, ${escapeHtml(name)}!</p>
        <p>Ви запросили зміну адреси електронної пошти на цю.</p>
        <p><a href="${url}">Підтвердити нову адресу</a></p>
        <p>Посилання дійсне 1 годину. Якщо це були не ви, просто проігноруйте лист.</p>
      `,
    },
    to,
  );
};

const sendEmailChangedNotice = (to, name) =>
  deliver(
    {
      kind: "emailChangedNotice",
      subject: "Адресу вашого акаунта змінено",
      html: `
        <p>Вітаємо, ${escapeHtml(name)}!</p>
        <p>Адреса електронної пошти вашого акаунта щойно змінена.</p>
        <p>Якщо це були не ви, негайно зверніться до підтримки.</p>
      `,
    },
    to,
  );
/* ───────── Адміністративні ───────── */

const sendAdminAlert = ({ title, details }) => {
  const to = adminEmail();
  if (!to) return Promise.resolve(false);
  return deliver(T.adminAlert({ title, details }), to);
};

const sendTransactionalEmail = ({ to, subject, html }) =>
  deliver({ kind: "chat", subject, html }, to);

module.exports = {
  sendWelcomeEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
  sendSecurityAlert,
  sendContactNotification,
  sendContactAcknowledgement,
  sendAdContactEmail,
  sendAdminAlert,
  sendTransactionalEmail,
  sendEmailChangeConfirmation,
  sendEmailChangedNotice,
};
