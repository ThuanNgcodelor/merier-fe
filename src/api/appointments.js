import createApiInstance from "./createApiInstance.js";

const API_URL = "/v1/user";
const api = createApiInstance(API_URL);

// Tạo cuộc hẹn
// payload: { petId, vetId, startTime, endTime, reason }
export const createAppointment = (payload) =>
  api.post("/appointments", payload).then((r) => r.data);

// Lấy lịch hẹn của chủ nuôi hiện tại
export const getMyAppointments = () =>
  api.get("/appointments/my").then((r) => r.data);

// Lấy lịch hẹn của bác sĩ hiện tại
export const getVetAppointments = () =>
  api.get("/appointments/vet").then((r) => r.data);

// Cập nhật trạng thái lịch hẹn
// status: PENDING | CONFIRMED | RESCHEDULED | CANCELLED | DONE
export const updateAppointmentStatus = (id, status) =>
  api.put(`/appointments/${id}/status`, { status }).then((r) => r.data);

// Kê đơn/ghi chẩn đoán tạo health record
// payload: { petId, visitTime, diagnosis, treatment, notes }
export const createHealthRecord = (payload) =>
  api.post(`/health-records`, payload).then((r) => r.data);

// Lấy health records theo petId (vet-friendly)
export const getPetHealthRecords = (petId) =>
  api.get(`/health-records/pet/${petId}`).then((r) => r.data);

// Upload tài liệu y tế theo recordId (field name: image)
export const uploadMedicalDocument = (recordId, file, docType) => {
  const form = new FormData();
  form.append("file", file);
  if (docType) form.append("docType", docType);
  return api.post(`/health-records/${recordId}/documents`, form, {
    transformRequest: [(payload, headers) => {
      delete headers.common?.["Content-Type"];
      delete headers.post?.["Content-Type"];
      delete headers["Content-Type"];
      return payload;
    }],
  }).then((r) => r.data);
};

