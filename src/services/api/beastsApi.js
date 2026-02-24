import { request } from "../httpClient";

const DB = `${import.meta.env.VITE_LOCAL_API_BASE}/db.json`;
const BASE = `${import.meta.env.VITE_LOCAL_API_BASE}/beasts`;

export const getBeasts = () =>
  import.meta.env.PROD
    ? request(DB).then(d => d.beasts)
    : request(BASE);

export const getBeast = (id) =>
  import.meta.env.PROD
    ? request(DB).then(d => d.beasts.find(b => String(b.id) === String(id)))
    : request(`${BASE}/${id}`);