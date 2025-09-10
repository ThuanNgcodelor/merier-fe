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
export const createAdoptionRequest = (request) => api.post("/adoption_requests", request);
export const updateAdoptionRequest = (id, updates) => api.put(`/adoption_requests/${id}`, updates);

// Shelter Profile API
export const getShelterProfile = (userId) => api.get(`/shelter_profiles/${userId}`);
export const updateShelterProfile = (userId, updates) => api.put(`/shelter_profiles/${userId}`, updates);

// Staff Management (assuming staff are users with roles, or separate table if exists)
export const getStaff = (shelterId) => api.get(`/users?role=shelter_staff&shelter_id=${shelterId}`);
export const addStaff = (staff) => api.post("/users", staff);
export const updateStaff = (id, updates) => api.put(`/users/${id}`, updates);
export const deleteStaff = (id) => api.delete(`/users/${id}`);

// Health Records API
export const getHealthRecords = (petId) => api.get(`/health_records?pet_id=${petId}`);
export const addHealthRecord = (record) => api.post("/health_records", record);

// Appointments API
export const getAppointments = (shelterId) => api.get(`/appointments?shelter_id=${shelterId}`);
export const createAppointment = (appointment) => api.post("/appointments", appointment);