// src/adapters/mappers/characterMapper.js

const IMAGE_FALLBACKS = {
  "Albus Dumbledore": "/Harry_Potter_GBG2/images/characters/dumbledore.png",
};

function getImage(raw) {
  return raw?.image || IMAGE_FALLBACKS[raw?.name] || "";
}

export function mapCharacterToListCard(raw, { isFavorite = false } = {}) {
  const id = raw?.id ?? raw?._id ?? raw?.name;
  return {
    type: "character",
    id: String(id),
    name: raw?.name ?? "Unknown",
    image: getImage(raw),
    isFavorite: Boolean(isFavorite),
  };
}

export function mapCharacterToDetails(raw, { isFavorite = false } = {}) {
  const id = raw?.id ?? raw?._id ?? raw?.name;
  return {
    type: "character",
    id: String(id),
    name: raw?.name ?? "Unknown",
    image: getImage(raw),
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