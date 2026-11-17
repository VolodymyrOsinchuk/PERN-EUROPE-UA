// frontend/src/data/validateCountries.js
// Перевірка структури даних про країни (countries.json).
// Повертає масив помилок; порожній масив означає, що дані валідні.

const CATEGORIES = new Set([
  "government",
  "residence",
  "benefits",
  "work",
  "consulate",
  "health",
  "education",
  "family",
  "transport",
  "finance",
]);

const ISO_DATE = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?Z)?$/;
const COUNTRY_CODE = /^[A-Z]{2}$/;

const isNonEmptyString = (v) => typeof v === "string" && v.trim().length > 0;

const isValidDate = (v) => {
  if (v === null) return true; // null = ще не перевірено
  if (typeof v !== "string" || !ISO_DATE.test(v)) return false;
  return !Number.isNaN(Date.parse(v));
};

const isValidUrl = (v) => {
  if (v === null) return true; // null = посилання ще не перевірене
  if (typeof v !== "string") return false;
  try {
    const u = new URL(v);
    return u.protocol === "https:";
  } catch {
    return false;
  }
};

export function validateCountries(data) {
  const errors = [];

  if (!data || typeof data !== "object") {
    return ["Коренева структура має бути об'єктом"];
  }
  if (data.version !== 1) {
    errors.push("Очікується version: 1");
  }
  if (!Array.isArray(data.countries)) {
    return [...errors, "Поле countries має бути масивом"];
  }

  const seenCodes = new Set();

  data.countries.forEach((country, i) => {
    const where = `countries[${i}]${country?.code ? ` (${country.code})` : ""}`;

    if (!country || typeof country !== "object") {
      errors.push(`${where}: запис має бути об'єктом`);
      return;
    }

    // Код країни
    if (!COUNTRY_CODE.test(country.code ?? "")) {
      errors.push(
        `${where}: code має бути двома великими латинськими літерами (ISO 3166-1)`,
      );
    } else if (seenCodes.has(country.code)) {
      errors.push(`${where}: дублікат code`);
    } else {
      seenCodes.add(country.code);
    }

    // Обов'язкові текстові поля
    if (!isNonEmptyString(country.name)) {
      errors.push(`${where}: відсутня name`);
    }
    if (!isNonEmptyString(country.nameEn)) {
      errors.push(`${where}: відсутня nameEn`);
    }
    if (!isNonEmptyString(country.flag)) {
      errors.push(`${where}: відсутній flag`);
    }
    if (!isNonEmptyString(country.disclaimer)) {
      errors.push(`${where}: відсутній disclaimer`);
    }

    // Дати на рівні країни
    if (!isValidDate(country.lastVerifiedAt)) {
      errors.push(`${where}: lastVerifiedAt має бути ISO-датою або null`);
    }
    if (country.lastVerifiedAt && !isNonEmptyString(country.verifiedBy)) {
      errors.push(
        `${where}: якщо є lastVerifiedAt, має бути вказано verifiedBy`,
      );
    }

    // Посилання
    if (!Array.isArray(country.links)) {
      errors.push(`${where}: links має бути масивом`);
      return;
    }

    country.links.forEach((link, j) => {
      const lw = `${where}.links[${j}]`;

      if (!link || typeof link !== "object") {
        errors.push(`${lw}: запис має бути об'єктом`);
        return;
      }
      if (!CATEGORIES.has(link.category)) {
        errors.push(`${lw}: невідома category "${link.category}"`);
      }
      if (!isNonEmptyString(link.title)) {
        errors.push(`${lw}: відсутній title`);
      }
      if (!isValidUrl(link.url)) {
        errors.push(`${lw}: url має бути https-адресою або null`);
      }
      if (!isValidDate(link.lastCheckedAt)) {
        errors.push(`${lw}: lastCheckedAt має бути ISO-датою або null`);
      }
      if (link.url && !link.lastCheckedAt) {
        errors.push(`${lw}: url заповнено, але не вказано lastCheckedAt`);
      }
    });
  });

  return errors;
}

// Публікуємо лише перевірені країни з перевіреними посиланнями.
export function getPublishableCountries(data) {
  return data.countries
    .filter((c) => c.lastVerifiedAt)
    .map((c) => ({
      ...c,
      links: c.links.filter((l) => l.url && l.lastCheckedAt),
    }));
}
