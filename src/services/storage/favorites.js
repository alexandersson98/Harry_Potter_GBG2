// src/services/storage/favorites.js

const FAV_KEY = "wizardpedia:favorites";

export function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAV_KEY)) ?? [];
  } catch {
    return [];
  }
}

export function saveFavorites(favs) {
  localStorage.setItem(FAV_KEY, JSON.stringify(favs));
}

export function isFavorite(id) {
  const favs = getFavorites();
  return favs.some((x) => String(x.id) === String(id));
}

export function addFavorite(favObj) {
  const favs = getFavorites();
  const exists = favs.some((x) => String(x.id) === String(favObj.id));
  if (exists) return favs;
  const next = [...favs, favObj];
  saveFavorites(next);
  return next;
}

export function removeFavorite(id) {
  const favs = getFavorites();
  const next = favs.filter((x) => String(x.id) !== String(id));
  saveFavorites(next);
  return next;
}

export function toggleFavorite(favObj) {
  const favs = getFavorites();
  const exists = favs.some((x) => String(x.id) === String(favObj.id));
  const next = exists
    ? favs.filter((x) => String(x.id) !== String(favObj.id))
    : [...favs, favObj];

  saveFavorites(next);
  return next;
}