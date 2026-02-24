import { request } from "../httpClient";

const DB = `${import.meta.env.VITE_LOCAL_API_BASE}/db.json`;
const BASE = `${import.meta.env.VITE_LOCAL_API_BASE}/locations`;

export const getLocations = () =>
  import.meta.env.PROD
    ? request(DB).then(d => d.locations)
    : request(BASE);

export const getLocation = (id) =>
  import.meta.env.PROD
    ? request(DB).then(d => d.locations.find(l => String(l.id) === String(id)))
    : request(`${BASE}/${id}`);