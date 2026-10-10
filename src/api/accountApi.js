import axiosClient from "./axiosClient";

const accountApi = {
    getMyAccounts: () =>
        axiosClient.get("/api/me/accounts"),

    getAccount: (accountNumber) =>
        axiosClient.get(`/api/me/accounts/${accountNumber}`),

    getBalance: (accountNumber) =>
        axiosClient.get(`/api/me/accounts/${accountNumber}/balance`),

    getAccountOptions: () =>
        axiosClient.get("/api/me/accounts/options"),

    createAccount: (data) =>
        axiosClient.post("/api/me/accounts", data),

    changeAccountStatus: (accountNumber) =>
    axiosClient.patch(`/api/me/accounts/${accountNumber}/status`)
};

export default accountApi;