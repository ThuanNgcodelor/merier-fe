import axios from "axios";
import Cookies from "js-cookie";

const createApiInstance = (baseURL) => {
    const api = axios.create({
        baseURL,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    api.interceptors.request.use(
        (config) => {
            const token = Cookies.get("accessToken");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            if (config.data instanceof FormData) {
                delete config.headers['Content-Type'];
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    const PUBLIC_401_ALLOWLIST = [
        "/user/vets/getAllVet",
        "/user/vets/search",
        "/stock/product/list",
        "/stock/product/getProductById",
        "/stock/category/getAll",
        "/file-storage/get",
    ];

    api.interceptors.response.use(
        (response) => response,
        (error) => {
            const status = error?.response?.status;
            if (status === 401) {
                const reqUrl = error?.config?.url || "";
                const isPublicEndpoint = PUBLIC_401_ALLOWLIST.some((p) => reqUrl.includes(p));
                const onAuthPage = ["/login", "/register", "/auth"].some((p) => window.location.pathname.startsWith(p));

                if (isPublicEndpoint || onAuthPage) {
                    return Promise.reject(error);
                }

                Cookies.remove("accessToken");
                const current = window.location.pathname + window.location.search;
                window.location.href = `/login?from=${encodeURIComponent(current)}`;
                return;
            }
            return Promise.reject(error);
        }
    );

    return api;
};

export default createApiInstance;