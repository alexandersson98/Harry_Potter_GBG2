


export function createRouter(appSelector) {
  const appRoot = document.querySelector(appSelector);
  if (!appRoot) throw new Error(`Hittar inte elementet: ${appSelector}`);

  /*på routes lägger vi in navigering tex*/
    
  const routes = {
    home: {
      view: HomePage,
      mount: mountHomePage
    },
  };
  
  /*lägger till id till url tex posts om det behövs för att se en speciell inlaggd bild eller tråd på en viss sida. */
  function parseHash() {
    const raw = (location.hash || "#home").slice(1); 
    const [route, query] = raw.split("?");
    const params = Object.fromEntries(new URLSearchParams(query || ""));
    return { route, params };
  }
    

  async function render() {
    const { route, params } = parseHash();
    const pageFn = routes[route] || routes.home;



    const header = document.querySelector("#site-header");
    const hideNavroutes = ["lägg in route vi ska dölja navbar från."]
    const hideNav = hideNavroutes.includes(route);


    if(!hideNav) {
      header.replaceChildren();
    }
      else {
        header.innerHTML = navBar();
      }
    
    appRoot.innerHTML = pageFn.view(params);

    await pageFn.mount?.(params);
  }

  window.addEventListener("hashchange", render);
  render();
}