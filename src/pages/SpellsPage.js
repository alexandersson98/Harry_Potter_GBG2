import { getSpells } from "../services/api/spellsApi.js";
import { getFavorites } from "../services/storage/favorites.js";
import { toggleFavInGrid } from "../controllers/favoritesController.js";

const TYPE = "spell";

function favSetForType() {
  return new Set(
    getFavorites()
      .filter((f) => String(f?.type) === TYPE)
      .map((f) => String(f.id))
  );
}

function spellListItem(raw, isFavorite) {
  const id = encodeURIComponent(String(raw?.id ?? raw?.name));
  const name = raw?.name ?? "Unknown";
  const description = raw?.description ?? "—";

  return `
    <div class="spell-item" tabindex="0">
      <div class="spell-item-content">
        <div class="spell-item-name">${name}</div>
        <div class="spell-item-desc">${description}</div>
      </div>
      <button
        class="fav-overlay-spell"
        type="button"
        aria-label="Toggle favorite"
        aria-pressed="${isFavorite ? 'true' : 'false'}"
        data-fav-id="${id}"
      >${isFavorite ? "★" : "☆"}</button>
    </div>
  `;
}

function groupAlphabetically(spells) {
  const groups = {};
  for (const spell of spells) {
    const letter = (spell?.name?.[0] ?? "#").toUpperCase();
    if (!groups[letter]) groups[letter] = [];
    groups[letter].push(spell);
  }
  return groups;
}

export function SpellsPage() {
  return `
    <main class="container">
      <section class="frame" aria-label="Spells">
        <div class="grid">

          <article class="card main-card">
            <div class="hero" aria-label="Spells hero section">
              <div>
                <p class="kicker">SPELLBOOK</p>
                <h1 class="h1">MASTER THE MAGIC</h1>
                <p class="lead">Browse spells and learn what they do.</p>
                <p>Search spells by name. Works offline after you have loaded it once.</p>
              </div>

              <div class="media" aria-label="Featured image">
                <img src="hpvsvoldemort.png" alt="Spells / battle themed header image" loading="lazy" />
              </div>
            </div>

            <div class="tools" aria-label="Search and list">
              <div class="searchrow">
                <label class="sr-only" for="spellSearchInput">Search spell</label>
                <input id="spellSearchInput" type="search" placeholder="Search spells..." autocomplete="off" />
                <button id="spellReloadBtn" type="button">Reload</button>
              </div>

              <div class="spell-alphabet" id="spellAlphabet" aria-label="Filter by letter">
                <button class="alpha-btn active" data-letter="ALL">All</button>
                ${Array.from("ABCDEFGHIJKLMNOPQRSTUVW").map(l =>
                  `<button class="alpha-btn" data-letter="${l}">${l}</button>`
                ).join("")}
              </div>

              <div id="spellList" aria-label="Spells">
                <div class="meta">Loading...</div>
              </div>

              <p id="spellStatusText" class="meta" aria-live="polite"></p>
            </div>
          </article>

          <aside class="sidebar" aria-label="Sidebar">
            <section class="side-card" aria-label="Tips">
              <h2 class="side-title">Tip</h2>
              <div style="padding:12px">
                <p class="meta" style="margin-top:0">
                  Use the search bar to quickly find spells like "Accio" or "Expelliarmus".
                </p>
              </div>
            </section>

            <section aria-label="Browse">
              <h2 class="browse-title">BROWSE</h2>
              <div class="browsebtns">
                <a href="#/">Home</a>
                <a href="#/characters">Characters</a>
                <a href="#/locations">Locations</a>
                <a href="#/spells" aria-current="page">Spells</a>
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
    </main>
  `;
}

export async function mountSpellsPage() {
  const listEl = document.getElementById("spellList");
  const statusEl = document.getElementById("spellStatusText");
  const inputEl = document.getElementById("spellSearchInput");
  const reloadBtn = document.getElementById("spellReloadBtn");
  const alphaEl = document.getElementById("spellAlphabet");

  let rawArr = [];
  let shown = [];
  let activeLetter = "ALL";

  function render(list) {
    const favs = favSetForType();

    if (!list.length) {
      listEl.innerHTML = `<div class="meta">No results.</div>`;
      return;
    }

    const sorted = [...list].sort((a, b) =>
      (a?.name ?? "").localeCompare(b?.name ?? "")
    );

    const groups = groupAlphabetically(sorted);

    listEl.innerHTML = Object.keys(groups).sort().map(letter => `
      <div class="spell-group">
        <div class="spell-group-letter">${letter}</div>
        ${groups[letter].map(raw => spellListItem(raw, favs.has(String(raw?.id ?? raw?.name)))).join("")}
      </div>
    `).join("");
  }

  function getFiltered() {
    const q = inputEl.value.trim().toLowerCase();
    let filtered = rawArr.filter((x) => (x?.name ?? "").toLowerCase().includes(q));
    if (activeLetter !== "ALL") {
      filtered = filtered.filter(x => (x?.name?.[0] ?? "").toUpperCase() === activeLetter);
    }
    return filtered;
  }

  async function load() {
    listEl.innerHTML = `<div class="meta">Loading...</div>`;
    statusEl.textContent = "";

    try {
      const data = await getSpells();
      rawArr = Array.isArray(data) ? data : data?.results ?? [];
      shown = [...rawArr];
      render(shown);
      statusEl.textContent = `Showing ${shown.length} spells.`;
    } catch (e) {
      listEl.innerHTML = `<div class="meta">Could not load data right now</div>`;
      statusEl.textContent = "If you are offline, cached data may still be available.";
      console.error(e);
    }
  }

  await load();

  inputEl.addEventListener("input", () => {
    shown = getFiltered();
    render(shown);
    statusEl.textContent = `Showing ${shown.length} spells.`;
  });

  reloadBtn.addEventListener("click", load);

  alphaEl.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-letter]");
    if (!btn) return;
    activeLetter = btn.dataset.letter;
    alphaEl.querySelectorAll(".alpha-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    shown = getFiltered();
    render(shown);
    statusEl.textContent = `Showing ${shown.length} spells.`;
  });

  listEl.addEventListener("click", (e) => {
    const favEl = e.target.closest("[data-fav-id]");
    if (!favEl) return;
    e.preventDefault();
    e.stopPropagation();
    const id = decodeURIComponent(favEl.dataset.favId);
    const raw = rawArr.find((x) => String(x?.id ?? x?.name) === id);
    if (!raw) return;
    const mapped = { id, name: raw.name, type: TYPE, description: raw.description ?? "" };
    toggleFavInGrid(id, mapped, favEl);
  });
}