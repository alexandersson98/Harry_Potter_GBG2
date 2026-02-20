Vi har skapat sidor för Locations, Characters, Spells och Beasts.
Eftersom att hp-api-onrender.com saknar endpoints för locations och beasts har vi implementerat en lokal json-server med en db.json fil.

vi har skapat två proxys under utvecklingsläge för att göra anrop till rätt backend (npm run dev)
så hp-api-onrender.com/api(VITE_API_BASE) används för characters och spells.
våran lokala json-server(localhost:3001)(VITE_LOCAL_API_BASE) används för locations och beasts.

i produktionsläge är våran lokala json-server inte tillgänglig då eftersom att den inte är deployad. Därför visas bara data från det externa API:t i produktionsläge. (npm run preview).

vite proxy är endast aktivt under utvecklingsläge och i det färdiga produktionsbygget. 

Anledningen till detta är för att vi har härmat utseendet på harry potter wiki och kollade inte vad det fanns för data att hämta innan det var lite för sent. Därav har vi gjort en liten egen lösning för att slippa radera fördig kod.
