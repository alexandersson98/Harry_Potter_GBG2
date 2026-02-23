const LOCATION_IMAGES = {
  1: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Hogwarts_castle.jpg/640px-Hogwarts_castle.jpg",
  2: "https://static.wikia.nocookie.net/harrypotter/images/e/e8/B1C5M1_Diagon_Alley_North_Side.png/revision/latest/scale-to-width-down/1000?cb=20110917232032",
  3: "https://static.wikia.nocookie.net/harrypotter/images/b/bd/B1C15M2_Forbidden_Forest.png/revision/latest/scale-to-width-down/1000?cb=20241205221850",
  4: "https://static.wikia.nocookie.net/harrypotter/images/b/b6/Azkaban_concept_art.png/revision/latest/scale-to-width-down/1000?cb=20161216053518",
  5: "https://static.wikia.nocookie.net/harrypotter/images/b/bd/B3C10M3_Hogsmeade.png/revision/latest/scale-to-width-down/1000?cb=20161208133044",
  6: "https://static.wikia.nocookie.net/harrypotter/images/b/bd/Ministry_of_Magic_busy.jpg/revision/latest/scale-to-width-down/1000?cb=20101122224927",
  7: "https://static.wikia.nocookie.net/harrypotter/images/b/b8/B7C1_Malfoy_Manor_Pottermore.png/revision/latest/scale-to-width-down/1000?cb=20151218012346",
  8: "https://static.wikia.nocookie.net/harrypotter/images/0/04/Godric%25_27s_hollowdh2.webp/revision/latest?cb=20220502180120&path-prefix=sv",
  9: "https://static.wikia.nocookie.net/harrypotter/images/6/62/Chamber.png/revision/latest/scale-to-width-down/1000?cb=20180613173723",
  10: "https://static.wikia.nocookie.net/harrypotter/images/8/82/Cho-chang-kiss.gif/revision/latest?cb=20150316173653",
};

export function mapLocation(l) {
  return {
    id: l.id,
    name: l.name ?? "Unknown location",
    type: l.type ?? "—",
    description: l.description ?? "—",
    characters: l.characters ?? [],
    beasts: l.beasts ?? [],
    spells: l.spells ?? [],
    image: LOCATION_IMAGES[l.id] || "",
  };
}