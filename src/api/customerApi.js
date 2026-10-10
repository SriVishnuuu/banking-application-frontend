import axiosClient from "./axiosClient";

const customerApi = {
    
    getProfile: () =>
        axiosClient.get("/api/customer/profile"),

    createProfile: (data) =>
        axiosClient.post("/api/customer/profile", data),

    updateProfile: (data) =>
        axiosClient.put("/api/customer/profile", data)
}

export default customerApi;