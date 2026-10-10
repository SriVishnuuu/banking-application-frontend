import { useEffect, useState } from "react";
import {
    Activity,
    ArrowRight,
    Building2,
    CheckCircle2,
    CircleAlert,
    Clock3,
    FileText,
    HeartPulse,
    Landmark,
    RefreshCw,
    Users,
    Wallet,
    XCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import adminApi from "../../api/adminApi";
import "../../css/admin/AdminDashboard.css";
import LoadingScreen from "../../components/common/LoadingScreen";

function AdminDashboard() {
    const [statistics, setStatistics] = useState({
        customers: null,
        accounts: null,
        branches: null
    });

    const [recentActivity, setRecentActivity] = useState([]);
    const [recentTransactions, setRecentTransactions] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [retryKey, setRetryKey] = useState(0);

    useEffect(() => {
        let isMounted = true;

        const fetchDashboardData = async () => {
            setLoading(true);
            setError("");

            try {
                const [
                    customerResponse,
                    accountResponse,
                    branchResponse,
                    auditResponse,
                    transactionResponse
                ] = await Promise.all([
                    adminApi.getCustomerStatistics(),
                    adminApi.getAccountStatistics(),
                    adminApi.getBranchStatistics(),
                    adminApi.getAuditLogs(0),
                    adminApi.getTransactions(0)
                ]);

                if (!isMounted) {
                    return;
                }

                setStatistics({
                    customers: customerResponse.data,
                    accounts: accountResponse.data,
                    branches: branchResponse.data
                });

                setRecentActivity(
                    auditResponse.data?.content?.slice(0, 5) || []
                );

                setRecentTransactions(
                    transactionResponse.data?.content?.slice(0, 5) || []
                );
            } catch (err) {
                if (!isMounted) {
                    return;
                }

                setError(
                    err.response?.data?.message ||
                    "Unable to load dashboard data. Please try again."
                );
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchDashboardData();

        return () => {
            isMounted = false;
        };
    }, [retryKey]);

    const handleRetry = () => {
        setRetryKey((previous) => previous + 1);
    };

    const customerStats = statistics.customers;
    const accountStats = statistics.accounts;
    const branchStats = statistics.branches;

    const getPercentage = (value, total) => {
        if (!total || !value) {
            return 0;
        }

        return (value / total) * 100;
    };

    const formatPercentage = (value, total) => {
        return `${getPercentage(value, total).toFixed(1)}%`;
    };

    const formatAction = (action) => {
        if (!action) {
            return "—";
        }

        return action
            .toLowerCase()
            .split("_")
            .map(
                (word) =>
                    word.charAt(0).toUpperCase() + word.slice(1)
            )
            .join(" ");
    };

    const formatStatus = (status) => {
        if (!status) {
            return "—";
        }

        return (
            status.charAt(0) +
            status.slice(1).toLowerCase()
        );
    };

    const formatTransactionType = (type) => {
        if (!type) {
            return "—";
        }

        return (
            type.charAt(0) +
            type.slice(1).toLowerCase()
        );
    };

    const formatDateTime = (timestamp) => {
        if (!timestamp) {
            return "—";
        }

        return new Intl.DateTimeFormat("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Asia/Kolkata"
        }).format(new Date(timestamp));
    };

    const formatCurrency = (amount) => {
        if (amount === null || amount === undefined) {
            return "—";
        }

        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    const getAuditStatusClass = (status) => {
        if (status === "SUCCESS") {
            return "admin-dashboard-status-success";
        }

        if (status === "FAILED") {
            return "admin-dashboard-status-failed";
        }

        return "";
    };

    const getTransactionStatusClass = (status) => {
        if (status === "SUCCESS") {
            return "admin-dashboard-status-success";
        }

        if (status === "FAILED") {
            return "admin-dashboard-status-failed";
        }

        return "";
    };

    const getTransactionTypeClass = (type) => {
        if (type === "DEPOSIT") {
            return "admin-dashboard-type-deposit";
        }

        if (type === "WITHDRAW") {
            return "admin-dashboard-type-withdraw";
        }

        if (type === "TRANSFER") {
            return "admin-dashboard-type-transfer";
        }

        return "";
    };

    const getTransactionAccount = (transaction) => {
        if (transaction.transactionType === "DEPOSIT") {
            return {
                label: "Destination",
                account: transaction.destinationAccountNumber
            };
        }

        if (transaction.transactionType === "WITHDRAW") {
            return {
                label: "Source",
                account: transaction.sourceAccountNumber
            };
        }

        return {
            label: "Transfer",
            account: transaction.sourceAccountNumber
                ? `${transaction.sourceAccountNumber} → ${transaction.destinationAccountNumber || "—"}`
                : "—"
        };
    };

    const totalAccounts = accountStats?.totalAccounts ?? 0;
    const activeAccounts = accountStats?.activeAccounts ?? 0;
    const inactiveAccounts = accountStats?.inactiveAccounts ?? 0;
    const frozenAccounts = accountStats?.frozenAccounts ?? 0;
    const closedAccounts = accountStats?.closedAccounts ?? 0;

    if (loading) {
        return <LoadingScreen message="Loading admin dashboard..." />;
    }

    return (
        <section className="admin-dashboard-page">
            <div className="admin-dashboard-header">
                <div>
                    <span className="admin-dashboard-eyebrow">
                        ADMIN PORTAL
                    </span>

                    <h1>Dashboard</h1>

                    <p>
                        Overview of banking operations and recent
                        administrative activity.
                    </p>
                </div>

                <div className="admin-dashboard-header-icon">
                    <Landmark size={24} />
                </div>
            </div>

            {error && (
                <div
                    className="admin-dashboard-error"
                    role="alert"
                >
                    <div className="admin-dashboard-error-content">
                        <CircleAlert size={19} />

                        <div>
                            <strong>
                                Unable to load dashboard
                            </strong>

                            <p>{error}</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="admin-dashboard-retry-button"
                        onClick={handleRetry}
                    >
                        <RefreshCw size={16} />
                        Retry
                    </button>
                </div>
            )}

            <div className="admin-dashboard-stat-grid">
                <div className="admin-dashboard-stat-card">
                    <div className="admin-dashboard-stat-icon">
                        <Users size={21} />
                    </div>

                    <div className="admin-dashboard-stat-content">
                        <span>Total Customers</span>

                        <strong>
                            {loading
                                ? "—"
                                : customerStats?.totalCustomers ?? "—"}
                        </strong>

                        <small>
                            {loading
                                ? "Loading..."
                                : `${customerStats?.activeCustomers ?? 0} active`}
                        </small>
                    </div>
                </div>

                <div className="admin-dashboard-stat-card">
                    <div className="admin-dashboard-stat-icon">
                        <Wallet size={21} />
                    </div>

                    <div className="admin-dashboard-stat-content">
                        <span>Total Accounts</span>

                        <strong>
                            {loading
                                ? "—"
                                : accountStats?.totalAccounts ?? "—"}
                        </strong>

                        <small>
                            {loading
                                ? "Loading..."
                                : `${accountStats?.activeAccounts ?? 0} active`}
                        </small>
                    </div>
                </div>

                <div className="admin-dashboard-stat-card">
                    <div className="admin-dashboard-stat-icon">
                        <Building2 size={21} />
                    </div>

                    <div className="admin-dashboard-stat-content">
                        <span>Total Branches</span>

                        <strong>
                            {loading
                                ? "—"
                                : branchStats?.totalBranches ?? "—"}
                        </strong>

                        <small>
                            {loading
                                ? "Loading..."
                                : `${branchStats?.activeBranches ?? 0} active`}
                        </small>
                    </div>
                </div>

                <div className="admin-dashboard-health-card">
                    <div className="admin-dashboard-health-header">
                        <div className="admin-dashboard-health-title">
                            <div className="admin-dashboard-health-icon">
                                <HeartPulse size={20} />
                            </div>

                            <div>
                                <span>ACCOUNT HEALTH</span>
                                <strong>Account Health</strong>
                            </div>
                        </div>

                        <div className="admin-dashboard-health-total">
                            {loading
                                ? "—"
                                : totalAccounts}
                            <small>Total Accounts</small>
                        </div>
                    </div>

                    <div className="admin-dashboard-health-bar">
                        <div
                            className="admin-dashboard-health-segment admin-dashboard-health-active"
                            style={{
                                width: `${getPercentage(
                                    activeAccounts,
                                    totalAccounts
                                )}%`
                            }}
                        />

                        <div
                            className="admin-dashboard-health-segment admin-dashboard-health-inactive"
                            style={{
                                width: `${getPercentage(
                                    inactiveAccounts,
                                    totalAccounts
                                )}%`
                            }}
                        />

                        <div
                            className="admin-dashboard-health-segment admin-dashboard-health-frozen"
                            style={{
                                width: `${getPercentage(
                                    frozenAccounts,
                                    totalAccounts
                                )}%`
                            }}
                        />

                        <div
                            className="admin-dashboard-health-segment admin-dashboard-health-closed"
                            style={{
                                width: `${getPercentage(
                                    closedAccounts,
                                    totalAccounts
                                )}%`
                            }}
                        />
                    </div>

                    <div className="admin-dashboard-health-list">
                        <div className="admin-dashboard-health-row">
                            <div className="admin-dashboard-health-label">
                                <span className="admin-dashboard-health-dot admin-dashboard-health-dot-active" />
                                <span>Active</span>
                            </div>

                            <strong>
                                {loading ? "—" : activeAccounts}
                            </strong>

                            <span>
                                {loading
                                    ? "—"
                                    : formatPercentage(
                                        activeAccounts,
                                        totalAccounts
                                    )}
                            </span>
                        </div>

                        <div className="admin-dashboard-health-row">
                            <div className="admin-dashboard-health-label">
                                <span className="admin-dashboard-health-dot admin-dashboard-health-dot-inactive" />
                                <span>Inactive</span>
                            </div>

                            <strong>
                                {loading ? "—" : inactiveAccounts}
                            </strong>

                            <span>
                                {loading
                                    ? "—"
                                    : formatPercentage(
                                        inactiveAccounts,
                                        totalAccounts
                                    )}
                            </span>
                        </div>

                        <div className="admin-dashboard-health-row">
                            <div className="admin-dashboard-health-label">
                                <span className="admin-dashboard-health-dot admin-dashboard-health-dot-frozen" />
                                <span>Frozen</span>
                            </div>

                            <strong>
                                {loading ? "—" : frozenAccounts}
                            </strong>

                            <span>
                                {loading
                                    ? "—"
                                    : formatPercentage(
                                        frozenAccounts,
                                        totalAccounts
                                    )}
                            </span>
                        </div>

                        <div className="admin-dashboard-health-row">
                            <div className="admin-dashboard-health-label">
                                <span className="admin-dashboard-health-dot admin-dashboard-health-dot-closed" />
                                <span>Closed</span>
                            </div>

                            <strong>
                                {loading ? "—" : closedAccounts}
                            </strong>

                            <span>
                                {loading
                                    ? "—"
                                    : formatPercentage(
                                        closedAccounts,
                                        totalAccounts
                                    )}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="admin-dashboard-main-grid">
                <div className="admin-dashboard-section-card">
                    <div className="admin-dashboard-section-header">
                        <div>
                            <span className="admin-dashboard-section-eyebrow">
                                OPERATIONS
                            </span>

                            <h2>Quick Actions</h2>

                            <p>
                                Access frequently used administrative
                                operations.
                            </p>
                        </div>

                        <Activity size={20} />
                    </div>

                    <div className="admin-dashboard-actions">
                        <Link
                            to="/admin/customers"
                            className="admin-dashboard-action"
                        >
                            <div className="admin-dashboard-action-icon">
                                <Users size={19} />
                            </div>

                            <div>
                                <strong>Customers</strong>
                                <span>
                                    Manage customer records
                                </span>
                            </div>

                            <ArrowRight size={17} />
                        </Link>

                        <Link
                            to="/admin/accounts"
                            className="admin-dashboard-action"
                        >
                            <div className="admin-dashboard-action-icon">
                                <Wallet size={19} />
                            </div>

                            <div>
                                <strong>Accounts</strong>
                                <span>
                                    Review and manage accounts
                                </span>
                            </div>

                            <ArrowRight size={17} />
                        </Link>

                        <Link
                            to="/admin/branches"
                            className="admin-dashboard-action"
                        >
                            <div className="admin-dashboard-action-icon">
                                <Building2 size={19} />
                            </div>

                            <div>
                                <strong>Branches</strong>
                                <span>
                                    Manage banking branches
                                </span>
                            </div>

                            <ArrowRight size={17} />
                        </Link>

                        <Link
                            to="/admin/transactions"
                            className="admin-dashboard-action"
                        >
                            <div className="admin-dashboard-action-icon">
                                <Activity size={19} />
                            </div>

                            <div>
                                <strong>Transactions</strong>
                                <span>
                                    Review financial activity
                                </span>
                            </div>

                            <ArrowRight size={17} />
                        </Link>
                    </div>
                </div>

                <div className="admin-dashboard-section-card">
                    <div className="admin-dashboard-section-header">
                        <div>
                            <span className="admin-dashboard-section-eyebrow">
                                SECURITY
                            </span>

                            <h2>Recent Activity</h2>

                            <p>
                                Latest administrative and security events.
                            </p>
                        </div>

                        <Link
                            to="/admin/audit-logs"
                            className="admin-dashboard-section-link"
                        >
                            View All
                            <ArrowRight size={14} />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="admin-dashboard-list-loading">
                            <RefreshCw
                                size={20}
                                className="admin-dashboard-spin"
                            />
                            <span>Loading activity...</span>
                        </div>
                    ) : recentActivity.length === 0 ? (
                        <div className="admin-dashboard-empty-state">
                            <div className="admin-dashboard-empty-icon">
                                <FileText size={22} />
                            </div>

                            <h3>No recent activity</h3>

                            <p>
                                Recent administrative and security
                                events will appear here.
                            </p>

                            <Link
                                to="/admin/audit-logs"
                                className="admin-dashboard-empty-link"
                            >
                                View Audit Logs
                                <ArrowRight size={15} />
                            </Link>
                        </div>
                    ) : (
                        <div className="admin-dashboard-activity-list">
                            {recentActivity.map((activity) => (
                                <Link
                                    key={activity.id}
                                    to={`/admin/audit-logs/${activity.id}`}
                                    className="admin-dashboard-activity-item"
                                >
                                    <div
                                        className={`admin-dashboard-activity-icon ${getAuditStatusClass(
                                            activity.status
                                        )}`}
                                    >
                                        {activity.status === "SUCCESS" ? (
                                            <CheckCircle2 size={17} />
                                        ) : (
                                            <XCircle size={17} />
                                        )}
                                    </div>

                                    <div className="admin-dashboard-activity-content">
                                        <strong>
                                            {formatAction(
                                                activity.action
                                            )}
                                        </strong>

                                        <span>
                                            {activity.description ||
                                                `${formatStatus(
                                                    activity.status
                                                )} audit event`}
                                        </span>

                                        <small>
                                            {activity.userEmail ||
                                                "System"}{" "}
                                            ·{" "}
                                            {formatDateTime(
                                                activity.timestamp
                                            )}
                                        </small>
                                    </div>

                                    <ArrowRight
                                        size={15}
                                        className="admin-dashboard-list-arrow"
                                    />
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="admin-dashboard-section-card admin-dashboard-transactions-card">
                <div className="admin-dashboard-section-header">
                    <div>
                        <span className="admin-dashboard-section-eyebrow">
                            FINANCIAL OPERATIONS
                        </span>

                        <h2>Recent Transactions</h2>

                        <p>
                            Latest financial transactions recorded in
                            the banking system.
                        </p>
                    </div>

                    <Link
                        to="/admin/transactions"
                        className="admin-dashboard-section-link"
                    >
                        View All
                        <ArrowRight size={14} />
                    </Link>
                </div>

                {loading ? (
                    <div className="admin-dashboard-list-loading">
                        <RefreshCw
                            size={20}
                            className="admin-dashboard-spin"
                        />
                        <span>Loading transactions...</span>
                    </div>
                ) : recentTransactions.length === 0 ? (
                    <div className="admin-dashboard-empty-state admin-dashboard-transaction-empty">
                        <div className="admin-dashboard-empty-icon">
                            <Wallet size={22} />
                        </div>

                        <h3>No recent transactions</h3>

                        <p>
                            Financial transactions will appear here
                            once activity is recorded.
                        </p>

                        <Link
                            to="/admin/transactions"
                            className="admin-dashboard-empty-link"
                        >
                            View Transactions
                            <ArrowRight size={15} />
                        </Link>
                    </div>
                ) : (
                    <div className="admin-dashboard-transaction-table-wrapper">
                        <table className="admin-dashboard-transaction-table">
                            <thead>
                                <tr>
                                    <th>Reference</th>
                                    <th>Type</th>
                                    <th>Account</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Time</th>
                                    <th />
                                </tr>
                            </thead>

                            <tbody>
                                {recentTransactions.map(
                                    (transaction) => {
                                        const accountInfo =
                                            getTransactionAccount(
                                                transaction
                                            );

                                        return (
                                            <tr
                                                key={
                                                    transaction.transactionReference
                                                }
                                            >
                                                <td>
                                                    <Link
                                                        to={`/admin/transactions/${encodeURIComponent(
                                                            transaction.transactionReference
                                                        )}`}
                                                        className="admin-dashboard-transaction-reference"
                                                    >
                                                        {
                                                            transaction.transactionReference
                                                        }
                                                    </Link>
                                                </td>

                                                <td>
                                                    <span
                                                        className={`admin-dashboard-transaction-type ${getTransactionTypeClass(
                                                            transaction.transactionType
                                                        )}`}
                                                    >
                                                        {formatTransactionType(
                                                            transaction.transactionType
                                                        )}
                                                    </span>
                                                </td>

                                                <td>
                                                    <div className="admin-dashboard-transaction-account">
                                                        <span>
                                                            {
                                                                accountInfo.label
                                                            }
                                                        </span>

                                                        <strong>
                                                            {
                                                                accountInfo.account ||
                                                                "—"
                                                            }
                                                        </strong>
                                                    </div>
                                                </td>

                                                <td>
                                                    <strong className="admin-dashboard-transaction-amount">
                                                        {formatCurrency(
                                                            transaction.amount
                                                        )}
                                                    </strong>
                                                </td>

                                                <td>
                                                    <span
                                                        className={`admin-dashboard-status ${getTransactionStatusClass(
                                                            transaction.status
                                                        )}`}
                                                    >
                                                        {transaction.status ===
                                                        "SUCCESS" ? (
                                                            <CheckCircle2
                                                                size={14}
                                                            />
                                                        ) : (
                                                            <XCircle
                                                                size={14}
                                                            />
                                                        )}

                                                        {formatStatus(
                                                            transaction.status
                                                        )}
                                                    </span>
                                                </td>

                                                <td>
                                                    <div className="admin-dashboard-transaction-time">
                                                        <Clock3 size={14} />
                                                        <span>
                                                            {formatDateTime(
                                                                transaction.createdAt
                                                            )}
                                                        </span>
                                                    </div>
                                                </td>

                                                <td>
                                                    <Link
                                                        to={`/admin/transactions/${encodeURIComponent(
                                                            transaction.transactionReference
                                                        )}`}
                                                        className="admin-dashboard-transaction-view"
                                                        aria-label={`View transaction ${transaction.transactionReference}`}
                                                    >
                                                        <ArrowRight
                                                            size={16}
                                                        />
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    }
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </section>
    );
}

export default AdminDashboard;