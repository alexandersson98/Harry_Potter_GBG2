export function mapApiToListCard(raw, { isFavorite = false } = {}) {
  const id = raw.id ?? raw._id ?? raw.name;

  return {
    id: String(id),
    name: raw.name ?? "unknown",
    image: raw.image ?? "",
    isFavorite: Boolean(isFavorite),
  };
}