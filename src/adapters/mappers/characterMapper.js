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
    subtitle: [raw?.house, raw?.species].filter(Boolean).join(" · "),
    fields: [
      { label: "House",        value: raw?.house || null },
      { label: "Species",      value: raw?.species || null },
      { label: "Actor",        value: raw?.actor || null },
      { label: "Patronus",     value: raw?.patronus || null },
      { label: "Alive",        value: typeof raw?.alive === "boolean" ? (raw.alive ? "Yes" : "No") : null },
      { label: "Wizard",       value: typeof raw?.wizard === "boolean" ? (raw.wizard ? "Yes" : "No") : null },
      { label: "Born",         value: raw?.dateOfBirth || null },
      { label: "Blood status", value: raw?.ancestry || null },
    ],
    isFavorite: Boolean(isFavorite),
  };
}