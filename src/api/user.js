import createApiInstance from "./createApiInstance.js";

const API_URL = "/v1/user";

const api = createApiInstance(API_URL);


//code admin
export const getAllUser = async () => {
    try {
        const response = await api.get("/getAll");
        return response.data;
    } catch {
        throw new Error("Failed to fetch cart data");
    }
}

export const getOrdersByUser = async () => {
    try {
        const response = await api.get("/order/getOrderByUserId");
        return response.data;
    } catch {
        throw new Error("Failed to fetch orders");
    }
};

export async function deleteUserById(id) {
    // CHỌN 1 trong 2 URL tùy BE:
    // const { data } = await axios.delete(`/v1/user/${id}`);
    const { data } = await api.delete(`/deleteUserById/${id}`);
    return data;
}


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
// Update user information
export const updateUser = async (data, file) => {
    data = {
        "id": data.id,
        "email": data.email,
        "username": data.username,
        "password": data.password,
        "userDetails": {
            "firstName": data.firstName,
            "lastName": data.lastName,
            "phoneNumber": data.phoneNumber,
            "gender": data.gender,
            "aboutMe": data.aboutMe,
            "birthDate": data.birthDate
        }
    }
    const fd = new FormData();
    console.log("kkk: ", data, "file: ", file);
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

// Role Request APIs
export const createRoleRequest = async (data) => {
    try {
        const response = await api.post("/role-requests", data);
        return response.data;
    } catch (error) {
        console.error("Error creating role request:", error);
        throw new Error("Failed to create role request");
    }
}

export const getUserRoleRequests = async () => {
    try {
        const response = await api.get("/role-requests/user");
        return response.data;
    } catch (error) {
        console.error("Error fetching user role requests:", error);
        throw new Error("Failed to fetch user role requests");
    }
}

// Pet APIs
export const getMyPets = async () => {
    try {
        const response = await api.get("/pet/my");
        return response.data;
    } catch (error) {
        console.error("Error fetching pets:", error);
        throw new Error("Failed to fetch pets");
    }
}

export const getPetById = async (petId) => {
    try {
        const response = await api.get(`/pet/${petId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching pet:", error);
        throw new Error("Failed to fetch pet");
    }
}

// Admin-level fetch by petId (for vet use-cases)
export const getPetByIdAdmin = async (petId) => {
    try {
        const response = await api.get(`/pet/admin/${petId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching pet (admin):", error);
        throw new Error("Failed to fetch pet (admin)");
    }
}

const normalizePetData = (d) => {
  const toDate = (v) => (v ? new Date(v).toISOString().slice(0, 10) : null);
  const toNum  = (v) => (v === "" || v === null || v === undefined ? null : Number(v));

  const up = (v) => (v ? String(v).toUpperCase() : null);

  return {
    name: d.name?.trim() || null,
    species: d.species?.trim() || null,
    breed: d.breed?.trim() || null,
    birthDate: toDate(d.birthDate),
    gender: up(d.gender),               
    color: d.color?.trim() || null,
    weightKg: toNum(d.weightKg),       
    microchipNumber: d.microchipNumber?.trim() || null,
    vaccinated: typeof d.vaccinated === "boolean" ? d.vaccinated : null,
    sterilized: typeof d.sterilized === "boolean" ? d.sterilized : null,
    lastVetVisit: toDate(d.lastVetVisit),
    notes: d.notes?.trim() || null,
    status: up(d.status) || null,       
  };
};

export const createPet = async (data, file) => {
  try {
    const payload = normalizePetData(data);

    if (!file) {
      const response = await api.post("/pet", payload, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    }

    const fd = new FormData();
    fd.append("request", new Blob([JSON.stringify(payload)], { type: "application/json" }), "request.json");
    fd.append("file", file);

    const response = await api.post("/pet", fd, {
      transformRequest: [(payload, headers) => {
        delete headers.common?.["Content-Type"];
        delete headers.post?.["Content-Type"];
        delete headers["Content-Type"];
        return payload;
      }],
    });
    return response.data;
  } catch (error) {
    console.error("Error creating pet:", error?.response || error);
    throw new Error(error?.response?.data?.message || "Failed to create pet");
  }
};

export const updatePet = async (petId, data, file) => {
  try {
    const payload = normalizePetData(data);

    const fd = new FormData();
    fd.append("request", new Blob([JSON.stringify(payload)], { type: "application/json" }), "request.json");
    if (file) fd.append("file", file);

    const response = await api.put(`/pet/${petId}`, fd, {
      transformRequest: [(payload, headers) => {
        delete headers.common?.["Content-Type"];
        delete headers.patch?.["Content-Type"];
        delete headers["Content-Type"];
        return payload;
      }],
    });
    return response.data;
  } catch (error) {
    console.error("Error updating pet:", error?.response || error);
    throw new Error(error?.response?.data?.message || "Failed to update pet");
  }
};

export const updatePetStatus = async (petId, status) => {
    try {
        const response = await api.put(`/pet/${petId}/status`, { status });
        return response.data;
    } catch (error) {
        console.error("Error updating pet status:", error);
        throw new Error("Failed to update pet status");
    }
}

export const deletePet = async (petId, soft = true) => {
    try {
        const response = await api.delete(`/pet/${petId}?soft=${soft}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting pet:", error);
        throw new Error("Failed to delete pet");
    }
}

export const getPetHealthRecords = async (petId) => {
    try {
        const response = await api.get(`/pet/${petId}/health-records`);
        return response.data;
    } catch (error) {
        console.error("Error fetching health records:", error);
        throw new Error("Failed to fetch health records");
    }
}

// Address APIs
