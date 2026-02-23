// src/pages/FavoritesPage.js
import { getFavorites, removeFavorite } from "../services/storage/favorites.js";

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function FavoritesPage() {
  return `
    <main class="container">
      <section class="frame" aria-label="Favorites">
        <div class="grid">

          <article class="card main-card">
            <div class="hero" aria-label="Favorites header">
              <div>
                <p class="kicker">YOUR SAVED MAGIC</p>
                <h1 class="h1">FAVORITES</h1>
                <p class="lead">These are stored locally and work offline.</p>
              </div>
            </div>

            <div class="tools" aria-label="Search and favorites grid">
              <div class="searchrow">
                <label class="sr-only" for="favSearchInput">Search favorites</label>
                <input
                  id="favSearchInput"
                  type="search"
                  placeholder="Search favorites by name..."
                  autocomplete="off"
                />
              </div>

              <div class="char-grid" id="favoritesGrid" aria-label="Favorite characters">
                <div class="meta">Loading...</div>
              </div>

              <p id="favoritesStatus" class="meta" aria-live="polite"></p>
            </div>
          </article>

          <aside class="sidebar" aria-label="Sidebar">
            <section aria-label="Browse">
              <h2 class="browse-title">BROWSE</h2>
              <div class="browsebtns">
                <a href="#/">Characters</a>
                <a href="#/locations">Locations</a>
                <a href="#/spells">Spells</a>
                <a href="#/beasts">Beasts</a>
              </div>
            </section>

            <section class="side-card" aria-label="Tip">
              <h2 class="side-title">Offline</h2>
              <div style="padding:12px">
                <p class="meta" style="margin-top:0">
                  Favorites are saved in localStorage, so they remain visible even when offline.
                </p>
              </div>
            </section>
          </aside>

        </div>
      </section>
    </main>
  `;
}

export function mountFavoritesPage() {
  const gridEl = document.getElementById("favoritesGrid");
  const inputEl = document.getElementById("favSearchInput");
  const statusEl = document.getElementById("favoritesStatus");

  let favs = getFavorites();

  function render(items) {
    if (!items.length) {
      gridEl.innerHTML = `
        <div class="meta">
          No favorites yet. Go to <a href="#/">Characters</a> and press ☆.
        </div>
      `;
      statusEl.textContent = "";
      return;
    }

    gridEl.innerHTML = items
      .map((c) => {
        const id = escapeHtml(c.id);
        const name = escapeHtml(c.name ?? "Unknown");
        const img = c.image
          ? `<img src="${escapeHtml(c.image)}" alt="${name}" loading="lazy" />`
          : `<div class="char-fallback" aria-hidden="true">✨</div>`;

        
        return `
          <div class="char-card">
            <div class="char-imgwrap">
              ${img}

              <button
                class="fav-overlay"
                type="button"
                data-remove-id="${id}"
                aria-label="Remove favorite: ${name}"
                aria-pressed="true"
                title="Remove favorite"
              >★</button>
            </div>

            <div class="char-name">${name}</div>

            <!-- Extra fält i listan (kravet) men med befintlig .meta style -->
            <div class="meta">House: ${escapeHtml(c.house ?? "—")}</div>
            <div class="meta">Species: ${escapeHtml(c.species ?? "—")}</div>
          </div>
        `;
      })
      .join("");
  }

  function applyFilter() {
    const q = (inputEl.value || "").trim().toLowerCase();
    const filtered = !q
      ? favs
      : favs.filter((x) => (x.name || "").toLowerCase().includes(q));

    render(filtered);
    statusEl.textContent = q ? `Showing ${filtered.length} of ${favs.length}` : "";
  }

  // första render
  render(favs);

  // sök
  inputEl.addEventListener("input", applyFilter);

  // remove
  gridEl.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-remove-id]");
    if (!btn) return;

    const id = btn.getAttribute("data-remove-id");
    favs = removeFavorite(id);

    applyFilter();
  });
}