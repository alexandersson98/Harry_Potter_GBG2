import db from "../../../db.json";
import { request } from "../httpClient";

const BASE = `${import.meta.env.VITE_LOCAL_API_BASE}/beasts`;

export const getBeasts = () =>
  import.meta.env.PROD
    ? Promise.resolve(db.beasts)
    : request(BASE);

export const getBeast = (id) =>
  import.meta.env.PROD
    ? Promise.resolve(db.beasts.find(b => String(b.id) === String(id)))
    : request(`${BASE}/${id}`);