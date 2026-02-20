import { request } from "../httpClient";

const BASE = `${import.meta.env.VITE_LOCAL_API_BASE }/locations`

export const getLocations = () => request(BASE);
export const getLocation = (id) => request(`${BASE}/${id}`);