/* Pages ansvar:
- unikt html skelett för varje sida.
- Definierar sidans struktur (layout placeholders).
- Hanterar mount-logik och dataflöde.
- Hämtar in återanvändbara delar från components via placeholders.
*/

import { getCharacters } from "../services/api/characterApi.js";
import {
  mapCharacterToListCard,
  mapCharacterToDetails,
} from "../adapters/mappers/characterMapper.js";
import { cardGrid } from "../components/cards/cardGrid.js";
import { getFavorites, toggleFavorite } from "../services/storage/favorites.js";

const TYPE = "character";

/** Bara huvudkaraktärer (matcha exakt namn från API) */
const MAIN_CHARACTERS = new Set([
  "Harry Potter",
  "Hermione Granger",
  "Ron Weasley",
  "Ginny Weasley",
  "Neville Longbottom",
  "Luna Lovegood",
  "Lord Voldemort",
  "Draco Malfoy",
  "Albus Dumbledore",
  "Severus Snape",
]);

function rawId(raw) {
  return String(raw?.id ?? raw?._id ?? raw?.name ?? "");
}

function decodeId(x) {
  try {
    return decodeURIComponent(String(x ?? ""));
  } catch {
    return String(x ?? "");
  }
}

function buildFavKeySet() {
  // Din favorites har shape: { type, id, ... }
  return new Set(
    getFavorites()
      .filter((f) => String(f?.type) === TYPE)
      .map((f) => String(f.id))
  );
}

export function CharactersPage() {
  return `
    <main class="container">
      <section class="frame" aria-label="Characters">
        <div class="grid">

          <article class="card main-card">
            <div class="hero" aria-label="Hero section">
              <div>
                <p class="kicker">YOUR LEGACY IS WHAT YOU MAKE IT</p>
                <h1 class="h1">LIVE THE UNWRITTEN</h1>
                <p class="lead">Welcome to the Wizarding World of Harry Potter!</p>
                <p>
                  Browse characters and save your favorites.
                  The app also works offline once it has been loaded.
                </p>
              </div>

              <div class="media" aria-label="Featured image">
                <img
                  src="characters.png"
                  alt="Featured characters"
                  loading="lazy"
                />
              </div>
            </div>

            <div class="tools" aria-label="Search and grid">
              <div class="searchrow">
                <label class="sr-only" for="searchInput">Search character</label>
                <input id="searchInput" type="search" placeholder="Search by name..." autocomplete="off" />
                <button id="reloadBtn" type="button">Reload</button>
              </div>

              <div class="char-grid" id="characterGrid" aria-label="Characters">
                <div class="meta">Loading...</div>
              </div>

              <p id="statusText" class="meta" aria-live="polite"></p>
            </div>
          </article>

          <aside class="sidebar" aria-label="Sidebar">
            <section class="side-card" aria-label="Tips">
              <h2 class="side-title">Tip</h2>
              <div style="padding:12px">
                <p class="meta" style="margin-top:0">
                  Use the search bar to quickly find characters like “Harry Potter” or “Lord Voldemort”.
                </p>
              </div>
            </section>

            <section aria-label="Browse">
              <h2 class="browse-title">BROWSE</h2>
              <div class="browsebtns">
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
      <div class="modal-backdrop" id="charModalBackdrop" hidden></div>

      <div class="modal" id="charModal" role="dialog" aria-modal="true" aria-labelledby="charModalTitle" hidden>
        <button class="modal-close" id="charModalClose" type="button" aria-label="Close">×</button>

        <div class="modal-head">
          <h2 id="charModalTitle" class="modal-title">Title</h2>
          <p id="charModalSub" class="modal-sub">House · Species</p>
        </div>

        <div class="modal-body">
          <div class="modal-left">
            <img id="charModalImg" class="modal-img" alt="" />
            <button id="charModalFav" class="modal-fav" type="button">☆ Favorite</button>
          </div>

          <div class="modal-right" id="charModalInfo"></div>
        </div>
      </div>

    </main>
  `;
}

export async function mountCharactersPage() {
  const gridEl = document.getElementById("characterGrid");
  const inputEl = document.getElementById("searchInput");
  const reloadBtn = document.getElementById("reloadBtn");
  const statusEl = document.getElementById("statusText");

  const modal = document.getElementById("charModal");
  const backdrop = document.getElementById("charModalBackdrop");
  const btnClose = document.getElementById("charModalClose");
  const titleEl = document.getElementById("charModalTitle");
  const subEl = document.getElementById("charModalSub");
  const imgEl = document.getElementById("charModalImg");
  const infoEl = document.getElementById("charModalInfo");
  const favBtn = document.getElementById("charModalFav");

  let allRaw = [];
  let shownRaw = [];
  let activeRaw = null; // <- spara raw objektet (enklare än att leta via id)
  let lastFocus = null;

  function render(rawItems) {
    const favSet = buildFavKeySet();

    const cards = rawItems.map((raw) => {
      const id = rawId(raw);
      return mapCharacterToListCard(raw, { isFavorite: favSet.has(id) });
    });

    gridEl.innerHTML = cardGrid({ items: cards });
  }

  async function load() {
    gridEl.innerHTML = `<div class="meta">Loading...</div>`;
    statusEl.textContent = "";

    try {
      const data = await getCharacters();
      const arr = Array.isArray(data) ? data : data?.results ?? [];

      allRaw = arr.filter((x) => MAIN_CHARACTERS.has(x?.name));
      shownRaw = [...allRaw];

      render(shownRaw);
      statusEl.textContent = `Showing ${shownRaw.length} main characters.`;
    } catch (e) {
      gridEl.innerHTML = `<div class="meta">Could not load data right now.</div>`;
      statusEl.textContent =
        "If you are offline, cached data may still be available.";
      console.error(e);
    }
  }

  function applyFilter() {
    const q = inputEl.value.trim().toLowerCase();
    shownRaw = allRaw.filter((x) => (x?.name ?? "").toLowerCase().includes(q));
    render(shownRaw);
  }

  function openModal(raw) {
    if (!raw) return;

    const favSet = buildFavKeySet();
    const id = rawId(raw);

    const details = mapCharacterToDetails(raw, {
      isFavorite: favSet.has(id),
    });

    // Viktigt: din favorites.js kräver type + id
    details.type = TYPE;

    activeRaw = raw;

    titleEl.textContent = details.name;
    subEl.textContent = `House: ${details.house} · Patronus: ${details.patronus}`;

    if (details.image) {
      imgEl.src = details.image;
      imgEl.alt = details.name;
      imgEl.style.display = "block";
    } else {
      imgEl.style.display = "none";
    }

    infoEl.innerHTML = `
      <div class="info-grid">
        <div><span>Born</span><strong>${details.born}</strong></div>
        <div><span>Blood status</span><strong>${details.bloodStatus}</strong></div>
        <div><span>House</span><strong>${details.house}</strong></div>
        <div><span>Patronus</span><strong>${details.patronus}</strong></div>
        <div><span>Actor</span><strong>${details.actor}</strong></div>
        <div><span>Wizard</span><strong>${details.wizard}</strong></div>
        <div><span>Alive</span><strong>${details.alive}</strong></div>
        <div><span>Species</span><strong>${details.species}</strong></div>
      </div>
    `;

    favBtn.textContent = details.isFavorite ? "★ Favorite" : "☆ Favorite";
    favBtn.setAttribute("aria-pressed", details.isFavorite ? "true" : "false");

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

  function toggleFavForRaw(raw) {
    if (!raw) return;

    const favSet = buildFavKeySet();
    const id = rawId(raw);

    // Spara "details" som fav, så FavoritesPage kan visa mer info senare
    const details = mapCharacterToDetails(raw, { isFavorite: favSet.has(id) });

    // VIKTIGT: din favorites storage använder type:id som key
    details.type = TYPE;

    toggleFavorite(details);
  }

  // --- Events ---
  gridEl.addEventListener("click", (e) => {
    // Favorite toggle
    const favEl = e.target.closest("[data-fav-id]");
    if (favEl) {
      e.stopPropagation();
      const id = decodeId(favEl.dataset.favId);
      const raw = allRaw.find((x) => rawId(x) === id);
      if (!raw) return;

      toggleFavForRaw(raw);
      render(shownRaw);

      // (valfritt) uppdatera aria-pressed direkt om du vill:
      // favEl.setAttribute("aria-pressed", buildFavKeySet().has(id) ? "true" : "false");
      return;
    }

    // Open modal
    const openEl = e.target.closest("[data-open-id]");
    if (!openEl) return;

    const id = decodeId(openEl.dataset.openId);
    const raw = allRaw.find((x) => rawId(x) === id);
    openModal(raw);
  });

  gridEl.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const openEl = e.target.closest("[data-open-id]");
    if (!openEl) return;
    e.preventDefault();

    const id = decodeId(openEl.dataset.openId);
    const raw = allRaw.find((x) => rawId(x) === id);
    openModal(raw);
  });

  btnClose.addEventListener("click", closeModal);
  backdrop.addEventListener("click", closeModal);
  window.addEventListener("keydown", (e) => {
    if (!modal.hidden && e.key === "Escape") closeModal();
  });

  favBtn.addEventListener("click", () => {
    if (!activeRaw) return;

    toggleFavForRaw(activeRaw);
    render(shownRaw);

    const nowFav = buildFavKeySet().has(rawId(activeRaw));
    favBtn.textContent = nowFav ? "★ Favorite" : "☆ Favorite";
    favBtn.setAttribute("aria-pressed", nowFav ? "true" : "false");
  });

  inputEl.addEventListener("input", applyFilter);
  reloadBtn.addEventListener("click", load);

  await load();
}