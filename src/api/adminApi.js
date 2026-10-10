import axiosClient from "./axiosClient";

const adminApi = {
    // =========================
    // Customers
    // =========================

    getCustomers: (page = 0, search = "") =>
        axiosClient.get("/api/admin/customers", {
            params: {
                page,
                search: search.trim() || undefined
            }
        }),

    getCustomer: (customerId) =>
        axiosClient.get(`/api/admin/customers/${customerId}`),

    changeCustomerStatus: (customerId, status) =>
        axiosClient.patch(
            `/api/admin/customers/${customerId}/status`,
            { status }
        ),

    // =========================
    // Accounts
    // =========================

    getAccounts: (page = 0, search = "") =>
        axiosClient.get("/api/admin/accounts", {
            params: {
                page,
                search: search.trim() || undefined
            }
        }),

    getAccount: (accountId) =>
        axiosClient.get(`/api/admin/accounts/${accountId}`),

    changeAccountStatus: (accountId, status) =>
        axiosClient.patch(
            `/api/admin/accounts/${accountId}/status`,
            { status }
        ),

    depositToAccount: (accountId, data) =>
        axiosClient.post(
            `/api/admin/accounts/${accountId}/deposit`,
            data
        ),

    // =========================
    // Branches
    // =========================

    getBranches: (page = 0, search = "") =>
        axiosClient.get("/api/admin/branches", {
            params: {
                page,
                search: search.trim() || undefined
            }
        }),

    getBranch: (branchId) =>
        axiosClient.get(`/api/admin/branches/${branchId}`),

    createBranch: (data) =>
        axiosClient.post("/api/admin/branches", data),

    changeBranchStatus: (branchId, status) =>
        axiosClient.patch(
            `/api/admin/branches/${branchId}/status`,
            { status }
        ),

    // =========================
    // Transactions
    // =========================

    getTransactions: (
        page = 0,
        {
            accountNumber = "",
            from = "",
            to = "",
            transactionType = "",
            status = ""
        } = {}
    ) =>
        axiosClient.get("/api/admin/transactions", {
            params: {
                page,
                accountNumber: accountNumber.trim() || undefined,
                from: from || undefined,
                to: to || undefined,
                transactionType: transactionType || undefined,
                status: status || undefined
            }
        }),

    getTransaction: (transactionReference) =>
        axiosClient.get(
            `/api/admin/transactions/${encodeURIComponent(
                transactionReference
            )}`
        ),

    // Audit Logs
    getAuditLogs: (
        page = 0,
        {
            action = "",
            resourceType = "",
            status = "",
            from = "",
            to = ""
        } = {}
    ) =>
        axiosClient.get("/api/admin/audit-logs", {
            params: {
                page,
                action: action || undefined,
                resourceType: resourceType || undefined,
                status: status || undefined,
                from: from || undefined,
                to: to || undefined
            }
        }),

    getAuditLog: (auditLogId) =>
        axiosClient.get(
            `/api/admin/audit-logs/${encodeURIComponent(auditLogId)}`
        ),

    // Dashboard Statistics
    getCustomerStatistics: () =>
        axiosClient.get("/api/admin/customers/statistics"),

    getAccountStatistics: () =>
        axiosClient.get("/api/admin/accounts/statistics"),

    getBranchStatistics: () =>
        axiosClient.get("/api/admin/branches/statistics")
};

export default adminApi;