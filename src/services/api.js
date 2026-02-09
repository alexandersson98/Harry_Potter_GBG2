/*service klasserna ska innehålla logik för localstorage, api, server, */

// Bas-URL för JSON Server
const BASE_URL = "http://localhost:3001";

// Hämta alla karaktärer
export async function getCharacters() {
  const response = await fetch(`${BASE_URL}/characters`);
  return response.json();
}

// Hämta en karaktär via id
export async function getCharacterById(id) {
  const response = await fetch(`${BASE_URL}/characters/${id}`);
  return response.json();
}

// Lägg till en ny karaktär
export async function addCharacter(character) {
  const response = await fetch(`${BASE_URL}/characters`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(character)
  });
  return response.json();
}

// Uppdatera karaktär (t.ex. favorit)
export async function updateCharacter(id, data) {
  const response = await fetch(`${BASE_URL}/characters/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return response.json();
}

// Ta bort karaktär
export async function deleteCharacter(id) {
  const response = await fetch(`${BASE_URL}/characters/${id}`, {
    method: "DELETE"
  });
  return response.json();
}