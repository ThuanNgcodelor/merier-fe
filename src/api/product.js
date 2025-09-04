import createApiInstance from "./createApiInstance.js";

const API_URL = "/v1";
const api = createApiInstance(API_URL);

export const fetchProducts = (params = {}) => {
    return api.get("/stock/product/list", { params });
};

export const fetchProductById = (productId) => {
    return api.get(`/stock/product/getProductById/${productId}`);
}
export const fetchProductImageById = (imageId) => {
    return api.get(`/file-storage/get/${imageId}`, {
        responseType: "arraybuffer",
    });
}
export const fetchAddToCart = async (data) => {
    try{
        const response = await api.post(`/stock/cart/item/add`, data);
        return response.data;
    }catch(err){
        throw err;
    }
}
