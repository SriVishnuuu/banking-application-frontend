import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css"

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import CustomerDashboard from "./pages/customer/CustomerDashboard";
import Unauthorized from "./pages/auth/Unauthorized";
import CustomerProfile from "./pages/customer/CustomerProfile";
import Beneficiaries from "./pages/customer/Beneficiaries";
import Transactions from "./pages/customer/Transactions";
import TransferMoney from "./pages/customer/TransferMoney";
import TransactionDetails from "./pages/customer/TransactionDetails";
import WithdrawMoney from "./pages/customer/WithdrawMoney";

import CustomerLayout from "./layouts/CustomerLayout";
import Accounts from "./pages/customer/Accounts";
import AccountDetails from "./pages/customer/AccountDetails";
import ProtectedRoute from "./routes/ProtectedRoute";
import CreateAccount from "./pages/customer/CreateAccount";

import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminCustomerDetails from "./pages/admin/AdminCustomerDetails";
import AdminAccounts from "./pages/admin/AdminAccounts";
import AdminAccountDetails from "./pages/admin/AdminAccountDetails";
import AdminBranches from "./pages/admin/AdminBranches";
import AdminBranchDetails from "./pages/admin/AdminBranchDetails";
import AdminCreateBranch from "./pages/admin/AdminCreateBranch";
import AdminTransactions from "./pages/admin/AdminTransactions";
import AdminTransactionDetails from "./pages/admin/AdminTransactionDetails";
import AdminAuditLogs from "./pages/admin/AdminAuditLogs";
import AdminAuditLogDetails from "./pages/admin/AdminAuditLogDetails";
import LoadingScreen from "./components/common/LoadingScreen";

function App() {

    return (
        <Routes>

            {/* Public */}
            <Route path="/login" element={<Login />} />

            <Route path="/loading" element={<LoadingScreen />} />

            <Route path="/register" element={<Register />} />

            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route path="/reset-password" element={<ResetPassword />} />

            <Route
                path="/unauthorized"
                element={<Unauthorized />}
            />

            <Route element={<ProtectedRoute allowedRole="CUSTOMER" />}>

                <Route
                    path="/customer"
                    element={<CustomerLayout />}
                >

                    <Route path="profile" element={<CustomerProfile />} />

                    <Route
                        path="dashboard"
                        element={<CustomerDashboard />}
                    />

        
                    <Route path="accounts" element={<Accounts />} />

                    <Route
                        path="accounts/:accountNumber"
                        element={<AccountDetails />}
                    />

                    <Route
                        path="accounts/create"
                        element={<CreateAccount />}
                    />

                    <Route path="beneficiaries" element={<Beneficiaries />} />

                    <Route path="transactions" element={<Transactions />} />

                    <Route
                        path="transactions/transfer"
                        element={<TransferMoney />}
                    />
                    
                    <Route
                        path="transactions/:transactionReference"
                        element={<TransactionDetails />}
                    />

                    <Route
                        path="transactions/withdraw"
                        element={<WithdrawMoney />}
                    />

                </Route>

            </Route>

            <Route element={<ProtectedRoute allowedRole="ADMIN" />}>

                <Route path="/admin" element={<AdminLayout />}>
                    <Route path="dashboard" element={<AdminDashboard />} />

                    <Route path="customers" element={<AdminCustomers />} />

                    <Route
                        path="customers/:customerId"
                        element={<AdminCustomerDetails />}
                    />

                    <Route
                        path="accounts"
                        element={<AdminAccounts />}
                    />

                    <Route path="accounts/:accountId" element={<AdminAccountDetails />} />

                    <Route path="branches" element={<AdminBranches />} />

                    <Route
                        path="branches/create"
                        element={<AdminCreateBranch />}
                    />

                    <Route
                        path="branches/:branchId"
                        element={<AdminBranchDetails />}
                    />

                    <Route
                        path="transactions"
                        element={<AdminTransactions />}
                    />

                    <Route
                        path="transactions/:transactionReference"
                        element={<AdminTransactionDetails />}
                    />

                    <Route path="audit-logs" element={<AdminAuditLogs />} />

                    <Route
                        path="audit-logs/:auditLogId"
                        element={<AdminAuditLogDetails  />}
                    />

                </Route>

            </Route>

            {/* Unknown URL */}
            <Route
                path="*"
                element={<Navigate to="/login" replace />}
            />

        </Routes>
    );
}

export default App;