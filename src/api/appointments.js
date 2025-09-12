// src/api/appointments.js
import createApiInstance from "./createApiInstance.js";

const API_URL = "/v1/user";
const api = createApiInstance(API_URL);

// Tạo cuộc hẹn
// payload: { petId, vetId, startTime, endTime, reason }
export const createAppointment = (payload) =>
  api.post("/appointments", payload).then((r) => r.data);

