const Parser = require("rss-parser");

// URL стрічок можуть змінюватися. Перевірте їх перед запуском.
const FEEDS = [
  { name: "BBC Україна", url: "https://feeds.bbci.co.uk/ukrainian/rss.xml" },
  { name: "Суспільне", url: "https://suspilne.media/rss/all.rss" },
  { name: "Українська правда", url: "https://www.pravda.com.ua/rss/" },
];

const CACHE_TTL_MS = 15 * 60 * 1000; // 15 хвилин
const MAX_ITEMS = 30;
const SUMMARY_MAX_LENGTH = 300;

const parser = new Parser({
  timeout: 8000,
  headers: { "User-Agent": "UkrainiansInEurope/1.0" },
});

let cache = { at: 0, items: [] };

// Прибирає HTML-теги та зайві пробіли
function cleanText(text = "") {
  return String(text)
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function loadFeed(feed) {
  const parsed = await parser.parseURL(feed.url);

  return parsed.items.slice(0, 10).map((item) => ({
    title: cleanText(item.title),
    // Зберігаємо лише короткий уривок, а не повний текст статті
    summary: cleanText(item.contentSnippet || item.content || "").slice(
      0,
      SUMMARY_MAX_LENGTH,
    ),
    link: item.link,
    date: item.isoDate || item.pubDate || null,
    source: feed.name,
  }));
}

async function fetchExternalNews() {
  const isFresh = Date.now() - cache.at < CACHE_TTL_MS;
  if (isFresh && cache.items.length) return cache.items;

  // allSettled: якщо одна стрічка недоступна, інші все одно працюють
  const results = await Promise.allSettled(FEEDS.map(loadFeed));

  const items = results
    .filter((r) => r.status === "fulfilled")
    .flatMap((r) => r.value)
    .filter((i) => i.title && /^https?:\/\//.test(i.link || ""))
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    .slice(0, MAX_ITEMS);

  results.forEach((r, idx) => {
    if (r.status === "rejected") {
      console.warn(
        `Не вдалося завантажити ${FEEDS[idx].name}:`,
        r.reason?.message,
      );
    }
  });

  // Якщо всі джерела впали, повертаємо старий кеш
  if (items.length) {
    cache = { at: Date.now(), items };
    return items;
  }
  return cache.items;
}

module.exports = { fetchExternalNews };
