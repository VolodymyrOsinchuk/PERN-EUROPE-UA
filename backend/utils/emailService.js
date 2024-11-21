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
    from: '"europe-ukraine" <osinvolo@gmail.com>',
    to: email,
    subject: "Vérifiez votre adresse email",
    html: `
    <!DOCTYPE html/>
    <html lang="fr">
    <meta charSet="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vérification de votre compte</title>
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
      <h2>Bienvenue ${firstName} !</h2>
      <p>
        Merci de vous être inscrit sur notre site. Pour activer votre compte,
        veuillez cliquer sur le bouton ci-dessous :
      </p>
      <p>
        <a href="${verificationLink}" className="button" target="_blank">Vérifier mon compte</a>
      </p>
      <p>
        Si le bouton ne fonctionne pas, vous pouvez copier et coller le lien
        suivant dans votre navigateur :
      </p>
      <p>${verificationLink}</p>
      <p>Ce lien expirera dans 24 heures.</p>
      <p>
        Si vous n'avez pas créé de compte sur notre site, vous pouvez ignorer
        cet email.
      </p>
      <p>Cordialement,<br />L'équipe de votre site</p>
    </div>
  </body>
</html>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email de vérification envoyé", info.messageId);
    return true;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    return false;
  }
}

module.exports = { sendVerificationEmail };
