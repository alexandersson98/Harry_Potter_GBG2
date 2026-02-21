export function mapLocation(l) {
  return {
    id: l.id,
    name: l.name ?? "Unknown location",
    type: l.type ?? "—",
    description: l.description ?? "—",
    characters: l.characters ?? [],
    beasts: l.beasts ?? [],
    spells: l.spells ?? []
  };
}