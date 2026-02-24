// src/adapters/mappers/characterMapper.js
export function mapCharacterToListCard(raw, { isFavorite = false } = {}) {
  const id = raw?.id ?? raw?._id ?? raw?.name;

  return {
    type: "character",
    id: String(id),
    name: raw?.name ?? "Unknown",
    image: raw?.image ?? "",
    isFavorite: Boolean(isFavorite),
  };
}

export function mapCharacterToDetails(raw, { isFavorite = false } = {}) {
  const id = raw?.id ?? raw?._id ?? raw?.name;

  return {
    type: "character",
    id: String(id),

    name: raw?.name ?? "Unknown",
    image: raw?.image ?? "",

    house: raw?.house || "—",
    species: raw?.species || "—",
    actor: raw?.actor || "—",
    patronus: raw?.patronus || "—",

    alive:
      typeof raw?.alive === "boolean" ? (raw.alive ? "Yes" : "No") : "—",
    wizard:
      typeof raw?.wizard === "boolean" ? (raw.wizard ? "Yes" : "No") : "—",

    born: raw?.dateOfBirth || "—",
    bloodStatus: raw?.ancestry || "—",

    // placeholders (hp-api saknar “wiki fields”)
    nationality: "—",
    title: "—",
    physical: "—",
    relationships: "—",

    isFavorite: Boolean(isFavorite),
  };
}