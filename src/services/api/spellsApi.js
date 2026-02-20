import { request } from "../httpClient";

const BASE = `${ import.meta.env.VITE_API_BASE }/spells `;

export const getSpells = () => request(BASE);
export const getSpell = (id) => request(`${BASE}/${id}`);