import createApiInstance from "./createApiInstance.js";

const API_URL = "/v1/user";

const api = createApiInstance(API_URL);

export const getCart = async () => {
    try {
        const response = await api.get("/cart");
        return response.data;
    } catch {
        throw new Error("Failed to fetch cart data");
    }
}

export const getUser = async () => {
    try {
        const response = await api.get("/information");
        console.log("User data:", response.data);   
        return response.data;
    } catch {
        throw new Error("Failed to fetch user data");
    }
}

export const checkEmailExists = async (email) => {
    const res = await api.get(`/getUserByEmail/${encodeURIComponent(email)}`, {
      validateStatus: (s) => s === 200 || s === 404,
    });
    return res.status === 200; 
};

// Update user information
export const updateUser = async (data, file) => {
  const fd = new FormData();

  fd.append(
    "request",
    new Blob([JSON.stringify(data)], { type: "application/json" }),
    "request.json" 
  );

  if (file) fd.append("file", file); 

  const response = await api.put("/update", fd, {
    transformRequest: [(payload, headers) => {
      delete headers.common?.["Content-Type"];
      delete headers.post?.["Content-Type"];
      delete headers.put?.["Content-Type"];
      delete headers["Content-Type"];
      return payload;
    }],
  });
  return response.data;
};

// Address APIs

export const updateAddress = async (data) => {
    try {
        const respone = await api.put("/address/update",data);
        return respone.data;
    } catch {
        throw new Error("Failed to update address");
    }
}

export const createAddress = async (data) => {
    try {
        const response = await api.post("/address/save", data);
        return response.data;
    } catch {
        throw new Error("Failed to create data");
    }
}

export const getAllAddress = async () => {
    try {
        const response = await api.get("/address/getAllAddresses");
        return response.data;
    } catch { 
        throw new Error("Failed to fetch address")
    }
}

export const deleteAddress = async (id) => {
    try {
        const response = await api.delete(`/address/deleteAddressById/${id}`);
        return response.data;
    } catch (error) {
        console.error("Failed delete address:", error);
        return false;
    }
} 

export const getAddressId = async (id) => {
    try {
        const respone = await api.get(`/address/getAddressById/${id}`);
        return respone.data;
    } catch {
        throw new Error("Failed to fetch addressId");
    }
}

export const setDefaultAddress = async (id) => {
    try {
        const response = await api.put(`/address/setDefaultAddress/${id}`);
        return response.data;
    } catch {
        throw new Error("Failed to set default address");
    }
}
// Address APIs

