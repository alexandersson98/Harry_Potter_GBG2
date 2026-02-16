
import { HomePage, mountHomePage } from "./pages/HomePage.js";
import { Nav } from "./components/Nav.js";
import { SpellsPage, mountSpellsPage } from "./pages/SpellsPage.js";
import { beastPage, mountBeastPage } from  "./pages/beastspage.js";
import { LocationsPage, mountLocationsPage } from "./pages/LocationsPage.js";


export function createRouter(outletSelector) {
  const outlet = document.querySelector(outletSelector);
  if (!outlet) throw new Error(`Hittar inte element: ${outletSelector}`);

  const header = document.querySelector("#site-header");


  const routes = {
    "/": {
      view: HomePage,
      mount: mountHomePage,
      showNav: true,
    },

    "/spells": {
      view: SpellsPage,
      mount: mountSpellsPage,
      showNav: true,
    },

    "/beasts": {
      view: beastPage,
      mount: mountBeastPage,
      showNav: true,
    },
    
    "/locations": {
      view: LocationsPage,
      mount: mountLocationsPage,
      showNav: true,
    },


    notFound: {
      view: () => `<h1>404</h1><p>Sidan finns inte.</p>`,
      mount: null,
      showNav: true,
    },
  };

  function parseHash() {
    const raw = (location.hash || "#/").slice(1); 
    const [pathPart, queryPart] = raw.split("?");
    const parts = (pathPart || "/").split("/").filter(Boolean);

    const path = parts.length === 0 ? "/" : `/${parts[0]}`;
    const rest = parts.slice(1);
    const params = Object.fromEntries(new URLSearchParams(queryPart || ""));

    return { path, rest, params };
  }

  function ensureNavMounted() {
    if (!header) return;
    if (header.dataset.mounted === "1") return;
    header.innerHTML = Nav();
    header.dataset.mounted = "1";
  }

  function setNavVisible(visible) {
    if (!header) return;
    header.hidden = !visible;
    if (visible) ensureNavMounted();
  }

  async function render() {
    const { path, rest, params } = parseHash();
    const page = routes[path] || routes.notFound;

    setNavVisible(page.showNav !== false);

    const ctx = { path, rest, params };

    outlet.innerHTML = page.view(ctx);
    await page.mount?.(ctx);
  }

  window.addEventListener("hashchange", render);
  render();
}