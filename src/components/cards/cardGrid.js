import { cardTile } from "./cardTile";

export function cardGrid ({ items }){
    return items.map(cardTile).join("");
}