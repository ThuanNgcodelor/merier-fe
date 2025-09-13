import createApiInstance from "./createApiInstance.js";

const API_URL = "/v1";
const api = createApiInstance(API_URL);

export const fetchProducts = () => {
    return api.get("/stock/product/list");
};

export const fetchProductPage = (params = {}) => {
    return api.get("/stock/product/listPage", { params });
};

export const removeCartItem = async (productId) => {
    try {
      await api.delete(`/stock/cart/item/remove/${productId}`);
      return true;
    } catch (error) {
      console.error("Failed to remove cart item:", error);
      return false;
    }
  }

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
