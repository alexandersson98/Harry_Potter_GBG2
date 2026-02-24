import { isFavorite, toggleFavorite, } from "../services/storage/favorites";

export function toggleFavInGrid(id, mapped, btnEl) {
  console.log("toggleFavInGrid", id, mapped);
  toggleFavorite(mapped);
  const nowFav = isFavorite(id);
  btnEl.textContent = nowFav ? "★" : "☆";
  btnEl.setAttribute("aria-pressed", String(nowFav));
}

export function syncFavButton(btn, id) {
  const fav = isFavorite(id);
  btn.textContent = fav ? "★ Favorite" : "☆ Favorite";
  btn.setAttribute("aria-pressed", String(fav));
}

export function handleFavBtnClick(mapped, btn, onRender) {
  toggleFavorite(mapped);
  syncFavButton(btn, mapped.id);
  if (typeof onRender === "function") onRender();
}