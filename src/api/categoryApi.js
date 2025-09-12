import api from "./api";

const BASE = "/v1/stock/category";

const categoryApi = {
  getAll: () => api.get(`${BASE}/getAll`).then(r => r.data),
  getById: (id) => api.get(`${BASE}/getCategoryById/${id}`).then(r => r.data),
  create: (data) => api.post(`${BASE}/create`, data).then(r => r.data),   
  update: (data) => api.put(`${BASE}/update`, data).then(r => r.data),   
  remove: (id) => api.delete(`${BASE}/deleteCategoryById/${id}`),       
};

export default categoryApi;
