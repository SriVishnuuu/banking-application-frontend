import axiosClient from "./axiosClient";

const beneficiaryApi = {
    getMyBeneficiaries: () =>
        axiosClient.get("/api/me/beneficiaries"),

    getBeneficiary: (beneficiaryId) =>
        axiosClient.get(`/api/me/beneficiaries/${beneficiaryId}`),

    createBeneficiary: (data) =>
        axiosClient.post("/api/me/beneficiaries", data),

    removeBeneficiary: (beneficiaryId) =>
        axiosClient.patch(
            `/api/me/beneficiaries/${beneficiaryId}/remove`
        )
};

export default beneficiaryApi;