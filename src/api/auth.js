import Cookies from "js-cookie";
import createApiInstance from "./createApiInstance.js";

const API_URL = "/v1/auth";

const api = createApiInstance(API_URL);

export const forgotPassword = (email) =>
    api.post("/forgotPassword", { email });

export const verifyOtp = (email, otp) =>
    api.post("/verifyOtp", { email, otp });

export const updatePassword = (email, newPassword) =>
    api.post("/updatePassword", { email, newPassword });

export const login = async (data) => {
     const response = await api.post("/login", data);
     const { token } = response.data;
     Cookies.set("accessToken", token, { expires: 7 });
     return response.data;
};

export const register = async (data) => {
     const response = await api.post("/register", data);
     return response.data;
};

export const getToken = () => {
    return Cookies.get("accessToken") || null;
};

export const logout = () => {
    Cookies.remove("accessToken");
};

export const getUserRole = () => {
    const token = getToken();
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));

        if (Array.isArray(payload.roles)) {
            return payload.roles;
        }

        return payload.role || payload.authorities?.[0] || payload.iss || null;
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
};

export const isAuthenticated = () => {
    return !!getToken();
};