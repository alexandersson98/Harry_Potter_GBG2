import { request } from "../httpClient"

const BASE = `${ import.meta.env.VITE_API_BASE }/beasts `;

export const getBeasts = () =>
    request(BASE);

export const getBeast = (id) =>
    request(`${BASE}/${id}`);

