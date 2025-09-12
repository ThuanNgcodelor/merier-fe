
import createApiInstance from "./createApiInstance.js";

const API_URL = "/v1";
const api = createApiInstance(API_URL);


export const fetchAllVets = () =>
  api.get("/user/vets/getAllVet").then((r) => r.data);

export const searchVets = (params = {}) =>
  api.get("/user/vets/search", { params }).then((r) => r.data);

export const getVetById = (vetUserId) =>
  api.get(`/user/vets/${vetUserId}`).then((r) => r.data);

// Current authenticated vet profile (requires token)
export const getMyVetProfile = () =>
  api.get("/user/vets/me").then((r) => r.data);

export const updateMyVetProfile = (payload) =>
  api.put("/user/vets/me", payload).then((r) => r.data);




