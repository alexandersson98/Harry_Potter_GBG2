import { getCharacters } from "../services/api/characterApi.js";
import {mapCharacterToListCard, mapCharacterToDetails,} from "../adapters/mappers/characterMapper.js";
import { cardGrid } from "../components/cards/cardGrid.js";
import { modalCard } from "../components/cards/modalCard.js";
import { getFavorites } from "../services/storage/favorites.js";
import { createModalController, mountModal } from "../controllers/modalController.js";
import { toggleFavInGrid, syncFavButtonsIn } from "../controllers/favoritesController.js";

const TYPE = "character";
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

function favSetForType() {
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
            <div class="hero" aria-label="Characters hero section">
              <div>
                <p class="kicker">HARRY POTTER MAIN CHARACTERS</p>
                <h1 class="h1">LIVE THE UNWRITTEN</h1>
                <p class="lead">Welcome to the Wizarding World of Harry Potter!</p>
                <p>
                  Browse characters and save your favorites.
                  The app also works offline once it has been loaded.
                </p>
              </div>

              <div class="media" aria-label="Featured character image">
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
                  Use the search bar to quickly find characters like "Harry Potter" or "Lord Voldemort".
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
      ${modalCard("character")}
    </main>
  `;
}

export async function mountCharactersPage() {
  const gridEl = document.getElementById("characterGrid");
  const statusEl = document.getElementById("statusText");
  const inputEl = document.getElementById("searchInput");
  const reloadBtn = document.getElementById("reloadBtn");
  const ctrl = createModalController({
    backdropId: "characterModalBackdrop",
    modalId: "characterModal",
    closeId: "characterModalClose",
  });

  let rawArr = [];
  let shown = [];

  function render(list) {
    const favs = favSetForType();

    const cardItems = list.map((raw) => {
      const vm = mapCharacterToListCard(raw);
      return { ...vm, isFavorite: favs.has(String(vm.id)) };
    });

    gridEl.innerHTML = cardGrid({ items: cardItems });
  }

  async function load() {
    gridEl.innerHTML = `<div class="meta">Loading...</div>`;
    statusEl.textContent = "";

    try {
      const data = await getCharacters();
      const arr = Array.isArray(data) ? data : data?.results ?? [];

      rawArr = arr.filter((x) => MAIN_CHARACTERS.has(x?.name));
      shown = [...rawArr];

      render(shown);
      statusEl.textContent = `Showing ${shown.length} main characters.`;
    } catch (e) {
      gridEl.innerHTML = `<div class="meta">Could not load data right now</div>`;
      statusEl.textContent = "If you are offline, cached data may still be available.";
      console.error(e);
    }
  }

  function applyFilter() {
    const q = inputEl.value.trim().toLowerCase();
    shown = rawArr.filter((x) => (x?.name ?? "").toLowerCase().includes(q));
    render(shown);
    statusEl.textContent = `Showing ${shown.length} main characters.`;
  }

  await load();

  inputEl.addEventListener("input", applyFilter);
  reloadBtn.addEventListener("click", load);

  gridEl.addEventListener("click", (e) => {
    const openEl = e.target.closest("[data-open-id]");
    const favEl = e.target.closest("[data-fav-id]");

    if (favEl) {
      e.preventDefault();
      e.stopPropagation();
      const id = decodeURIComponent(favEl.dataset.favId);
      const raw = rawArr.find((x) => rawId(x) === String(id));
      if (!raw) return;
      const mapped = mapCharacterToDetails(raw);
      mapped.type = TYPE;
      toggleFavInGrid(id, mapped, favEl);
      render(shown);
      return;
    }

    if (openEl) {
      const id = decodeURIComponent(openEl.dataset.openId);
      const raw = rawArr.find((x) => rawId(x) === String(id));
      if (!raw) return;

      const detail = mapCharacterToDetails(raw);
      detail.type = TYPE;

      ctrl.open(
        detail,
        () => mountModal("character", detail),
        () => { syncFavButtonsIn(gridEl); }
      );
    }
  });

  gridEl.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const openEl = e.target.closest("[data-open-id]");
    if (!openEl) return;

    e.preventDefault();
    const id = decodeURIComponent(openEl.dataset.openId);
    const raw = rawArr.find((x) => rawId(x) === String(id));
    if (!raw) return;

    const detail = mapCharacterToDetails(raw);
    detail.type = TYPE;

    ctrl.open(
      detail,
      () => mountModal("character", detail),
      () => { syncFavButtonsIn(gridEl); }
    );
  });
}