// // utils/emailService.js
// const transporter = require("../config/nodemailer");
// const config = require("../config/config");

// async function sendVerificationEmail(email, firstName, verificationToken) {
//   const verificationLink = `${config.client.url}/verify-account/${verificationToken}`;

//   console.log(
//     "🚀 ~ sendVerificationEmail ~ verificationLink:",
//     verificationLink
//   );

//   const mailOptions = {
//     from: '"Українці в Європі" <osinvolo@gmail.com>',
//     to: email,
//     subject: "Підтвердження електронної пошти",
//     html: `
//     <!DOCTYPE html/>
//     <html lang="uk">
//     <meta charSet="UTF-8" />
//     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//     <title>Підтвердження вашого акаунту</title>
//     <style>
//       body {
//         font-family: Arial, sans-serif;
//         line-height: 1.6;
//         color: #333;
//       }
//       .container {
//         max-width: 600px;
//         margin: 0 auto;
//         padding: 20px;
//         border: 1px solid #ddd;
//         border-radius: 5px;
//       }
//       .button {
//         display: inline-block;
//         padding: 10px 20px;
//         background-color: #007bff;
//         color: #ffffff;
//         text-decoration: none;
//         border-radius: 5px;
//       }
//     </style>
//   </head>
//   <body>
//     <div className="container">
//       <h2>Вітаємо, ${firstName}!</h2>
//       <p>
//         Дякуємо за реєстрацію на нашому сайті. Щоб активувати свій акаунт,
//         натисніть кнопку нижче:
//       </p>
//       <p>
//         <a href="${verificationLink}" className="button" target="_blank">Підтвердити акаунт</a>
//       </p>
//       <p>
//         Якщо кнопка не працює, ви можете скопіювати та вставити наступне посилання
//         у свій браузер:
//       </p>
//       <p>${verificationLink}</p>
//       <p>Це посилання буде дійсним протягом 24 годин.</p>
//       <p>
//         Якщо ви не створювали акаунт на нашому сайті, ви можете ігнорувати
//         цей лист.
//       </p>
//       <p>З повагою,<br />Команда сайту</p>
//     </div>
//   </body>
// </html>`,
//   };

//   try {
//     const info = await transporter.sendMail(mailOptions);
//     console.log("Лист для підтвердження надіслано", info.messageId);
//     return true;
//   } catch (error) {
//     console.error("Помилка надсилання листа:", error);
//     return false;
//   }
// }

// module.exports = { sendVerificationEmail };

// utils/emailService.js
const mg = require("../config/mailgun");

const DOMAIN = process.env.MAILGUN_DOMAIN;
const FROM = `"Українці в Європі" <no-reply@${DOMAIN}>`;
const CLIENT_URL = process.env.CLIENT_URL;

// ─── Templates HTML ──────────────────────────────────────────────────────────

function baseTemplate(content) {
  return `<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
      color: #333;
    }
    .wrapper {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    .header {
      background-color: #005BBB;
      padding: 24px 32px;
    }
    .header h1 {
      color: #FFD700;
      margin: 0;
      font-size: 20px;
      letter-spacing: 0.5px;
    }
    .body {
      padding: 32px;
      line-height: 1.7;
    }
    .body h2 {
      margin-top: 0;
      color: #005BBB;
    }
    .button {
      display: inline-block;
      margin: 16px 0;
      padding: 12px 28px;
      background-color: #005BBB;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
      font-size: 15px;
    }
    .link-fallback {
      font-size: 13px;
      color: #888;
      word-break: break-all;
    }
    .footer {
      background-color: #f0f0f0;
      padding: 16px 32px;
      font-size: 12px;
      color: #999;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>🇺🇦 Українці в Європі</h1>
    </div>
    <div class="body">
      ${content}
    </div>
    <div class="footer">
      Ви отримали цей лист, оскільки зареєструвалися на нашому сайті.<br/>
      © ${new Date().getFullYear()} Українці в Європі
    </div>
  </div>
</body>
</html>`;
}

// ─── Fonctions d'envoi ────────────────────────────────────────────────────────

/**
 * Envoie un email de vérification de compte.
 * @param {string} email
 * @param {string} firstName
 * @param {string} verificationToken
 * @returns {Promise<boolean>}
 */
async function sendVerificationEmail(
  email,
  firstName,
  verificationToken,
) {
  const verificationLink = `${CLIENT_URL}/verify-account/${verificationToken}`;

  const html = baseTemplate(`
    <h2>Вітаємо, ${firstName}!</h2>
    <p>
      Дякуємо за реєстрацію. Щоб активувати свій акаунт,
      натисніть кнопку нижче:
    </p>
    <p>
      <a href="${verificationLink}" class="button">Підтвердити акаунт</a>
    </p>
    <p>Якщо кнопка не працює, скопіюйте це посилання у браузер :</p>
    <p class="link-fallback">${verificationLink}</p>
    <p>⏳ Посилання дійсне протягом <strong>24 годин</strong>.</p>
    <p>Якщо ви не реєструвалися — просто ігноруйте цей лист.</p>
    <p>З повагою,<br/>Команда сайту</p>
  `);

  return sendMail({
    to: email,
    subject: "Підтвердження електронної пошти",
    html,
  });
}

/**
 * Envoie un email de réinitialisation de mot de passe.
 * @param {string} email
 * @param {string} firstName
 * @param {string} resetToken
 * @returns {Promise<boolean>}
 */
async function sendPasswordResetEmail(email, firstName, resetToken) {
  const resetLink = `${CLIENT_URL}/reset-password/${resetToken}`;

  const html = baseTemplate(`
    <h2>Скидання паролю, ${firstName}</h2>
    <p>Ми отримали запит на скидання паролю для вашого акаунту.</p>
    <p>
      <a href="${resetLink}" class="button">Скинути пароль</a>
    </p>
    <p>Якщо кнопка не працює, скопіюйте це посилання :</p>
    <p class="link-fallback">${resetLink}</p>
    <p>⏳ Посилання дійсне протягом <strong>1 години</strong>.</p>
    <p>Якщо ви не робили цей запит — ваш пароль залишається незмінним.</p>
    <p>З повагою,<br/>Команда сайту</p>
  `);

  return sendMail({
    to: email,
    subject: "Скидання паролю",
    html,
  });
}

// ─── Utilitaire interne ───────────────────────────────────────────────────────

/**
 * Wrapper générique d'envoi via Mailgun.
 * @param {{ to: string, subject: string, html: string, text?: string }} options
 * @returns {Promise<boolean>}
 */
async function sendMail({ to, subject, html, text }) {
  try {
    const data = await mg.messages.create(DOMAIN, {
      from: FROM,
      to: [to],
      subject,
      html,
      // Fallback texte généré automatiquement si non fourni
      text: text ?? subject,
    });
    console.log(`✅ Email надіслано на ${to} — ID: ${data.id}`);
    return true;
  } catch (error) {
    console.error(`❌ Помилка надсилання email на ${to}:`, error?.message ?? error);
    return false;
  }
}

module.exports = { sendVerificationEmail, sendPasswordResetEmail };
