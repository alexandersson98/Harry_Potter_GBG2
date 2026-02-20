import { request } from "../httpClient";

const BASE = `${import.meta.env.VITE_LOCAL_API_BASE }/locations`

export const getLocations = () => (BASE);
export const getLocation = (id) => (`${BASE}/${id}`);