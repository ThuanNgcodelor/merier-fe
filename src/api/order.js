import createApiInstance from "./createApiInstance.js";

const API_URL = "/v1/order";

const api = createApiInstance(API_URL);

// Get user addresses
export const getUserAddresses = async () => {
    try {
        const response = await api.get("/addresses");
        return response.data;
    } catch (error) {
        console.error("Error fetching addresses:", error);
        throw new Error("Failed to fetch addresses");
    }
};

// Get address by ID
export const getAddressById = async (addressId) => {
    try {
        const response = await api.get(`/addresses/${addressId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching address:", error);
        throw new Error("Failed to fetch address");
    }
};

export const getOrdersByUser = async () => {
    try {
        const response = await api.get("/getOrderByUserId");
        return response.data;
    } catch {
        throw new Error("Failed to fetch orders");
    }
};


// Create order from cart
export const createOrder = async (orderData) => {
    try {
        const response = await api.post("/create-from-cart", orderData);
        return response.data;
    } catch (error) {
        console.error("Error creating order:", error);
        throw new Error("Failed to create order");
    }
};

// Get user orders
export const getUserOrders = async () => {
    try {
        const response = await api.get("/user-orders");
        return response.data;
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw new Error("Failed to fetch orders");
    }
};

// Get order by ID
export const getOrderById = async (orderId) => {
    try {
        const response = await api.get(`/${orderId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching order:", error);
        throw new Error("Failed to fetch order");
    }
};
