// src/api/vet.js
import createApiInstance from "./createApiInstance.js";

// proxy in vite will forward '/api' to backend /api/v1
const API_URL = "/api"; // points to /api/v1 on backend via proxy
const api = createApiInstance(API_URL);

// Articles
export const getArticles = () => api.get("/articles").then(r => r.data);
export const getArticle = (id) => api.get(`/articles/${id}`).then(r => r.data);
export const createArticle = (payload) => api.post("/articles", payload).then(r => r.data);

// Health records
export const getRecord = (id) => api.get(`/records/${id}`).then(r => r.data);
export const getPetRecords = (petId) => api.get(`/pets/${petId}/records`).then(r => r.data);
export const createHealthRecord = (petId, payload) => api.post(`/pets/${petId}/records`, payload).then(r => r.data);

// Appointments
export const getAppointments = () => api.get("/appointments").then(r => r.data);
export const updateAppointmentStatus = (id, status) => api.patch(`/appointments/${id}/status`, { status }).then(r => r.data);

// Vet profile
export const getMyProfile = () => api.get("/vets/me").then(r => r.data);
export const updateProfile = (payload) => api.put("/vets/me", payload).then(r => r.data);