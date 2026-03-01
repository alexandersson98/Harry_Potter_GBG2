/* Pages ansvar:
- unikt html skelett för varje sida.
- Definierar sidans struktur (layout placeholders).
- Hanterar mount-logik och dataflöde (om det behövs).
- hämta in återanvändbara delar från components via placeholders.
*/

export function HomePage() {
  return `
    <main class="container">
      <section class="frame" aria-label="Home">
        <div class="grid">

          <article class="card main-card">
            <div class="hero" aria-label="Hero section">
              <div>
                <p class="kicker">YOUR LEGACY IS WHAT YOU MAKE IT</p>
                <h1 class="h1">WIZARDPEDIA</h1>
                <p class="lead">A Harry Potter Wiki for curious witches, wizards — and Muggles.</p>

                <div class="home-copy" aria-label="Welcome text">
                  <p>
                    Step into the Wizarding World, where moving staircases shift without warning,
                    portraits whisper secrets, and ancient spells still echo through castle halls.
                    From the candlelit corridors of Hogwarts to the bustling alleys of Diagon Alley,
                    magic isn’t just a subject — it’s a way of life.
                  </p>

                  <h2 class="home-h2">What you can explore</h2>
                  <p>
                    Wizardpedia is a small encyclopedic guide built for exploration. Browse iconic
                    characters, revisit famous locations, learn about magical creatures, and discover
                    spells that range from everyday charms to powerful and dangerous curses.
                  </p>

                  <h2 class="home-h2">Favorites & offline</h2>
                  <p>
                    Build your own little archive by saving favorites. Favorites are stored locally on
                    your device, which means they remain available even when you’re offline — perfect
                    for quick lookups when the connection disappears.
                  </p>

                  <h2 class="home-h2">A note for readers</h2>
                  <p>
                    This project is a student-built PWA (Progressive Web App). Our focus is semantic HTML,
                    accessibility, keyboard-friendly navigation, and a smooth offline experience through caching.
                    If something fails to load, try refreshing while online — cached content may still be available offline.
                  </p>
                </div>
              </div>

              <!-- EXAKT samma class som på CharactersPage -->
              <div class="media" aria-label="Featured image">
                <img
                  src="HP-HP.png"
                  alt="Wizardpedia icon with magical green light"
                  loading="lazy"
                />
              </div>
            </div>
          </article>

          <aside class="sidebar" aria-label="Sidebar">
            <section class="side-card" aria-label="About us">
              <h2 class="side-title">About us</h2>
              <div class="aboutbox">
                <p class="meta" style="margin:0">
                  Wizardpedia is a student-built Harry Potter wiki app created by three students from Gothenburg, 
                  Sweden, as part of a Frontend & Accessibility course. Our goal was to build a fully functional 
                  Progressive Web App (PWA) that works offline, is keyboard navigable, and follows modern accessibility standards. 
                  We focused on clean code structure, teamwork, and creating an experience worthy of the Wizarding World.
                </p>
              </div>
            </section>

            <section aria-label="Browse">
              <h2 class="browse-title">BROWSE</h2>
              <div class="browsebtns">
                <a href="#/">Home</a>
                <a href="#/characters">Characters</a>
                <a href="#/locations">Locations</a>
                <a href="#/spells">Spells</a>
                <a href="#/beasts">Beasts</a>
              </div>
            </section>

            <section class="side-card" aria-label="Favorites (offline)">
              <h2 class="side-title">Favorites</h2>
              <div style="padding:12px">
                <p class="meta" style="margin-top:0">
                  Favorites are saved locally and work offline.
                </p>
                <a class="browse-btn-like" href="#/favorites"
                  style="display:block;text-align:center;border:2px solid rgba(255,255,255,.18);padding:12px;font-weight:900;text-decoration:none;color:rgba(255,255,255,.92);background:rgba(0,0,0,.18);border-radius:14px;">
                  Open favorites
                </a>
              </div>
            </section>
          </aside>

        </div>
      </section>
    </main>
  `;
}

export async function mountHomePage() {
  // Start page is static.
}