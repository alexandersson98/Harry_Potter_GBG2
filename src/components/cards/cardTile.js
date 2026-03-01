export function cardTile({ id, name, image, isFavorite }) {
  return `
    <div class="char-card" tabindex="0" data-open-id="${encodeURIComponent(String(id))}">
      <div class="char-imgwrap">
        ${
          image
            ? `<img src="${image}" alt="${name}" loading="lazy" />`
            : `<div class="char-fallback" aria-hidden="true">✨</div>`
        }
        <button class="fav-overlay" type="button" aria-label="Toggle favorite" aria-pressed="${isFavorite ? 'true' : 'false'}" data-fav-id="${encodeURIComponent(String(id))}">${isFavorite ? "★" : "☆"}</button>
      </div>
      <div class="char-name">${name}</div>
    </div>
  `;
}