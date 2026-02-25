export function Nav() {
  return `
    <header class="site-header">
      <div class="container">
        <nav class="navbar" aria-label="Mainnav">
          <span class="brand">Wizardpedia - Harry Potter Wiki</span>

          <div class="burger-wrap">
            <button class="burger" id="burgerBtn" type="button"
              aria-label="Öppna meny" aria-expanded="false">
              ☰
            </button>
            <div class="dropdown-menu" id="navLinks" style="display:none;">
              <a href="#/">Home</a>
              <a href="#/characters">Characters</a>
              <a href="#/locations">Locations</a>
              <a href="#/spells">Spells</a>
              <a href="#/beasts">Beasts</a>
              <a href="#/favorites">Favorites</a>
            </div>
          </div>
        </nav>

        <div class="offline-banner" id="offlineBanner" role="alert" aria-live="polite">
          Du är offline – viss data kanske inte är uppdaterad.
        </div>
      </div>
    </header>
  `;
}