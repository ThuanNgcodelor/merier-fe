import createApiInstance from "./createApiInstance.js";

const API_URL = "/v1";
const api = createApiInstance(API_URL);

// Pets API
export const getPets = (shelterId) => api.get(`/pets?shelter_id=${shelterId}`);
export const addPet = (pet) => api.post("/pets", pet);
export const updatePet = (id, updates) => api.put(`/pets/${id}`, updates);

// Adoption Listings API
export const getAdoptionListings = (shelterId) => api.get(`/adoption_listings?shelter_id=${shelterId}`);
export const createAdoptionListing = (listing) => api.post("/adoption_listings", listing);
export const updateAdoptionListing = (id, updates) => api.put(`/adoption_listings/${id}`, updates);

// Adoption Requests API
export const getAdoptionRequests = (shelterId) => api.get(`/adoption_requests?shelter_id=${shelterId}`);
export const updateAdoptionRequest = (id, updates) => api.put(`/adoption_requests/${id}`, updates);

// Shelter Profile API
export const getShelterProfile = (userId) => api.get(`/shelter/profile/${userId}`);

// Staff Management (assuming staff are users with roles, or separate table if exists)
export const getStaff = (shelterId) => api.get(`/users?role=shelter_staff&shelter_id=${shelterId}`);
export const addStaff = (staff) => api.post("/users", staff);
export const updateStaff = (id, updates) => api.put(`/users/${id}`, updates);
export const deleteStaff = (id) => api.delete(`/users/${id}`);


// ---- helpers ----
function toIsoDate(d) {
    if (!d) return undefined;
    // MM/DD/YYYY -> YYYY-MM-DD
    const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(d);
    if (m) return `${m[3]}-${m[1]}-${m[2]}`;
    return d; // nếu đã là YYYY-MM-DD thì giữ nguyên
}

function cleanPetPayload(v = {}) {
    const x = { ...v };
    if (x.birthDate) x.birthDate = toIsoDate(x.birthDate);
    if (x.weightKg !== undefined && x.weightKg !== "") x.weightKg = Number(x.weightKg);
    if (!x.gender) x.gender = "UNKNOWN";
    if (!x.status) x.status = "ACTIVE";
    Object.keys(x).forEach(k => { if (x[k] === "" || x[k] == null) delete x[k]; });
    return x;
}


// ✔ đúng với @GetMapping("/my")
export const listMyPets = async () =>
    (await api.get("/user/pet/my")).data;


export const deletePet = async (id) =>
    (await api.delete(`/user/pet/${id}`)).data;

export const getPetById = async (id) =>
    (await api.get(`/user/pet/${id}`)).data;

export const updatePetStatus = async (id, status) =>
    (await api.put(`/user/pet/${id}/status`, { status })).data;

/** ---------- PUBLIC / ADOPTION ---------- */
export const listPublicPets = async (status = "AVAILABLE") =>
    (await api.get("/user/pet/public", { params: { status } })).data;

export const createAdoptionRequest = async (petId, payload) =>
    (await api.post(`/user/pet/${petId}/adoption-request`, payload)).data;

export const reviewAdoptionRequest = async (petId, approve, note) =>
    (await api.post(`/user/pet/${petId}/adoption/review`, { approve, note })).data;


export const createOrGetShelterProfile = async () =>
    (await api.get("/user/shelter/profile")).data;

export const updateShelterProfile = async (payload) =>
    (await api.put("/user/shelter/profile", payload)).data;

/** ---------- HEALTH ---------- */
export const getHealthRecords = async (petId) =>
    (await api.get(`/user/pet/${petId}/health-records`)).data;