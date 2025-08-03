import createApiInstance from "./createApiInstance.js";

const API_URL = "/v1/stock";
const api = createApiInstance(API_URL);

export const fetchProducts = (params = {}) => {
    return api.get("/product/list", { params });
};

export const fetchProductImageById = (imageId) => {
    return api.get(`/file-storage/get/${imageId}`, {
        responseType: "arraybuffer",
    });
}

export const fetchAddToCart = async (data) => {
    try{
        const response = await api.post(`/cart/item/add`, data);
        return response.data;
    }catch(err){
        throw err;
    }
}
