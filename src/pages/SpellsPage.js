import { getSpells } from "../services/api.js";

export function SpellsPage() {
  return `
    <main class="container">
      <section class="frame" aria-label="Spells">
        <div class="grid">
          <article class="card main-card">
            <div class="hero" aria-label="Hero section">
              <div>
                <p class="kicker">SPELLBOOK</p>
                <h1 class="h1">MASTER THE MAGIC</h1>
                <p class="lead">Browse spells and learn what they do.</p>
                <p>
                  Search spells by name. Works offline after you have loaded it once.
                </p>
              </div>

              <div class="media" aria-label="Featured image">
                <img
                  src="public/hpvsvoldemort.png"
                  alt="Spells / battle themed header image"
                  loading="lazy"
                />
              </div>
            </div>

            <div class="tools" aria-label="Search and grid">
              <div class="searchrow">
                <label class="sr-only" for="spellSearchInput">Search spell</label>
                <input id="spellSearchInput" type="search" placeholder="Search spells..." autocomplete="off" />
                <button id="spellReloadBtn" type="button">Reload</button>
              </div>

              <div class="char-grid" id="spellGrid" aria-label="Spells">
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
                  Use the search bar to quickly find spells like “Accio” or “Expelliarmus”.
                </p>
              </div>
            </section>

            <section aria-label="Browse">
              <h2 class="browse-title">BROWSE</h2>
              <div class="browsebtns">
                <a href="#/characters">Characters</a>
                <a href="#/locations">Locations</a>
                <a href="#/spells" aria-current="page">Spells</a>
                <a href="#/beasts">Beasts</a>
              </div>
            </section>
          </aside>
        </div>
      </section>

      <!-- MODAL -->
      <div class="modal-backdrop" id="spellModalBackdrop" hidden></div>

      <div class="modal" id="spellModal" role="dialog" aria-modal="true" aria-labelledby="spellModalTitle" hidden>
        <button class="modal-close" id="spellModalClose" type="button" aria-label="Close">×</button>

        <div class="modal-head">
          <h2 id="spellModalTitle" class="modal-title">Spell</h2>
          <p id="spellModalSub" class="modal-sub">Type · Effect</p>
        </div>

        <div class="modal-body">
          <div class="modal-right" id="spellModalInfo"></div>
        </div>
      </div>
    </main>
  `;
}

export async function mountSpellsPage() {
  const gridEl = document.getElementById("spellGrid");
  const inputEl = document.getElementById("spellSearchInput");
  const reloadBtn = document.getElementById("spellReloadBtn");
  const statusEl = document.getElementById("spellStatusText");

  const modal = document.getElementById("spellModal");
  const backdrop = document.getElementById("spellModalBackdrop");
  const btnClose = document.getElementById("spellModalClose");
  const titleEl = document.getElementById("spellModalTitle");
  const subEl = document.getElementById("spellModalSub");
  const infoEl = document.getElementById("spellModalInfo");

  let all = [];
  let shown = [];
  let lastFocus = null;

  function normSpell(s) {
    return {
      id: s.id ?? s._id ?? s.name,
      name: s.name ?? "Unknown",
      description: s.description ?? "—",
      type: s.type ?? "—",
    };
  }

  function render(items) {
    if (!items.length) {
      gridEl.innerHTML = `<div class="meta">No results.</div>`;
      return;
    }

    gridEl.innerHTML = items
      .map((raw) => {
        const s = normSpell(raw);
        return `
          <div class="char-card" role="button" tabindex="0" data-open-id="${encodeURIComponent(String(s.id))}">
            <div class="char-imgwrap">
              <div class="char-fallback" aria-hidden="true">✨</div>
            </div>
            <div class="char-name">${s.name}</div>
            <div class="meta" style="padding:0 12px 12px">${s.type}</div>
          </div>
        `;
      })
      .join("");
  }

  async function load() {
    gridEl.innerHTML = `<div class="meta">Loading...</div>`;
    statusEl.textContent = "";

    try {
      const data = await getSpells();
      const arr = Array.isArray(data) ? data : data?.results ?? [];

      all = arr;
      shown = [...all];

      render(shown);
      statusEl.textContent = `Showing ${shown.length} spells.`;
    } catch (e) {
      console.error(e);
      gridEl.innerHTML = `<div class="meta">Could not load spells right now.</div>`;
      statusEl.textContent = "If you are offline, cached data may still be available.";
    }
  }

  function applyFilter() {
    const q = inputEl.value.trim().toLowerCase();
    shown = all.filter((x) => (x.name ?? "").toLowerCase().includes(q));
    render(shown);
  }

  function openModalById(id) {
    const raw = all.find((x) => String(x.id ?? x._id ?? x.name) === String(id));
    if (!raw) return;

    const s = normSpell(raw);

    titleEl.textContent = s.name;
    subEl.textContent = `Type: ${s.type}`;
    infoEl.innerHTML = `
      <div class="info-grid">
        <div style="grid-column:1/-1">
          <span>Description</span>
          <strong>${s.description}</strong>
        </div>
      </div>
    `;

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
    const openEl = e.target.closest("[data-open-id]");
    if (!openEl) return;
    openModalById(decodeURIComponent(openEl.dataset.openId));
  });

  btnClose.addEventListener("click", closeModal);
  backdrop.addEventListener("click", closeModal);
  window.addEventListener("keydown", (e) => {
    if (!modal.hidden && e.key === "Escape") closeModal();
  });

  inputEl.addEventListener("input", applyFilter);
  reloadBtn.addEventListener("click", load);

  await load();
}
