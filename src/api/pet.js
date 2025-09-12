import createApiInstance from "./createApiInstance.js";
const api = createApiInstance("/v1");

export const getPublicPet = async (id) =>
  (await api.get(`/user/pet/public/${id}`)).data;

function toIsoDate(d) {
  if (!d) return undefined;
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(d);
  if (m) return `${m[3]}-${m[1]}-${m[2]}`;
  return d;
}
function cleanPetPayload(v = {}) {
  const x = { ...v };
  if (x.birthDate) x.birthDate = toIsoDate(x.birthDate);
  if (x.weightKg === "") delete x.weightKg;
  if (x.weightKg !== undefined) x.weightKg = Number(x.weightKg);
  if (!x.gender) x.gender = "UNKNOWN";
  if (!x.status) x.status = "ACTIVE";
  Object.keys(x).forEach((k) => {
    if (x[k] === "" || x[k] == null) delete x[k];
  });
  return x;
}

const unsetCT = (data, headers) => {
  delete headers["Content-Type"];
  delete headers.common?.["Content-Type"];
  delete headers.post?.["Content-Type"];
  delete headers.put?.["Content-Type"];
  return data;
};

function makePetFormData(payload, file) {
  const fd = new FormData();
  fd.append(
    "request",
    new Blob([JSON.stringify(payload)], { type: "application/json" }),
    "request.json"
  );
  if (file) fd.append("file", file);
  return fd;
}

export const listMyPets = async () => (await api.get("/user/pet/my")).data;

export const addPet = async (pet, file) => {
  const payload = cleanPetPayload(pet);
  const fd = makePetFormData(payload, file || null);
  return (await api.post("/user/pet", fd, { transformRequest: [unsetCT] })).data;
};

export const updatePet = async (id, updates, file) => {
  const payload = cleanPetPayload(updates);
  const fd = makePetFormData(payload, file || null);
  return (await api.put(`/user/pet/${id}`, fd, { transformRequest: [unsetCT] })).data;
};

export const deletePet = async (id, soft = true) =>
  (await api.delete(`/user/pet/${id}`, { params: { soft } })).data;

export const updatePetStatus = async (id, status) =>
  (await api.put(`/user/pet/${id}/status`, { status })).data;

export const updateAdoptionStatus = async (id, status) =>
  (await api.put(`/user/pet/${id}/adoption-status`, { status })).data;

export const listPublicPets = async (status = "AVAILABLE") =>
  (await api.get("/user/pet/public", { params: { status } })).data;

export const requestAdoption = async (petId, payload) =>
  (await api.post(`/user/pet/${petId}/adoption-request`, payload)).data;

export const reviewAdoptionRequest = async (petId, approve, note) =>
  (await api.post(`/user/pet/${petId}/adoption/review`, { approve, note })).data;
