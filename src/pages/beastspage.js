import { beastList } from "../components/beastCard"
import { getBeast } from "../services/api/beastsApi";
import { getBeasts } from "../services/api/beastsApi";

export function beastPage(){
    return `
        <main class="container">
  <section class="frame" aria-label="Beasts">
    <div class="grid">

      <article class="card main-card">
        <div class="hero" aria-label="Beasts hero section">
          <div>
            <p class="kicker">MAGICAL CREATURES OF THE WIZARDING WORLD</p>
            <h1 class="h1">DISCOVER THE BEASTS</h1>
            <p class="lead">Explore magical beasts from the Wizarding World!</p>
            <p>
              Browse magical creatures and save your favorites.
              The app also works offline once it has been loaded.
            </p>
          </div>

          <div class="media" aria-label="Featured beast image">
            <img
              src="HP-HP.png"
              alt="Magical creature from the Wizarding World"
              loading="lazy"
            />
          </div>
        </div>

        <div class="tools" aria-label="Search and grid">
          <div class="searchrow">
            <label class="sr-only" for="searchBeastInput">Search beast</label>
            <input id="searchBeastInput" type="search" placeholder="Search by name..." autocomplete="off" />
            <button id="reloadBeastsBtn" type="button">Reload</button>
          </div>

          <div class="char-grid" id="beastGrid" aria-label="Beasts">
            <div class="meta">Loading...</div>
          </div>

          <p id="beastStatusText" class="meta" aria-live="polite"></p>
        </div>
      </article>

      <aside class="sidebar" aria-label="Sidebar">
        <section class="side-card" aria-label="About beasts">
          <h2 class="side-title">About beasts</h2>
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
  <div class="modal-backdrop" id="beastModalBackdrop" hidden></div>
</main>
    `;
}

export async function mountBeastPage(){
    document.querySelector("#beastModalBackdrop").innerHTML = beastList();

    const gridEl = document.getElementById("beastGrid");
    const statusEl = document.getElementById("beastStatusText");

    function renderBeasts(gridEl, beasts){
     gridEl.innerHTML = beasts.map(b => `
      <div class="meta">
      <img src="${b.image}" alt="${b.name}">
      <div>${b.name}</div>
      </div>
      `).join("");
    }

    
       
    async function load() {
    gridEl.innerHTML = `<div class="meta">Loading...</div>`;
    statusEl.textContent = "";

    try {
    const data = await getBeasts();
    const arr = Array.isArray(data) ? data : data?.results ?? [];

    renderBeasts(gridEl, arr);
    statusEl.textContent = `showing ${arr.length} beasts`;
  } catch (e) {
    gridEl.innerHTML = `<div class="meta">Could not load data right now</div>`;
    statusEl.textContent = "If you are offline, cached data may still be available.";
    console.error(e);
  }
}
    load();
  }


