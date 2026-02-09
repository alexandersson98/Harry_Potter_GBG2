import { HomePage, initHomePage } from "./pages/HomePage.js";

export function createRouter(appSelector) {
  const outlet = document.querySelector(appSelector);
  if (!outlet) throw new Error(`Element not found: ${appSelector}`);

  const routes = {
    "/": { view: HomePage, mount: initHomePage }
  };

  function parseHash() {
    const raw = (location.hash || "#/").slice(1); // tar bort "#"
    const [pathPart, queryPart] = raw.split("?");
    const parts = pathPart.split("/").filter(Boolean);

    const path = parts.length === 0 ? "/" : `/${parts[0]}`;
    const rest = parts.slice(1);
    const params = Object.fromEntries(new URLSearchParams(queryPart || ""));

    return { path, rest, params };
  }

  async function render() {
    try {
      const { path, rest, params } = parseHash();

      // placeholder för "#/character/:id"
      if (path === "/character") {
        const id = rest[0];
        outlet.innerHTML = `
          <section class="container">
            <div class="frame">
              <h1>Details page</h1>
              <p>Character ID: <strong>${id ?? "missing"}</strong></p>
              <p><a href="#/">Back</a></p>
            </div>
          </section>
        `;
        return;
      }

      const page = routes[path] || routes["/"];
      outlet.innerHTML = await page.view(params);
      if (page.mount) await page.mount(params);

    } catch (err) {
      console.error("Router render error:", err);
      outlet.innerHTML = `
        <section class="container">
          <div class="frame">
            <h1>Something went wrong</h1>
            <p>Open the Console for details. (The page should not be blank.)</p>
            <p><a href="#/">Try again</a></p>
          </div>
        </section>
      `;
    }
  }

  window.addEventListener("hashchange", render);
  render();
}
