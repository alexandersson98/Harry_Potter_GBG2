/*  här lägger vi HTML kod som ska vara återanvändbar som tex navbar och footer så man enkelt kan lägga in den vart man vill ha den. underlättar skalbarhet och testning*/

import { getCharacters, updateCharacter } from "../services/api.js";

export async function renderCharacterList() {
  const container = document.querySelector("#character-list");
  if (!container) return;

  // Hämta alla karaktärer från JSON Server
  const characters = await getCharacters();

  // Rensa innehållet först
  container.innerHTML = "";

  characters.forEach(character => {
    const div = document.createElement("div");
    div.classList.add("character-card"); // kan användas i CSS

    div.innerHTML = `
      <h3>${character.name}</h3>
      <p><strong>House:</strong> ${character.house}</p>
      <p><strong>Age:</strong> ${character.age}</p>
      <p><strong>Favorite Spell:</strong> ${character.favoriteSpell}</p>
      <p><strong>Role:</strong> ${character.role}</p>
      <p><strong>Gender:</strong> ${character.gender}</p>
      <button class="favorite-btn">
        ${character.favorite ? "★ Favorit" : "☆ Favorit"}
      </button>
    `;

    // Event listener för favorit-knappen
    const button = div.querySelector(".favorite-btn");
    button.addEventListener("click", async () => {
      await updateCharacter(character.id, { favorite: !character.favorite });
      renderCharacterList(); // uppdatera listan direkt
    });

    container.appendChild(div);
  });
}