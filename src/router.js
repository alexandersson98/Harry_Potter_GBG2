import { renderCharacterPage } from "../Pages/CharacterPage.js";
// import { mountHomePage } from "../Pages/HomePage.js";

export function createRouter(outletSelector) {
  const outlet = document.querySelector(outletSelector);
  if (!outlet) throw new Error("Hittar inte outlet");

  const routes = {
    home: {
      view: () => "<h1>Home</h1>", // kan lämnas tom
      mount: async () => {
        outlet.innerHTML = "<h1>Home Page</h1>"; // tillfällig home
      }
    },
    characters: {
      view: () => "", // routern bryr sig inte om HTML
      mount: async () => {
        await renderCharacterPage(); // CharacterPage renderar allt i #outlet
      }
    }
  };

  function parseHash() {
    return (location.hash || "#home").slice(1);
  }

  async function render() {
    const route = parseHash();
    const page = routes[route] || routes.home;

    outlet.innerHTML = page.view();
    await page.mount();
  }

  window.addEventListener("hashchange", render);
  window.addEventListener("load", render);
}
