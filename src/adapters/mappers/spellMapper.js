// src/adapters/mappers/spellMapper.js

export function mapSpellToListCard(raw, { isFavorite = false } = {}) {
  const id = raw?.id ?? raw?._id ?? raw?.name;

  return {
    type: "spell",
    id: String(id),
    name: raw?.name ?? "Unknown",
    image: "",
    isFavorite: Boolean(isFavorite),
  };
}

export function mapSpellToDetail(raw) {
  const id = raw?.id ?? raw?._id ?? raw?.name;

  return {
    type: "spell",
    id: String(id),
    name: raw?.name ?? "Unknown",
    image: "",
    subtitle: raw?.type ?? "—",
    fields: [
      { label: "Type",        value: raw?.type || null },
      { label: "Description", value: raw?.description || null },
    ],
  };
}