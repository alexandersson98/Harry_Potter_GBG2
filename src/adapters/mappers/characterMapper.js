/** Normalisera data från API till “våra” fält */
function mapApiToCard(c) {
  const id = c.id ?? c._id ?? c.name;

  const born = c.dateOfBirth || "—";
  const bloodStatus = c.ancestry ? c.ancestry : "—";

  return {
    id,
    name: c.name ?? "Unknown",
    house: c.house || "—",
    species: c.species || "—",
    actor: c.actor || "—",
    patronus: c.patronus || "—",
    image: c.image || "",
    alive: typeof c.alive === "boolean" ? (c.alive ? "Yes" : "No") : "—",
    ancestry: c.ancestry || "—",
    wizard: typeof c.wizard === "boolean" ? (c.wizard ? "Yes" : "No") : "—",

    // Wiki-liknande fält (hp-api saknar dessa)
    born,
    bloodStatus,
    nationality: "—",
    title: "—",
    physical: "—",
    relationships: "—",
  };
}