export const FAVORITES_KEY = "pern_europe_ua_favorites";

export function getFavoriteIds() {
  try {
    const value = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
    return Array.isArray(value) ? value.map(Number).filter(Number.isInteger) : [];
  } catch {
    return [];
  }
}

export function isFavorite(id) {
  return getFavoriteIds().includes(Number(id));
}

export function toggleFavoriteId(id) {
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) return false;
  const favorites = getFavoriteIds();
  const exists = favorites.includes(numericId);
  const next = exists
    ? favorites.filter((favoriteId) => favoriteId !== numericId)
    : [...favorites, numericId];
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  return !exists;
}
