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


function spawnMagicClick(x, y) {
  // main glow ring
  const spark = document.createElement("div");
  spark.className = "magic-spark";
  spark.style.left = `${x}px`;
  spark.style.top = `${y}px`;
  document.body.appendChild(spark);

  // remove after animation
  spark.addEventListener("animationend", () => spark.remove());

  // optional particles (4 st)
  for (let i = 0; i < 4; i++) {
    const p = document.createElement("div");
    p.className = "magic-particle";
    p.style.left = `${x}px`;
    p.style.top = `${y}px`;

    const angle = Math.random() * Math.PI * 2;
    const dist = 18 + Math.random() * 22; // px
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;

    p.style.setProperty("--dx", `${dx}px`);
    p.style.setProperty("--dy", `${dy}px`);

    document.body.appendChild(p);
    p.addEventListener("animationend", () => p.remove());
  }
}

// Run on clicks/taps
window.addEventListener("pointerdown", (e) => {
  // ignore right click
  if (e.button === 2) return;

  // ignore clicks on inputs
  const tag = e.target?.tagName?.toLowerCase();
  if (tag === "input" || tag === "textarea") return;

  spawnMagicClick(e.clientX, e.clientY);
}, { passive: true });

