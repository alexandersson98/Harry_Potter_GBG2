const BASE_URL = "http://localhost:3000";

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