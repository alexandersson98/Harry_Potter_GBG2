/* Pages ansvar:
- unikt html skelett för varje sida.
- Definierar sidans struktur (layout placeholders).
- Hanterar mount-logik och dataflöde.
- hämta in återanvändbara delar från components via placeholders.

mount:
- Hämtar data baserat på route-parametrar.
- Stoppar in renderad HTML i rätt placeholders.
- Kopplar ihop data + UI.
*/

import { getCharacters } from "../services/api/characterApi.js";

const FAV_KEY = "wizardpedia:favorites";

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

function loadFavs() {
  try {
    return JSON.parse(localStorage.getItem(FAV_KEY)) ?? [];
  } catch {
    return [];
  }
}
function saveFavs(favs) {
  localStorage.setItem(FAV_KEY, JSON.stringify(favs));
}
function isFav(favs, id) {
  return favs.some((x) => x.id === id);
}

/** Normalisera data från API till “våra” fält */
function mapApiToCard(c) {
  const id = c.id ?? c._id ?? c.name;

  const born = c.dateOfBirth || "—";
  const bloodStatus = c.ancestry ? c.ancestry : "—";

  return {
    id,
    name: c.name ?? "Unknown",
    house: c.house || "—",
    species: c.species || "—",
    actor: c.actor || "—",
    patronus: c.patronus || "—",
    image: c.image || "",
    alive: typeof c.alive === "boolean" ? (c.alive ? "Yes" : "No") : "—",
    ancestry: c.ancestry || "—",
    wizard: typeof c.wizard === "boolean" ? (c.wizard ? "Yes" : "No") : "—",

    // Wiki-liknande fält (hp-api saknar dessa)
    born,
    bloodStatus,
    nationality: "—",
    title: "—",
    physical: "—",
    relationships: "—",
  };
}

export function HomePage() {
  return `
    <main class="container">
      <section class="frame" aria-label="Home">
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
                  src="HP-HP.png"
                  alt="Castle-like view reminiscent of Hogwarts"
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
            <section class="side-card" aria-label="About us">
              <h2 class="side-title">About us</h2>
              <div class="aboutbox"></div>
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

export async function mountHomePage() {
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

  let all = [];
  let shown = [];
  let favs = loadFavs();
  let active = null;
  let lastFocus = null;

  function render(items) {
    if (!items.length) {
      gridEl.innerHTML = `<div class="meta">No results.</div>`;
      return;
    }

    gridEl.innerHTML = items.map(raw => {
      const c = mapApiToCard(raw);
      const fav = isFav(favs, c.id);

      return `
  <div class="char-card" role="button" tabindex="0" data-open-id="${encodeURIComponent(String(c.id))}">
    <div class="char-imgwrap">
      ${c.image
        ? `<img src="${c.image}" alt="${c.name}" loading="lazy" />`
        : `<div class="char-fallback" aria-hidden="true">✨</div>`
      }

      <button
        class="fav-overlay"
        type="button"
        data-fav-id="${String(c.id)}"
        aria-label="Toggle favorite"
        aria-pressed="${fav ? "true" : "false"}"
        title="${fav ? "Remove favorite" : "Add favorite"}"
      >${fav ? "★" : "☆"}</button>
    </div>

    <div class="char-name">${c.name}</div>
  </div>
`;


    }).join("");
  }

  async function load() {
    gridEl.innerHTML = `<div class="meta">Loading...</div>`;
    statusEl.textContent = "";

    try {
      const data = await getCharacters();
      const arr = Array.isArray(data) ? data : data?.results ?? [];

      all = arr.filter(x => MAIN_CHARACTERS.has(x.name));
      shown = [...all];

      render(shown);
      statusEl.textContent = `Showing ${shown.length} main characters.`;
    } catch {
      gridEl.innerHTML = `<div class="meta">Could not load data right now.</div>`;
      statusEl.textContent = "If you are offline, cached data may still be available.";
    }
  }

  function applyFilter() {
    const q = inputEl.value.trim().toLowerCase();
    shown = all.filter(x => (x.name ?? "").toLowerCase().includes(q));
    render(shown);
  }

  function openModalById(id) {
    const raw = all.find(x => String(x.id ?? x._id ?? x.name) === String(id));
    if (!raw) return;

    active = mapApiToCard(raw);

    titleEl.textContent = active.name;
    subEl.textContent = `House: ${active.house} · Patronus: ${active.patronus}`;

    if (active.image) {
      imgEl.src = active.image;
      imgEl.alt = active.name;
      imgEl.style.display = "block";
    } else {
      imgEl.style.display = "none";
    }

    infoEl.innerHTML = `
      <div class="info-grid">
        <div><span>Born</span><strong>${active.born}</strong></div>
        <div><span>Blood status</span><strong>${active.bloodStatus}</strong></div>
        <div><span>House</span><strong>${active.house}</strong></div>
        <div><span>Patronus</span><strong>${active.patronus}</strong></div>
        <div><span>Actor</span><strong>${active.actor}</strong></div>
        <div><span>Wizard</span><strong>${active.wizard}</strong></div>
        <div><span>Alive</span><strong>${active.alive}</strong></div>
        <div><span>Species</span><strong>${active.species}</strong></div>
      </div>
    `;

    const fav = isFav(favs, active.id);
    favBtn.textContent = fav ? "★ Favorite" : "☆ Favorite";
    favBtn.setAttribute("aria-pressed", fav ? "true" : "false");

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

  function toggleFavById(id) {
    const raw = all.find(x => String(x.id ?? x._id ?? x.name) === String(id));
    if (!raw) return;

    const mapped = mapApiToCard(raw);
    const exists = isFav(favs, mapped.id);

    favs = exists ? favs.filter(x => x.id !== mapped.id) : [...favs, mapped];
    saveFavs(favs);
  }

  gridEl.addEventListener("click", (e) => {
    const favBtnEl = e.target.closest("[data-fav-id]");
    if (favBtnEl) {
      e.stopPropagation();
      const id = favBtnEl.dataset.favId;
      const pressed = favBtnEl.getAttribute("aria-pressed") === "true";
      toggleFavById(id);
      favBtnEl.setAttribute("aria-pressed", String(!pressed));
      favBtnEl.textContent = !pressed ? "★" : "☆";
      return;
    }

    const openEl = e.target.closest("[data-open-id]");
    if (!openEl) return;
    openModalById(decodeURIComponent(openEl.dataset.openId));
  });

  btnClose.addEventListener("click", closeModal);
  backdrop.addEventListener("click", closeModal);
  window.addEventListener("keydown", (e) => {
    if (!modal.hidden && e.key === "Escape") closeModal();
  });

  favBtn.addEventListener("click", () => {
    if (!active) return;
    const exists = isFav(favs, active.id);
    toggleFavById(active.id);
    favBtn.textContent = exists ? "☆ Favorite" : "★ Favorite";
    favBtn.setAttribute("aria-pressed", exists ? "false" : "true");
    render(shown);
  });

  inputEl.addEventListener("input", applyFilter);
  reloadBtn.addEventListener("click", load);

  await load();
}
