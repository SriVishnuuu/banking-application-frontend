import { useEffect, useState } from "react";
import {
    Eye,
    FileSearch,
    Filter,
    RefreshCw,
    Search,
    X
} from "lucide-react";
import { Link } from "react-router-dom";
import adminApi from "../../api/adminApi";
import "../../css/admin/AdminAuditLogs.css";
import LoadingScreen from "../../components/common/LoadingScreen";

const ACTION_OPTIONS = [
    { value: "LOGIN", label: "Login" },
    { value: "LOGOUT", label: "Logout" },
    { value: "LOGIN_FAILED", label: "Login Failed" },
    { value: "PASSWORD_RESET", label: "Password Reset" },
    { value: "CREATE_ACCOUNT", label: "Create Account" },
    { value: "CHANGE_ACCOUNT_STATUS", label: "Change Account Status" },
    { value: "CHANGE_BENEFICIARY_STATUS", label: "Change Beneficiary Status" },
    { value: "CREATE_BRANCH", label: "Create Branch" },
    { value: "CHANGE_BRANCH_STATUS", label: "Change Branch Status" },
    { value: "CHANGE_CUSTOMER_STATUS", label: "Change Customer Status" }
];

const RESOURCE_TYPE_OPTIONS = [
    { value: "USER", label: "User" },
    { value: "CUSTOMER", label: "Customer" },
    { value: "ACCOUNT", label: "Account" },
    { value: "BENEFICIARY", label: "Beneficiary" },
    { value: "BRANCH", label: "Branch" },
    { value: "AUTH", label: "Authentication" }
];

const STATUS_OPTIONS = [
    { value: "SUCCESS", label: "Success" },
    { value: "FAILED", label: "Failed" }
];

function AdminAuditLogs() {
    const [auditLogs, setAuditLogs] = useState([]);
    const [page, setPage] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [filters, setFilters] = useState({
        action: "",
        resourceType: "",
        status: "",
        from: "",
        to: ""
    });

    const [appliedFilters, setAppliedFilters] = useState({
        action: "",
        resourceType: "",
        status: "",
        from: "",
        to: ""
    });

    const [loading, setLoading] = useState(true);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState("");
    const [retryKey, setRetryKey] = useState(0);

    useEffect(() => {
        let isMounted = true;

        const fetchAuditLogs = async () => {
            setLoading(true);
            setError("");

            try {
                const response = await adminApi.getAuditLogs(
                    page,
                    appliedFilters
                );

                if (!isMounted) {
                    return;
                }

                setAuditLogs(response.data.content || []);
                setTotalElements(response.data.totalElements || 0);
                setTotalPages(response.data.totalPages || 0);
            } catch (err) {
                if (!isMounted) {
                    return;
                }

                setAuditLogs([]);
                setTotalElements(0);
                setTotalPages(0);

                setError(
                    err.response?.data?.message ||
                    "Unable to load audit logs. Please try again."
                );
            } finally {
                if (isMounted) {
                    setLoading(false);
                     setInitialLoading(false);
                }
            }
        };

        fetchAuditLogs();

        return () => {
            isMounted = false;
        };
    }, [page, appliedFilters, retryKey]);

    const handleFilterChange = (event) => {
        const { name, value } = event.target;

        setFilters((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleApplyFilters = () => {
        setPage(0);
        setAppliedFilters({
            action: filters.action,
            resourceType: filters.resourceType,
            status: filters.status,
            from: filters.from,
            to: filters.to
        });
    };

    const handleClearFilters = () => {
        const emptyFilters = {
            action: "",
            resourceType: "",
            status: "",
            from: "",
            to: ""
        };

        setFilters(emptyFilters);
        setAppliedFilters(emptyFilters);
        setPage(0);
    };

    const handleRetry = () => {
        setRetryKey((previous) => previous + 1);
    };

    const formatDateTime = (timestamp) => {
        if (!timestamp) {
            return "—";
        }

        return new Intl.DateTimeFormat("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
            timeZone: "Asia/Kolkata"
        }).format(new Date(timestamp));
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

    const formatResourceType = (resourceType) => {
        if (!resourceType) {
            return "—";
        }

        if (resourceType === "AUTH") {
            return "Authentication";
        }

        return (
            resourceType.charAt(0) +
            resourceType.slice(1).toLowerCase()
        );
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

    const getStatusClass = (status) => {
        if (status === "SUCCESS") {
            return "admin-audit-status-success";
        }

        if (status === "FAILED") {
            return "admin-audit-status-failed";
        }

        return "";
    };

    const hasAppliedFilters =
        appliedFilters.action ||
        appliedFilters.resourceType ||
        appliedFilters.status ||
        appliedFilters.from ||
        appliedFilters.to;

    if (initialLoading && loading) {
        return <LoadingScreen message="Loading audit logs..." />;
    }    

    return (
        <section className="admin-audit-logs-page">

            <div className="admin-audit-logs-header">
                <div>
                    <span className="admin-audit-logs-eyebrow">
                        SECURITY & COMPLIANCE
                    </span>

                    <h1>Audit Logs</h1>

                    <p>
                        Review security and administrative activity
                        across the banking system.
                    </p>
                </div>
            </div>

            <div className="admin-audit-logs-filter-panel">

                <div className="admin-audit-logs-filter-header">
                    <div className="admin-audit-logs-filter-title">
                        <span className="admin-audit-logs-filter-icon">
                            <Filter size={17} />
                        </span>

                        <div>
                            <h2>Filter Audit Logs</h2>
                            <p>
                                Narrow the activity records you want
                                to review.
                            </p>
                        </div>
                    </div>

                    {hasAppliedFilters && (
                        <button
                            type="button"
                            className="admin-audit-logs-clear-link"
                            onClick={handleClearFilters}
                        >
                            <X size={15} />
                            Clear filters
                        </button>
                    )}
                </div>

                <div className="admin-audit-logs-filters">

                    <div className="admin-audit-logs-field">
                        <label htmlFor="action">
                            Action
                        </label>

                        <select
                            id="action"
                            name="action"
                            value={filters.action}
                            onChange={handleFilterChange}
                        >
                            <option value="">
                                All actions
                            </option>

                            {ACTION_OPTIONS.map((option) => (
                                <option
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="admin-audit-logs-field">
                        <label htmlFor="resourceType">
                            Resource Type
                        </label>

                        <select
                            id="resourceType"
                            name="resourceType"
                            value={filters.resourceType}
                            onChange={handleFilterChange}
                        >
                            <option value="">
                                All resources
                            </option>

                            {RESOURCE_TYPE_OPTIONS.map((option) => (
                                <option
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="admin-audit-logs-field">
                        <label htmlFor="status">
                            Status
                        </label>

                        <select
                            id="status"
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                        >
                            <option value="">
                                All statuses
                            </option>

                            {STATUS_OPTIONS.map((option) => (
                                <option
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="admin-audit-logs-field">
                        <label htmlFor="from">
                            From
                        </label>

                        <input
                            id="from"
                            name="from"
                            type="date"
                            value={filters.from}
                            onChange={handleFilterChange}
                        />
                    </div>

                    <div className="admin-audit-logs-field">
                        <label htmlFor="to">
                            To
                        </label>

                        <input
                            id="to"
                            name="to"
                            type="date"
                            value={filters.to}
                            onChange={handleFilterChange}
                        />
                    </div>

                    <div className="admin-audit-logs-filter-actions">
                        <button
                            type="button"
                            className="admin-audit-logs-apply-button"
                            onClick={handleApplyFilters}
                        >
                            <Search size={16} />
                            Apply Filters
                        </button>
                    </div>

                </div>
            </div>

            <div className="admin-audit-logs-intro">
                <div>
                    <h2>Activity Records</h2>
                    <p>
                        Review recorded authentication,
                        customer, account, beneficiary and
                        branch activities.
                    </p>
                </div>

                {!loading && !error && (
                    <div className="admin-audit-logs-count">
                        {totalElements}{" "}
                        {totalElements === 1
                            ? "record"
                            : "records"}
                    </div>
                )}
            </div>

            {loading && !initialLoading &&  (
                <div className="admin-audit-logs-state-card">
                    <div className="admin-audit-logs-spinner">
                        <RefreshCw size={22} />
                    </div>

                    <h3>Loading audit logs</h3>

                    <p>
                        Retrieving the latest activity records.
                    </p>
                </div>
            )}

            {!loading && error && (
                <div className="admin-audit-logs-state-card admin-audit-logs-error-state">
                    <div className="admin-audit-logs-state-icon">
                        <RefreshCw size={22} />
                    </div>

                    <h3>Unable to load audit logs</h3>

                    <p>{error}</p>

                    <button
                        type="button"
                        className="admin-audit-logs-retry-button"
                        onClick={handleRetry}
                    >
                        <RefreshCw size={16} />
                        Try Again
                    </button>
                </div>
            )}

            {!loading && !error && auditLogs.length === 0 && (
                <div className="admin-audit-logs-state-card">
                    <div className="admin-audit-logs-state-icon">
                        <FileSearch size={23} />
                    </div>

                    <h3>No audit logs found</h3>

                    <p>
                        No activity records match the selected
                        filters.
                    </p>

                    {hasAppliedFilters && (
                        <button
                            type="button"
                            className="admin-audit-logs-clear-button"
                            onClick={handleClearFilters}
                        >
                            <X size={16} />
                            Clear Filters
                        </button>
                    )}
                </div>
            )}

            {!loading && !error && auditLogs.length > 0 && (
                <>
                    <div className="admin-audit-logs-table-card">

                        <div className="admin-audit-logs-table-wrapper">
                            <table className="admin-audit-logs-table">
                                <thead>
                                    <tr>
                                        <th>Timestamp</th>
                                        <th>User</th>
                                        <th>Action</th>
                                        <th>Resource</th>
                                        <th>Resource ID</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {auditLogs.map((auditLog) => (
                                        <tr key={auditLog.id}>

                                            <td className="admin-audit-timestamp">
                                                {formatDateTime(
                                                    auditLog.timestamp
                                                )}
                                            </td>

                                            <td>
                                                <span className="admin-audit-user">
                                                    {auditLog.userEmail || "System"}
                                                </span>
                                            </td>

                                            <td>
                                                <span className="admin-audit-action">
                                                    {formatAction(
                                                        auditLog.action
                                                    )}
                                                </span>
                                            </td>

                                            <td>
                                                <span className="admin-audit-resource">
                                                    {formatResourceType(
                                                        auditLog.resourceType
                                                    )}
                                                </span>
                                            </td>

                                            <td>
                                                <span className="admin-audit-resource-id">
                                                    {auditLog.resourceId ?? "—"}
                                                </span>
                                            </td>

                                            <td>
                                                <span
                                                    className={`admin-audit-status ${getStatusClass(
                                                        auditLog.status
                                                    )}`}
                                                >
                                                    {formatStatus(
                                                        auditLog.status
                                                    )}
                                                </span>
                                            </td>

                                            <td>
                                                <Link
                                                    to={`/admin/audit-logs/${auditLog.id}`}
                                                    className="admin-audit-view-button"
                                                    aria-label={`View audit log ${auditLog.id}`}
                                                    title="View audit log"
                                                >
                                                    <Eye size={16} />
                                                    View
                                                </Link>
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    </div>

                    {totalPages > 1 && (
                        <div className="admin-audit-logs-pagination">

                            <button
                                type="button"
                                className="admin-audit-pagination-button"
                                disabled={page === 0}
                                onClick={() =>
                                    setPage((previous) => previous - 1)
                                }
                            >
                                Previous
                            </button>

                            <span className="admin-audit-pagination-info">
                                Page {page + 1} of {totalPages}
                            </span>

                            <button
                                type="button"
                                className="admin-audit-pagination-button"
                                disabled={page >= totalPages - 1}
                                onClick={() =>
                                    setPage((previous) => previous + 1)
                                }
                            >
                                Next
                            </button>

                        </div>
                    )}
                </>
            )}

        </section>
    );
}

export default AdminAuditLogs;