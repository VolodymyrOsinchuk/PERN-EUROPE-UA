const isOn = (v) => v === true || v === "true" || v === "on" || v === "1";

// Повертає налаштування, якщо форма їх передала, інакше null (без змін).
// Фронтенд завжди надсилає hidden-поле contactSettingsSent=1,
// тому відсутній чекбокс означає false, а не «не змінювати».
function readContactSettings(body = {}) {
  if (body.contactSettingsSent !== "1") return null;
  return {
    contactByEmail: isOn(body.contactByEmail),
    contactByChat: isOn(body.contactByChat),
    showEmail: isOn(body.showEmail),
    showPhone: isOn(body.showPhone),
  };
}

const DEFAULT_CONTACT = {
  contactByEmail: true,
  contactByChat: true,
  showEmail: false,
  showPhone: false,
};

module.exports = { readContactSettings, DEFAULT_CONTACT };
