import './styles/style.css';
import { nav } from "./components/Nav.js";
import { footer } from "./components/Footer.js";
import { createRouter } from "./router.js";

const app = document.querySelector("#app");

app.innerHTML = `
    <header id="site-header"></header>
    <main id="outlet"></main>
    <footer id="site-footer"></footer>
`;

// Lägg in nav och footer
document.querySelector("#site-header").appendChild(nav());
document.querySelector("#site-footer").appendChild(footer());

// Starta router
createRouter("#outlet");