import db from "../../../db.json";
import { request } from "../httpClient";

const BASE = `${import.meta.env.VITE_LOCAL_API_BASE}/locations`;

export const getLocations = () =>
  import.meta.env.PROD
    ? Promise.resolve(db.locations)
    : request(BASE);

export const getLocation = (id) =>
  import.meta.env.PROD
    ? Promise.resolve(db.locations.find(l => String(l.id) === String(id)))
    : request(`${BASE}/${id}`);