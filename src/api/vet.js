
import createApiInstance from "./createApiInstance.js";

const API_URL = "/api";
const api = createApiInstance(API_URL);


export const fetchAllVets = () =>
  api.get("/vets/getAllVet").then((r) => r.data);

// Search vet theo province, specialization, q
export const searchVets = (params = {}) =>
  api.get("/vets/search", { params }).then((r) => r.data);

export const getVetById = (vetUserId) =>
  api.get(`/vets/${vetUserId}`).then((r) => r.data);





