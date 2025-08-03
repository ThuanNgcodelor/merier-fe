import axios from "axios";
import Cookies from "js-cookie";

const createApiInstance = (baseURL) => {
    const api = axios.create({
        baseURL,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // Interceptor để thêm token vào header
    api.interceptors.request.use(
        (config) => {
            const token = Cookies.get("accessToken");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    api.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                Cookies.remove("accessToken");
                window.location.href = "/login";
            }
            return Promise.reject(error);
        }
    );

    return api;
};

export default createApiInstance;