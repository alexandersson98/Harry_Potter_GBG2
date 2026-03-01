Wizardpedia – Harry Potter Wiki PWA

Wizardpedia är en Progressive Web App (PWA) byggd som en Harry Potter-wiki där användare kan bläddra bland karaktärer, platser, magiska varelser och trollformler. Appen fungerar offline och kan installeras som en PWA via webbläsaren.

📌 Datakällor och backend-arkitektur

Appen består av sidor för:

Characters

Spells

Locations

Beasts

Eftersom det externa API:t inte hade endpoints för Locations och Beasts implementerades en lokal lösning med json-server och statisk data.

Development-läge

I utvecklingsläge används Vite proxy:

/api → json-server (localhost:3001)

/remote-api → https://hp-api.onrender.com/api

Environment variables:

VITE_API_BASE=/remote-api
VITE_LOCAL_API_BASE=/api

Detta innebär:

Characters och Spells hämtas från det externa API:t

Locations och Beasts hämtas från lokal json-server

Produktionsläge (GitHub Pages)

Environment variables:

VITE_API_BASE=https://hp-api.onrender.com/api
VITE_LOCAL_API_BASE=/Harry_Potter_GBG2

I production:

Locations och Beasts laddas från en statisk db.json som bundlas i builden

Characters och Spells hämtas från det externa API:t

📱 PWA-konfiguration
Web App Manifest

name: Wizardpedia

short_name: Wizardpedia

display: standalone

start_url: /Harry_Potter_GBG2/

scope: /Harry_Potter_GBG2/

Konfigurerat för GitHub Pages base path.

Service Worker och caching

Service worker registreras via vite-plugin-pwa.

Caching-strategier:

App shell (HTML, CSS, JS, bilder) precachas vid build

Externa API-anrop använder NetworkFirst-strategi

Cache livslängd: 24 timmar

🌙 Offline-funktionalitet
Data	Offline direkt	Kräver online-besök
Beasts	✅ Ja	❌ Nej
Locations	✅ Ja	❌ Nej
Characters	⚠️ Begränsat	✅ Ja
Spells	⚠️ Begränsat	✅ Ja

Offline-banner visas automatiskt

Favoriter sparas i localStorage

⚠️ Kända begränsningar

Characters och Spells kräver första online-besök

Externa API:et kan vara otillgängligt

Om cache är tom kan data inte visas offline

📦 Installation och körning
Installera beroenden
npm install
Development

Starta json-server:

npm run api

Starta utvecklingsserver:

npm run dev

Dessa måste köras i två separata terminaler.

Produktion

Bygg projektet:

npm run build

Förhandsgranska produktionen:

npm run preview

I produktion behövs inte json-server.

🚀 Deployment

Projektet är deployat via GitHub Pages med base path:

/Harry_Potter_GBG2/

Konfigurerat i:

vite.config.js (base)

Web App Manifest (start_url & scope)

navigateFallback i PWA-konfiguration

♿ Tillgänglighet

Projektet använder:

Semantisk HTML

aria-label på interaktiva element

aria-live och role="alert" på statusmeddelanden

aria-modal på modaler

Full tangentbordsnavigering

Escape-tangent för att stänga modaler

Accessibility-fix

Problem: Interaktiva element var nästlade (div med role="button" innehöll <button>)

Fix: Tog bort role="button, behöll tabindex="0", lade till keyboard events (Enter + Space)

Resultat: 0 issues i Axe DevTools efter fix

Testat med: Axe DevTools, WCAG 2.1 AA

👥 Gruppmedlemmar

Adnan

Robin

Lukas








Accessibility Report – Wizardpedia
Verktyg
Axe DevTools (Chrome-tillägg), WCAG 2.1 AA

Vad vi hittade
Vi körde axe DevTools på följande sidor:

Characters — 10 issues
Locations — 10 issues
Favorites — issues

Alla fel var av samma typ:
"Interactive controls must not be nested" (Serious)
Problemet var att kort-elementen (div.char-card) hade role="button" samtidigt som de innehöll en <button> (favorit-knappen med klassen fav-overlay). Detta bryter mot WCAG 2.1 regel 4.1.2 (Name, Role, Value) och skapar problem för skärmläsare och tangentbordsnavigering eftersom interaktiva element inte får nästlas i varandra.
html<!-- FEL - före fix -->
<div class="char-card" role="button" tabindex="0">
  <button class="fav-overlay">☆</button>
</div>

Vad vi fixade
Vi tog bort role="button" från alla kort-element i:

cardTile.js — påverkar Characters och Beasts
LocationsPage.js — påverkar Locations
FavoritesPage.js — påverkar Favorites

html<!-- RÄTT - efter fix -->
<div class="char-card" tabindex="0">
  <button class="fav-overlay">☆</button>
</div>
tabindex="0" behölls så korten fortfarande är nåbara via tangentbord. Vi lade även till keydown-eventlyssnare (Enter/Space) på alla grids så korten fortfarande kan öppnas med tangentbord.

Resultat efter fix
Alla sidor fick 0 issues i axe DevTools efter åtgärderna.