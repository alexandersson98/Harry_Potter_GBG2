import { request } from "../httpClient";

const BASE = `${ import.meta.env.VITE_API_BASE }/characters`;

export const getCharacters = () => request(BASE);
export const getCharacter = (id) => request(`${BASE}/${id}`);