const config = require("../config/config");
// ПЕРЕВІР назву: у твоєму mailService функція відправки може називатися інакше.
const { sendTransactionalEmail } = require("./brevo/mailService");

const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// Лист без тексту повідомлення і без email відправника.
async function sendNewChatMessageEmail({ to, name, adTitle }) {
  const link = `${config.client.url}/messages`;
  const html = `
    <p>Вітаємо, ${esc(name)}!</p>
    <p>У вас нове повідомлення щодо оголошення «${esc(adTitle)}».</p>
    <p><a href="${link}">Відкрити повідомлення</a></p>
    <p>Текст повідомлення доступний лише на платформі.</p>`;

  return sendTransactionalEmail({
    to,
    subject: "Нове повідомлення на платформі",
    html,
  });
}

module.exports = { sendNewChatMessageEmail };
