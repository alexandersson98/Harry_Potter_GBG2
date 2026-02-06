import './styles/style.css';
import { nav } from "./components/Nav.js";
import { footer } from "./components/Footer.js";

const app = document.querySelector("#app");

app.innerHTML = `
    <header id="site-header"></header>
    <main id="outlet"><main>
    <footer id="site-footer"></footer>
    `;

createRouter( "#outlet" );