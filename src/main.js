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

/* Offline banner + burger menu*/
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

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = links.style.display === "flex";
    links.style.display = isOpen ? "none" : "flex";
    btn.setAttribute("aria-expanded", String(!isOpen));
  });

  document.addEventListener("click", () => {
    links.style.display = "none";
    btn.setAttribute("aria-expanded", "false");
  });
}

wireOfflineBanner();
wireBurgerMenu();

document.addEventListener("keydown", (e) => {
  const focusable = Array.from(
    document.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex="0"]'
    )
  ).filter(el => !el.closest("[hidden]"));

  const current = document.activeElement;
  const index = focusable.indexOf(current);
  if (index === -1) return;

  let next = null;

  if (e.key === "ArrowRight" || e.key === "ArrowDown") {
    e.preventDefault();
    next = focusable[index + 1] ?? focusable[0];
  } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
    e.preventDefault();
    next = focusable[index - 1] ?? focusable[focusable.length - 1];
  }

  next?.focus();
});


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

