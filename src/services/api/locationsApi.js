// src/services/api/locationsApi.js
const BASE_URL = "/api/locations"; 

async function safeFetchJson(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("API_ERROR");
    return await res.json();
  } catch {
    throw new Error("NETWORK_ERROR");
  }
}

export async function getLocations() {
  return safeFetchJson(`${BASE_URL}/locations`);
}