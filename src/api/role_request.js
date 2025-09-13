import createApiInstance from "./createApiInstance.js";

const API_URL = "/v1/user/role-requests";

const api = createApiInstance(API_URL);


//code admin
export const getUserRequests = async () => {
    try {
        const response = await api.get("/pending");
        return response.data;
    } catch {
        throw new Error("Failed to fetch cart data");
    }
}

export async function approveRequest(id) {
    const { data } = await api.post(`/${id}/approve`);
    return data;
}

export async function rejectRequest(id) {
    const { data } = await api.post(`/${id}/reject`);
    return data;
}
