export function mapApiToDetail(raw) {
  return {
    id: String(raw.id),
    name: raw.name ?? "Unknown",
    image: raw.image ?? "",
    subtitle: [raw.category, raw.type].filter(Boolean).join(" · "),
    fields: [
      { label: "Category",     value: raw.category },
      { label: "Type",         value: raw.type },
      { label: "Habitat",      value: raw.habitat },
      { label: "Alignment",    value: raw.alignment },
      { label: "Danger level", value: raw.dangerLevel ? String(raw.dangerLevel) : null },
      { label: "Strengths",    value: raw.strengths?.join(", ") },
    ],
  };
}