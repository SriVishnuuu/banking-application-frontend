import axiosClient from "./axiosClient";

const authApi = {

    register: (data) => {
        return axiosClient.post("/api/auth/register", data);
    },

    login: (data) => {
        return axiosClient.post("/api/auth/login", data);
    },

    forgotPassword: (data) => {
        return axiosClient.post("/api/auth/forgot-password", data);
    },

    resetPassword: (data) => {
        return axiosClient.post("/api/auth/reset-password", data);
    },

    logout: () => {
        return axiosClient.post("/api/auth/logout");
    }

};

export default authApi;