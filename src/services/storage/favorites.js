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

function matches(x, id, type) {
  if (type) {
    return String(x.id) === String(id) && String(x.type) === String(type);
  }
  return String(x.id) === String(id);
}

export function isFavorite(id, type) {
  const favs = getFavorites();
  return favs.some((x) => matches(x, id, type));
}

export function addFavorite(favObj) {
  const favs = getFavorites();
  const exists = favs.some((x) => matches(x, favObj.id, favObj.type));
  if (exists) return favs;
  const next = [...favs, favObj];
  saveFavorites(next);
  return next;
}

export function removeFavorite(id, type) {
  const favs = getFavorites();
  const next = favs.filter((x) => !matches(x, id, type));
  saveFavorites(next);
  return next;
}

export function toggleFavorite(favObj) {
  const favs = getFavorites();
  const exists = favs.some((x) => matches(x, favObj.id, favObj.type));
  const next = exists
    ? favs.filter((x) => !matches(x, favObj.id, favObj.type))
    : [...favs, favObj];

  saveFavorites(next);
  return next;
}