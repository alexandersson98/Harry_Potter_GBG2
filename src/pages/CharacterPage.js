import { getCharacters } from "../services/api.js";

export async function renderCharacterPage() {
  const app = document.querySelector("#outlet"); // targeta routerns outlet
  if (!app) return;

  app.innerHTML = `
    <section class="character-page">
      <h1>Harry Potter Characters</h1>
      <div class="character-grid"></div>
    </section>
  `;

  const grid = app.querySelector(".character-grid");

  const characters = await getCharacters();

  characters.forEach(character => {
    const card = document.createElement("div");
    card.classList.add("character-card");

    const img = document.createElement("img");
    img.src = "https://via.placeholder.com/150";
    img.alt = character.name;

    const name = document.createElement("h3");
    name.textContent = character.name;

    const button = document.createElement("button");
    button.textContent = "Read More";

    button.addEventListener("click", () => {
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