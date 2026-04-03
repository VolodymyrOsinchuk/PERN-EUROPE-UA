// utils/emailService.js
const transporter = require("../config/nodemailer");
const config = require("../config/config");

async function sendVerificationEmail(email, firstName, verificationToken) {
  const verificationLink = `${config.client.url}/verify-account/${verificationToken}`;

  console.log(
    "🚀 ~ sendVerificationEmail ~ verificationLink:",
    verificationLink
  );

  const mailOptions = {
    from: '"Українці в Європі" <osinvolo@gmail.com>',
    to: email,
    subject: "Підтвердження електронної пошти",
    html: `
    <!DOCTYPE html/>
    <html lang="uk">
    <meta charSet="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Підтвердження вашого акаунту</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 5px;
      }
      .button {
        display: inline-block;
        padding: 10px 20px;
        background-color: #007bff;
        color: #ffffff;
        text-decoration: none;
        border-radius: 5px;
      }
    </style>
  </head>
  <body>
    <div className="container">
      <h2>Вітаємо, ${firstName}!</h2>
      <p>
        Дякуємо за реєстрацію на нашому сайті. Щоб активувати свій акаунт,
        натисніть кнопку нижче:
      </p>
      <p>
        <a href="${verificationLink}" className="button" target="_blank">Підтвердити акаунт</a>
      </p>
      <p>
        Якщо кнопка не працює, ви можете скопіювати та вставити наступне посилання
        у свій браузер:
      </p>
      <p>${verificationLink}</p>
      <p>Це посилання буде дійсним протягом 24 годин.</p>
      <p>
        Якщо ви не створювали акаунт на нашому сайті, ви можете ігнорувати
        цей лист.
      </p>
      <p>З повагою,<br />Команда сайту</p>
    </div>
  </body>
</html>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Лист для підтвердження надіслано", info.messageId);
    return true;
  } catch (error) {
    console.error("Помилка надсилання листа:", error);
    return false;
  }
}

module.exports = { sendVerificationEmail };
