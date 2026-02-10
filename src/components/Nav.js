export function Nav() {
  return `
    <header class="site-header">
      <div class="container">
        <nav class="navbar" aria-label="Huvudnavigering">
          <a class="brand" href="#/">Wizardpedia - Harry Potter Wiki</a>

          <div class="navlinks" id="navLinks">
            <a href="#/characters">🔍 Browse Characters</a>
            <a href="#/favorites">⭐ Favorites</a>
            <a href="#/about">About us</a>
          </div>

          <button class="burger" id="burgerBtn" type="button"
            aria-label="Öppna meny" aria-expanded="false">
            ☰
          </button>
        </nav>

        <div class="offline-banner" id="offlineBanner" role="alert" aria-live="polite">
          Du är offline – viss data kanske inte är uppdaterad.
        </div>
      </div>
    </header>
  `;
}
