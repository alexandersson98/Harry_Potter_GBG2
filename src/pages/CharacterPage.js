import { getCharacters } from "../services/api.js";

export async function renderCharacterPage() {
  const app = document.querySelector("#app");
  if (!app) return;

  // Rensa appen först
  app.innerHTML = `
    <section class="character-page">
      <h1>Harry Potter Characters</h1>
      <div class="character-grid" id="character-grid"></div>
    </section>
  `;

  const grid = document.querySelector("#character-grid");

  // Hämta karaktärer från JSON Server
  const characters = await getCharacters();

  characters.forEach(character => {
    const card = document.createElement("div");
    card.classList.add("character-card");

    // Vi använder en placeholderbild för alla karaktärer
    const img = document.createElement("img");
    img.src = "https://via.placeholder.com/150"; // här kan ni senare byta ut mot riktiga bilder
    img.alt = character.name;

    const name = document.createElement("h3");
    name.textContent = character.name;

    const button = document.createElement("button");
    button.textContent = "Read More";

    // Event listener för read more
    button.addEventListener("click", () => {
      // Visa detaljer i en alert (enkelt test)
      alert(`
Name: ${character.name}
House: ${character.house}
Age: ${character.age}
Role: ${character.role}
Favorite Spell: ${character.favoriteSpell}
Gender: ${character.gender}
      `);
    });

    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(button);

    grid.appendChild(card);
  });
}