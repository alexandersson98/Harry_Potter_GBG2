import { getLocations } from "../services/api/locationsApi.js";
import { mapLocation } from "../adapters/mappers/locationMapper.js";
import { locationList } from "../components/locationList.js";
import { getFavorites, toggleFavorite, isFavorite } from "../services/storage/favorites.js";
import { syncFavButtonsIn, toggleFavInGrid, syncFavButton } from "../controllers/favoritesController.js";

export function LocationsPage() {
  return `
    <main class="container">
      <section class="frame" aria-label="Locations">
        <div class="grid">

          <article class="card main-card">
            <div class="hero" aria-label="Hero section">
              <div>
                <p class="kicker">WIZARDING WORLD</p>
                <h1 class="h1">EXPLORE LOCATIONS</h1>
                <p class="lead">Browse magical places from the wizarding world.</p>
                <p>
                  Discover the iconic locations from the Harry Potter universe.
                </p>
              </div>

              <div class="media" aria-label="Featured image">
                <img
                  src="locations.png"
                  alt="Magical location from the wizarding world"
                  loading="lazy"
                />
              </div>
            </div>

            <div class="tools" aria-label="Search and grid">
              <div class="searchrow">
                <label class="sr-only" for="locationSearchInput">Search location</label>
                <input id="locationSearchInput" type="search" placeholder="Search locations..." autocomplete="off" />
                <button id="locationReloadBtn" type="button">Reload</button>
              </div>

              <div class="char-grid" id="locationGrid" aria-label="Locations">
                <div class="meta">Loading...</div>
              </div>

              <p id="locationStatusText" class="meta" aria-live="polite"></p>
            </div>
          </article>

          <aside class="sidebar" aria-label="Sidebar">
            <section class="side-card" aria-label="Tips">
              <h2 class="side-title">Tip</h2>
              <div style="padding:12px">
                <p class="meta" style="margin-top:0">
                  Use the search bar to quickly find locations like "Hogwarts Castle" or "Diagon Alley".
                </p>
              </div>
            </section>

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

            <section class="side-card" aria-label="Favorites (offline)">
              <h2 class="side-title">Favorites</h2>
              <div style="padding:12px">
                <p class="meta" style="margin-top:0">
                  Favorites are saved locally and work offline.
                </p>
                <a class="browse-btn-like" href="#/favorites"
                  style="display:block;text-align:center;border:2px solid rgba(255,255,255,.18);padding:12px;font-weight:900;text-decoration:none;color:rgba(255,255,255,.92);background:rgba(0,0,0,.18);border-radius:14px;">
                  Open favorites
                </a>
              </div>
            </section>
          </aside>

        </div>
      </section>

      <!-- MODAL (popup) -->
      <div class="modal-backdrop" id="locationModalBackdrop" hidden></div>
      ${locationList()}

    </main>
  `;
}

export async function mountLocationsPage() {
  const gridEl = document.getElementById("locationGrid");
  const inputEl = document.getElementById("locationSearchInput");
  const reloadBtn = document.getElementById("locationReloadBtn");
  const statusEl = document.getElementById("locationStatusText");

  const modal = document.getElementById("locationModal");
  const backdrop = document.getElementById("locationModalBackdrop");
  const btnClose = document.getElementById("locationModalClose");
  const titleEl = document.getElementById("locationModalTitle");
  const subEl = document.getElementById("locationModalSub");
  const infoEl = document.getElementById("locationModalInfo");
  const favBtn = document.getElementById("locationModalFav");

  let all = [];
  let shown = [];
  let active = null;
  let lastFocus = null;

  function render(items) {
    if (!items.length) {
      gridEl.innerHTML = `<div class="meta">No results.</div>`;
      return;
    }

    gridEl.innerHTML = items.map(raw => {
      const l = mapLocation(raw);
      const fav = isFavorite(String(l.id), "location");
      return `
        <div class="char-card" tabindex="0" data-open-id="${l.id}">
          <div class="char-imgwrap">
            ${l.image
              ? `<img src="${l.image}" alt="${l.name}" loading="lazy" />`
              : `<div class="char-fallback" aria-hidden="true">📍</div>`
            }
            <button
              class="fav-overlay"
              type="button"
              data-fav-id="${String(l.id)}"
              aria-label="Toggle favorite"
              aria-pressed="${fav ? "true" : "false"}"
              title="${fav ? "Remove favorite" : "Add favorite"}"
            >${fav ? "★" : "☆"}</button>
          </div>
          <div class="char-name">${l.name}</div>
          <div class="meta">${l.type}</div>
        </div>
      `;
    }).join("");
  }

  async function load() {
    gridEl.innerHTML = `<div class="meta">Loading...</div>`;
    statusEl.textContent = "";

    try {
      const data = await getLocations();
      all = Array.isArray(data) ? data : data?.results ?? [];
      shown = [...all];
      render(shown);
      statusEl.textContent = `Showing ${shown.length} locations.`;
    } catch {
      gridEl.innerHTML = `<div class="meta">Could not load data right now.</div>`;
      statusEl.textContent = "If you are offline, cached data may still be available.";
    }
  }

  function openModalById(id) {
    const raw = all.find(x => x.id == id);
    if (!raw) return;

    active = mapLocation(raw);
    active.type = "location";
    active.subtitle = raw.type ?? "—";
    active.fields = [
      { label: "Description", value: raw.description },
    ];

    titleEl.textContent = active.name;
    subEl.textContent = active.type;

    infoEl.innerHTML = `
      <div class="info-grid">
        <div style="grid-column:1/-1">
          <span>Description</span>
          <strong>${active.description}</strong>
        </div>
      </div>
    `;

    syncFavButton(favBtn, active.id, "location");

    lastFocus = document.activeElement;
    backdrop.hidden = false;
    modal.hidden = false;
    btnClose.focus();
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.hidden = true;
    backdrop.hidden = true;
    document.body.style.overflow = "";
    lastFocus?.focus?.();
  }

  gridEl.addEventListener("click", (e) => {
    const favBtnEl = e.target.closest("[data-fav-id]");
    if (favBtnEl) {
      e.stopPropagation();
      const id = decodeURIComponent(favBtnEl.dataset.favId);
      const raw = all.find(x => String(x.id) === id);
      if (!raw) return;
      const mapped = mapLocation(raw);
      mapped.type = "location";
      mapped.subtitle = raw.type ?? "—";
      mapped.fields = [
        { label: "Description", value: raw.description },
      ];
      toggleFavInGrid(id, mapped, favBtnEl);
      return;
    }

    const openEl = e.target.closest("[data-open-id]");
    if (!openEl) return;
    openModalById(openEl.dataset.openId);
  });

  gridEl.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const openEl = e.target.closest("[data-open-id]");
    if (!openEl) return;
    e.preventDefault();
    openModalById(openEl.dataset.openId);
  });

  favBtn.addEventListener("click", () => {
    if (!active) return;
    toggleFavorite(active);
    syncFavButton(favBtn, active.id, "location");
    syncFavButtonsIn(gridEl);
  });

  btnClose.addEventListener("click", closeModal);
  backdrop.addEventListener("click", closeModal);
  window.addEventListener("keydown", (e) => {
    if (!modal.hidden && e.key === "Escape") closeModal();
  });

  inputEl.addEventListener("input", () => {
    const q = inputEl.value.trim().toLowerCase();
    shown = all.filter(l => (l.name ?? "").toLowerCase().includes(q));
    render(shown);
  });

  reloadBtn.addEventListener("click", load);

  await load();
}