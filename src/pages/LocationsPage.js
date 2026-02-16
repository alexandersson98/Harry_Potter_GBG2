import { getLocations } from "../services/api/locationsApi.js";
import { mapLocation } from "../domain/mappers/locationMapper.js";

export function LocationsPage() {
  return `
    <main class="container">
      <section class="frame" aria-label="Locations">
        <div class="grid">
          <article class="card main-card">

            <div class="hero">
              <div>
                <p class="kicker">WIZARDING WORLD</p>
                <h1 class="h1">EXPLORE LOCATIONS</h1>
                <p class="lead">Browse magical places from the wizarding world.</p>
              </div>
            </div>

            <div class="tools">
              <div class="searchrow">
                <input id="locationSearchInput" type="search" placeholder="Search locations..." />
                <button id="locationReloadBtn">Reload</button>
              </div>

              <div class="char-grid" id="locationGrid">
                <div class="meta">Loading...</div>
              </div>

              <p id="locationStatusText" class="meta"></p>
            </div>
          </article>
        </div>
      </section>

      <!-- MODAL -->
      <div class="modal-backdrop" id="locationModalBackdrop" hidden></div>

      <div class="modal" id="locationModal" hidden>
        <button class="modal-close" id="locationModalClose">×</button>

        <div class="modal-head">
          <h2 id="locationModalTitle"></h2>
          <p id="locationModalSub"></p>
        </div>

        <div class="modal-body">
          <div class="modal-right" id="locationModalInfo"></div>
        </div>
      </div>
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

  let all = [];
  let shown = [];
  let lastFocus = null;

  function render(items) {
    gridEl.innerHTML = items.map(raw => {
      const l = mapLocation(raw);
      return `
        <div class="char-card" role="button" tabindex="0" data-open-id="${l.id}">
          <div class="char-imgwrap">
            <div class="char-fallback">📍</div>
          </div>
          <div class="char-name">${l.name}</div>
          <div class="meta">${l.type}</div>
        </div>
      `;
    }).join("");
  }

  async function load() {
    const data = await getLocations();
    all = data;
    shown = [...all];
    render(shown);
    statusEl.textContent = `Showing ${shown.length} locations.`;
  }

  function openModalById(id) {
    const raw = all.find(x => x.id == id);
    if (!raw) return;

    const l = mapLocation(raw);

    titleEl.textContent = l.name;
    subEl.textContent = l.type;

    infoEl.innerHTML = `
      <div class="info-grid">
        <div style="grid-column:1/-1">
          <span>Description</span>
          <strong>${l.description}</strong>
        </div>

        <div>
          <span>Characters</span>
          <strong>${l.characters.join(", ") || "—"}</strong>
        </div>

        <div>
          <span>Beasts</span>
          <strong>${l.beasts.join(", ") || "—"}</strong>
        </div>

        <div>
          <span>Spells</span>
          <strong>${l.spells.join(", ") || "—"}</strong>
        </div>
      </div>
    `;

    lastFocus = document.activeElement;
    backdrop.hidden = false;
    modal.hidden = false;
    btnClose.focus();
  }

  function closeModal() {
    modal.hidden = true;
    backdrop.hidden = true;
    lastFocus?.focus?.();
  }

  gridEl.addEventListener("click", e => {
    const el = e.target.closest("[data-open-id]");
    if (!el) return;
    openModalById(el.dataset.openId);
  });

  btnClose.addEventListener("click", closeModal);
  backdrop.addEventListener("click", closeModal);
  inputEl.addEventListener("input", () => {
    const q = inputEl.value.toLowerCase();
    shown = all.filter(l => l.name.toLowerCase().includes(q));
    render(shown);
  });

  reloadBtn.addEventListener("click", load);

  await load();
}