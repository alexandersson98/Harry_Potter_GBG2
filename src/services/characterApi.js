// src/services/api.js
// Service: ansvarar för API-anrop och ev. hjälpfunktioner för fetch.

const BASE_URL = "https://hp-api.onrender.com/api";

async function safeFetchJson(url, options) {
  try {
    const res = await fetch(url, options);

    if (!res.ok) {
      // användarvänligt fel, utan teknisk jargong i UI
      throw new Error("API_ERROR");
    }

    return await res.json();
  } catch (err) {
    // nätverksfel/offline/etc
    throw new Error("NETWORK_ERROR");
  }
}

export async function getCharacters() {
  return safeFetchJson(`${BASE_URL}/characters`);
}

export async function getSpells() {
  return safeFetchJson(`${BASE_URL}/spells`);
}
