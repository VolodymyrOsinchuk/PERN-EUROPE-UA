// // utils/emailService.js
// const mg = require("../config/mailgun");

// const DOMAIN = process.env.MAILGUN_DOMAIN;
// const FROM = `"Українці в Європі" <no-reply@${DOMAIN}>`;
// // Retire un éventuel "/" final pour éviter les URLs en "//"
// const CLIENT_URL = (process.env.CLIENT_URL ?? "").replace(/\/+$/, "");

// if (!DOMAIN || !CLIENT_URL) {
//   console.warn(
//     "⚠️ MAILGUN_DOMAIN ou CLIENT_URL est manquant : les emails seront mal formés.",
//   );
// }

// // ─── Utilitaires ─────────────────────────────────────────────────────────────

// // Empêche l'injection de HTML (liens, mise en forme) dans un email
// // envoyé depuis TON domaine.
// function escapeHtml(str) {
//   return String(str ?? "")
//     .replace(/&/g, "&amp;")
//     .replace(/</g, "&lt;")
//     .replace(/>/g, "&gt;")
//     .replace(/"/g, "&quot;")
//     .replace(/'/g, "&#39;");
// }

// /**
//  * Wrapper générique d'envoi via Mailgun.
//  * @param {{ to: string, subject: string, html: string, text?: string, replyTo?: string }} options
//  * @returns {Promise<boolean>}
//  */
// async function sendMail({ to, subject, html, text, replyTo }) {
//   try {
//     const data = await mg.messages.create(DOMAIN, {
//       from: FROM,
//       to: [to],
//       subject,
//       html,
//       text: text ?? subject,
//       // Si replyTo est fourni, "Répondre" écrira à cette adresse
//       ...(replyTo ? { "h:Reply-To": replyTo } : {}),
//     });
//     console.log(`✅ Email надіслано на ${to} — ID: ${data.id}`);
//     return true;
//   } catch (error) {
//     console.error(
//       `❌ Помилка надсилання email на ${to}:`,
//       error?.message ?? error,
//     );
//     return false;
//   }
// }

// // ─── Template HTML ───────────────────────────────────────────────────────────

// function baseTemplate(content) {
//   return `<!DOCTYPE html>
// <html lang="uk">
// <head>
//   <meta charset="UTF-8" />
//   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//   <style>
//     body {
//       font-family: Arial, sans-serif;
//       background-color: #f4f4f4;
//       margin: 0;
//       padding: 0;
//       color: #333;
//     }
//     .wrapper {
//       max-width: 600px;
//       margin: 40px auto;
//       background: #ffffff;
//       border-radius: 8px;
//       overflow: hidden;
//       box-shadow: 0 2px 8px rgba(0,0,0,0.08);
//     }
//     .header {
//       background-color: #005BBB;
//       padding: 24px 32px;
//     }
//     .header h1 {
//       color: #FFD700;
//       margin: 0;
//       font-size: 20px;
//       letter-spacing: 0.5px;
//     }
//     .body {
//       padding: 32px;
//       line-height: 1.7;
//     }
//     .body h2 {
//       margin-top: 0;
//       color: #005BBB;
//     }
//     .button {
//       display: inline-block;
//       margin: 16px 0;
//       padding: 12px 28px;
//       background-color: #005BBB;
//       color: #ffffff !important;
//       text-decoration: none;
//       border-radius: 6px;
//       font-weight: bold;
//       font-size: 15px;
//     }
//     .link-fallback {
//       font-size: 13px;
//       color: #888;
//       word-break: break-all;
//     }
//     .footer {
//       background-color: #f0f0f0;
//       padding: 16px 32px;
//       font-size: 12px;
//       color: #999;
//       text-align: center;
//     }
//   </style>
// </head>
// <body>
//   <div class="wrapper">
//     <div class="header">
//       <h1>🇺🇦 Українці в Європі</h1>
//     </div>
//     <div class="body">
//       ${content}
//     </div>
//     <div class="footer">
//       Ви отримали цей лист, оскільки зареєструвалися на нашому сайті.<br/>
//       © ${new Date().getFullYear()} Українці в Європі
//     </div>
//   </div>
// </body>
// </html>`;
// }

// // ─── Fonctions d'envoi ───────────────────────────────────────────────────────

// /**
//  * Envoie un email de vérification de compte.
//  * @returns {Promise<boolean>}
//  */
// async function sendVerificationEmail(email, firstName, verificationToken) {
//   const verificationLink = `${CLIENT_URL}/verify-account/${verificationToken}`;

//   const html = baseTemplate(`
//     <h2>Вітаємо, ${escapeHtml(firstName)}!</h2>
//     <p>
//       Дякуємо за реєстрацію. Щоб активувати свій акаунт,
//       натисніть кнопку нижче:
//     </p>
//     <p>
//       <a href="${verificationLink}" class="button">Підтвердити акаунт</a>
//     </p>
//     <p>Якщо кнопка не працює, скопіюйте це посилання у браузер:</p>
//     <p class="link-fallback">${verificationLink}</p>
//     <p>⏳ Посилання дійсне протягом <strong>24 годин</strong>.</p>
//     <p>Якщо ви не реєструвалися — просто ігноруйте цей лист.</p>
//     <p>З повагою,<br/>Команда сайту</p>
//   `);

//   const text =
//     `Вітаємо, ${firstName}!\n\n` +
//     `Щоб активувати свій акаунт, перейдіть за посиланням:\n${verificationLink}\n\n` +
//     `Посилання дійсне протягом 24 годин.\n` +
//     `Якщо ви не реєструвалися — просто ігноруйте цей лист.`;

//   return sendMail({
//     to: email,
//     subject: "Підтвердження електронної пошти",
//     html,
//     text,
//   });
// }

// /**
//  * Envoie un email de réinitialisation de mot de passe.
//  * @returns {Promise<boolean>}
//  */
// async function sendPasswordResetEmail(email, firstName, resetToken) {
//   const resetLink = `${CLIENT_URL}/reset-password/${resetToken}`;

//   const html = baseTemplate(`
//     <h2>Скидання паролю, ${escapeHtml(firstName)}</h2>
//     <p>Ми отримали запит на скидання паролю для вашого акаунту.</p>
//     <p>
//       <a href="${resetLink}" class="button">Скинути пароль</a>
//     </p>
//     <p>Якщо кнопка не працює, скопіюйте це посилання:</p>
//     <p class="link-fallback">${resetLink}</p>
//     <p>⏳ Посилання дійсне протягом <strong>1 години</strong>.</p>
//     <p>Якщо ви не робили цей запит — ваш пароль залишається незмінним.</p>
//     <p>З повагою,<br/>Команда сайту</p>
//   `);

//   const text =
//     `Скидання паролю, ${firstName}\n\n` +
//     `Ми отримали запит на скидання паролю для вашого акаунту:\n${resetLink}\n\n` +
//     `Посилання дійсне протягом 1 години.\n` +
//     `Якщо ви не робили цей запит — ваш пароль залишається незмінним.`;

//   return sendMail({
//     to: email,
//     subject: "Скидання паролю",
//     html,
//     text,
//   });
// }

// /**
//  * Envoie au vendeur le message d'un acheteur.
//  * @returns {Promise<boolean>}
//  */
// async function sendAdContactEmail({
//   to,
//   adId,
//   adTitle,
//   senderName,
//   senderEmail,
//   message,
// }) {
//   const adLink = `${CLIENT_URL}/ads/${encodeURIComponent(adId)}`;
//   const safeMessage = escapeHtml(message).replace(/\n/g, "<br/>");

//   const html = baseTemplate(`
//     <h2>Нове повідомлення щодо вашого оголошення</h2>
//     <p>
//       <strong>${escapeHtml(senderName)}</strong> написав(ла) вам щодо
//       оголошення «<a href="${adLink}">${escapeHtml(adTitle)}</a>»:
//     </p>
//     <blockquote style="margin:16px 0;padding:12px 16px;background:#f4f4f4;border-left:4px solid #005BBB;">
//       ${safeMessage}
//     </blockquote>
//     <p>
//       Щоб відповісти, натисніть «Відповісти» у вашій поштовій програмі —
//       відповідь прийде на адресу <strong>${escapeHtml(senderEmail)}</strong>.
//     </p>
//   `);

//   const text =
//     `${senderName} (${senderEmail}) написав(ла) вам щодо оголошення «${adTitle}»:\n\n` +
//     `${message}\n\nОголошення: ${adLink}`;

//   return sendMail({
//     to,
//     // On retire les retours à la ligne éventuels du titre
//     subject: `Нове повідомлення: ${adTitle}`.replace(/[\r\n]+/g, " "),
//     html,
//     text,
//     replyTo: senderEmail,
//   });
// }

// module.exports = {
//   sendVerificationEmail,
//   sendPasswordResetEmail,
//   sendAdContactEmail,
// };

// backend/utils/emailService.js
// Сумісний фасад: увесь код, що імпортує emailService, працює з Brevo.
module.exports = require("../services/brevo/mailService");