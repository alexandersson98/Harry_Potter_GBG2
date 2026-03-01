// src/pages/FavoritesPage.js
import { getFavorites, removeFavorite } from "../services/storage/favorites.js";
import { createModalController, mountModal } from "../controllers/modalController.js";
import { modalCard } from "../components/cards/modalCard.js";
import { syncFavButtonsIn } from "../controllers/favoritesController.js";

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

const TYPE_ORDER = ["character", "beast", "location", "spell"];
const TYPE_LABELS = {
  character: "Characters",
  beast: "Beasts",
  location: "Locations",
  spell: "Spells",
};

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

            <div class="tools" aria-label="Search and favorites">
              <div class="searchrow">
                <label class="sr-only" for="favSearchInput">Search favorites</label>
                <input
                  id="favSearchInput"
                  type="search"
                  placeholder="Search favorites by name..."
                  autocomplete="off"
                />
              </div>

              <div id="favoritesGrid" aria-label="Favorites">
                <div class="meta">Loading...</div>
              </div>

              <p id="favoritesStatus" class="meta" aria-live="polite"></p>
            </div>
          </article>

          <aside class="sidebar" aria-label="Sidebar">
            <section aria-label="Browse">
              <h2 class="browse-title">BROWSE</h2>
              <div class="browsebtns">
                <a href="#/">Home</a>
                <a href="#/characters">Characters</a>
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

      ${modalCard("favChar")}
      ${modalCard("favBeast")}
      ${modalCard("favLocation")}
    </main>
  `;
}

export function mountFavoritesPage() {
  const gridEl = document.getElementById("favoritesGrid");
  const inputEl = document.getElementById("favSearchInput");
  const statusEl = document.getElementById("favoritesStatus");

  let favs = getFavorites();

  const ctrls = {
    character: createModalController({ backdropId: "favCharModalBackdrop", modalId: "favCharModal", closeId: "favCharModalClose" }),
    beast:     createModalController({ backdropId: "favBeastModalBackdrop", modalId: "favBeastModal", closeId: "favBeastModalClose" }),
    location:  createModalController({ backdropId: "favLocationModalBackdrop", modalId: "favLocationModal", closeId: "favLocationModalClose" }),
  };

  const prefixes = { character: "favChar", beast: "favBeast", location: "favLocation" };

  function openModal(item) {
    const type = item.type;
    const ctrl = ctrls[type];
    const prefix = prefixes[type];
    if (!ctrl || !prefix) return;

    const detail = {
      id: item.id,
      name: item.name,
      image: item.image ?? "",
      subtitle: item.subtitle ?? "",
      fields: item.fields ?? [],
      type,
    };

    ctrl.open(
      detail,
      () => mountModal(prefix, detail),
      () => syncFavButtonsIn(gridEl)
    );
  }

  function renderCardItem(c) {
    const id = escapeHtml(c.id);
    const type = escapeHtml(c.type ?? "");
    const name = escapeHtml(c.name ?? "Unknown");
    const img = c.image
      ? `<img src="${escapeHtml(c.image)}" alt="${name}" loading="lazy" />`
      : `<div class="char-fallback" aria-hidden="true">✨</div>`;

    return `
      <div class="char-card" tabindex="0" data-open-fav="${id}" data-open-type="${type}">
        <div class="char-imgwrap">
          ${img}
          <button
            class="fav-overlay"
            type="button"
            data-remove-id="${id}"
            data-remove-type="${type}"
            aria-label="Remove favorite: ${name}"
            aria-pressed="true"
            title="Remove favorite"
          >★</button>
        </div>
        <div class="char-name">${name}</div>
      </div>
    `;
  }

  function renderSpellItem(c) {
    const id = escapeHtml(c.id);
    const name = escapeHtml(c.name ?? "Unknown");
    const description = escapeHtml(c.description ?? c.subtitle ?? "—");

    return `
      <div class="spell-item">
        <div class="spell-item-content">
          <div class="spell-item-name">${name}</div>
          <div class="spell-item-desc">${description}</div>
        </div>
        <button
          class="fav-overlay-spell"
          type="button"
          data-remove-id="${id}"
          data-remove-type="spell"
          aria-label="Remove favorite: ${name}"
          aria-pressed="true"
          title="Remove favorite"
        >★</button>
      </div>
    `;
  }

  function render(items) {
    if (!items.length) {
      gridEl.innerHTML = `
        <div class="meta">
          No favorites yet. Go to
          <a href="#/characters">Characters</a>,
          <a href="#/locations">Locations</a>,
          <a href="#/spells">Spells</a> or
          <a href="#/beasts">Beasts</a>
          and press ☆.
        </div>
      `;
      statusEl.textContent = "";
      return;
    }

    const groups = {};
    for (const item of items) {
      const type = item.type ?? "character";
      if (!groups[type]) groups[type] = [];
      groups[type].push(item);
    }

    gridEl.innerHTML = TYPE_ORDER
      .filter(type => groups[type]?.length)
      .map(type => {
        const label = TYPE_LABELS[type] ?? type;
        const isSpell = type === "spell";

        const itemsHtml = isSpell
          ? `<div class="fav-spell-list">${groups[type].map(renderSpellItem).join("")}</div>`
          : `<div class="char-grid">${groups[type].map(renderCardItem).join("")}</div>`;

        return `
          <div class="fav-section">
            <h2 class="fav-section-title">${label}</h2>
            ${itemsHtml}
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

  render(favs);

  inputEl.addEventListener("input", applyFilter);

  gridEl.addEventListener("click", (e) => {
    const removeBtn = e.target.closest("[data-remove-id]");
    if (removeBtn) {
      e.preventDefault();
      e.stopPropagation();
      const id = removeBtn.getAttribute("data-remove-id");
      const type = removeBtn.getAttribute("data-remove-type");
      favs = removeFavorite(id, type);
      applyFilter();
      return;
    }

    const card = e.target.closest("[data-open-fav]");
    if (card) {
      const id = card.dataset.openFav;
      const type = card.dataset.openType;
      const item = favs.find(f => String(f.id) === String(id) && String(f.type) === String(type));
      if (item) openModal(item);
    }
  });

  gridEl.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const card = e.target.closest("[data-open-fav]");
    if (!card) return;
    e.preventDefault();
    const id = card.dataset.openFav;
    const type = card.dataset.openType;
    const item = favs.find(f => String(f.id) === String(id) && String(f.type) === String(type));
    if (item) openModal(item);
  });
}