import "./styles/style.css";
import { Nav } from "./components/Nav.js";
import { Footer } from "./components/Footer.js";
import { createRouter } from "./router.js";

const app = document.querySelector("#app");

app.innerHTML = `
  <header id="site-header"></header>
  <main id="outlet"></main>
  <footer id="site-footer"></footer>
`;

document.querySelector("#site-header").innerHTML = Nav();
document.querySelector("#site-footer").innerHTML = Footer();

// Router renderar sidor inne i #outlet
createRouter("#outlet");

/* Offline banner + burger menu (om ni har id:n i Nav.js) */
function wireOfflineBanner() {
  const banner = document.getElementById("offlineBanner");
  if (!banner) return;

  const update = () => {
    banner.style.display = navigator.onLine ? "none" : "block";
  };

  window.addEventListener("online", update);
  window.addEventListener("offline", update);
  update();
}

function wireBurgerMenu() {
  const btn = document.getElementById("burgerBtn");
  const links = document.getElementById("navLinks");
  if (!btn || !links) return;

  btn.addEventListener("click", () => {
    const isOpen = links.style.display === "flex";
    links.style.display = isOpen ? "none" : "flex";
    links.style.flexDirection = "column";
    links.style.gap = "10px";
    btn.setAttribute("aria-expanded", String(!isOpen));
  });
}

wireOfflineBanner();
wireBurgerMenu();

/* Service Worker (PWA) */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      await navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`);
    } catch {
      // ska inte krascha om SW failar
    }
  });
}
