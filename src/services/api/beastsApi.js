import { request } from "../httpClient"

const BASE = "/api/beasts";

export const getBeasts = () =>
    request(BASE);

export const getBeast = (id) =>
    request(`${BASE}/${id}`);

