import axiosClient from "./axiosClient";

const transactionApi = {

    getTransactions: (params = {}) =>
        axiosClient.get("/api/me/transactions", {
            params
        }),

    getTransaction: (transactionReference) =>
        axiosClient.get(
            `/api/me/transactions/${transactionReference}`
        ),

    transferMoney: (data) =>
        axiosClient.post(
            "/api/me/transactions/transfer",
            data
        ),

    withdrawMoney: (data) =>
        axiosClient.post(
            "/api/me/transactions/withdraw",
            data
        ),

    getTransactionLimits: (accountNumber) =>
        axiosClient.get(
            `/api/me/transactions/limits/${accountNumber}`
        ),

    selfTransferMoney: (data) =>
        axiosClient.post("/api/me/transactions/self-transfer", data)
    };

export default transactionApi;