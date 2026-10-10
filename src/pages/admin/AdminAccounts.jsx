
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    WalletCards,
    Eye,
    ChevronLeft,
    ChevronRight,
    Search,
    X,
    RefreshCw
} from "lucide-react";

import adminApi from "../../api/adminApi";
import "../../css/admin/AdminAccounts.css";
import LoadingScreen from "../../components/common/LoadingScreen";

function AdminAccounts() {
    const [accounts, setAccounts] = useState([]);
    const [totalAccounts, setTotalAccounts] = useState(0);

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [search, setSearch] = useState("");
    const [appliedSearch, setAppliedSearch] = useState("");

    const [initialLoading, setInitialLoading] = useState(true);
    const [tableLoading, setTableLoading] = useState(false);
    const [error, setError] = useState("");

    // Initial page-data loading
    useEffect(() => {
        let isMounted = true;

        const fetchAccounts = async () => {
            setInitialLoading(true);
            setError("");

            try {
                const response = await adminApi.getAccounts(0, "");
                const data = response.data;

                if (!isMounted) {
                    return;
                }

                setAccounts(data.content || []);
                setTotalAccounts(data.totalElements ?? 0);
                setPage(data.number ?? 0);
                setTotalPages(data.totalPages ?? 0);
            } catch (error) {
                console.error("Failed to load accounts:", error);

                if (!isMounted) {
                    return;
                }

                setError(
                    error.response?.data?.message ||
                    "Unable to load accounts. Please try again."
                );
            } finally {
                if (isMounted) {
                    setInitialLoading(false);
                }
            }
        };

        fetchAccounts();

        return () => {
            isMounted = false;
        };
    }, []);

    // Search, clear search, and pagination loading
    const loadAccounts = async (
        pageNumber = 0,
        searchValue = appliedSearch
    ) => {
        setTableLoading(true);
        setError("");

        try {
            const response = await adminApi.getAccounts(
                pageNumber,
                searchValue
            );

            const data = response.data;

            setAccounts(data.content || []);
            setTotalAccounts(data.totalElements ?? 0);
            setPage(data.number ?? pageNumber);
            setTotalPages(data.totalPages ?? 0);
        } catch (error) {
            console.error("Failed to load accounts:", error);

            setError(
                error.response?.data?.message ||
                "Unable to load accounts. Please try again."
            );
        } finally {
            setTableLoading(false);
        }
    };

    const handleSearch = () => {
        const trimmedSearch = search.trim();

        setAppliedSearch(trimmedSearch);
        loadAccounts(0, trimmedSearch);
    };

    const handleClearSearch = () => {
        setSearch("");
        setAppliedSearch("");
        loadAccounts(0, "");
    };

    const handleSearchKeyDown = (event) => {
        if (event.key === "Enter" && !initialLoading && !tableLoading) {
            handleSearch();
        }
    };

    const handlePreviousPage = () => {
        if (page > 0 && !tableLoading) {
            loadAccounts(page - 1, appliedSearch);
        }
    };

    const handleNextPage = () => {
        if (page < totalPages - 1 && !tableLoading) {
            loadAccounts(page + 1, appliedSearch);
        }
    };

    const formatBalance = (balance) => {
        if (balance === null || balance === undefined) {
            return "₹0.00";
        }

        const numericBalance = Number(balance);

        if (Number.isNaN(numericBalance)) {
            return "₹0.00";
        }

        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(numericBalance);
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "ACTIVE":
                return "admin-account-status active";
            case "INACTIVE":
                return "admin-account-status inactive";
            case "FROZEN":
                return "admin-account-status frozen";
            case "CLOSED":
                return "admin-account-status closed";
            default:
                return "admin-account-status";
        }
    };

    const getAccountTypeClass = (accountType) => {
        switch (accountType) {
            case "SAVINGS":
                return "admin-account-type savings";
            case "CURRENT":
                return "admin-account-type current";
            default:
                return "admin-account-type";
        }
    };

    return (
        <div className="admin-accounts">
            <section className="admin-accounts-search-panel">
                <div className="admin-accounts-search-header">
                    <div className="admin-accounts-search-title">
                        <div className="admin-accounts-search-title-icon">
                            <Search size={16} strokeWidth={2} />
                        </div>

                        <div>
                            <h3>Find an account</h3>
                            <p>
                                Search by account number, customer, branch
                                or IFSC.
                            </p>
                        </div>
                    </div>

                    {appliedSearch && (
                        <button
                            type="button"
                            className="admin-accounts-clear-search"
                            onClick={handleClearSearch}
                            disabled={initialLoading || tableLoading}
                        >
                            <X size={14} strokeWidth={2} />
                            <span>Clear search</span>
                        </button>
                    )}
                </div>

                <div className="admin-accounts-search-form">
                    <div className="admin-accounts-search-input">
                        <Search
                            size={18}
                            strokeWidth={1.8}
                            className="admin-accounts-search-input-icon"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            onKeyDown={handleSearchKeyDown}
                            placeholder="Search accounts..."
                            aria-label="Search accounts"
                            disabled={initialLoading || tableLoading}
                        />

                        {search && (
                            <button
                                type="button"
                                className="admin-accounts-input-clear"
                                onClick={() => setSearch("")}
                                aria-label="Clear search input"
                                disabled={initialLoading || tableLoading}
                            >
                                <X size={15} strokeWidth={2} />
                            </button>
                        )}
                    </div>

                    <button
                        type="button"
                        className="admin-accounts-search-button"
                        onClick={handleSearch}
                        disabled={initialLoading || tableLoading}
                    >
                        {tableLoading ? (
                            <RefreshCw size={15} className="admin-accounts-spin" />
                        ) : (
                            <Search size={15} strokeWidth={2} />
                        )}

                        <span>
                            {tableLoading ? "Searching..." : "Search"}
                        </span>
                    </button>
                </div>

                {appliedSearch && (
                    <div className="admin-accounts-search-status">
                        <span>
                            Showing results for{" "}
                            <strong>"{appliedSearch}"</strong>
                        </span>

                        <span>
                            {totalAccounts}{" "}
                            {totalAccounts === 1 ? "account" : "accounts"}
                        </span>
                    </div>
                )}
            </section>

            <section className="admin-accounts-intro">
                <div>
                    <p className="admin-accounts-eyebrow">
                        ACCOUNT MANAGEMENT
                    </p>

                    <h2>Accounts</h2>

                    <p>
                        View accounts and manage account operations.
                    </p>
                </div>

                <div className="admin-accounts-count">
                    <WalletCards size={17} strokeWidth={1.9} />

                    <span>
                        {initialLoading
                            ? "Loading..."
                            : `${totalAccounts} total accounts`}
                    </span>
                </div>
            </section>

            <section className="admin-accounts-table-card">
                {error && (
                    <div className="admin-accounts-error" role="alert">
                        <p>{error}</p>

                        <button
                            type="button"
                            onClick={() =>
                                loadAccounts(page, appliedSearch)
                            }
                            disabled={tableLoading}
                        >
                            {tableLoading ? "Retrying..." : "Retry"}
                        </button>
                    </div>
                )}

                {initialLoading ? (
                    <LoadingScreen message="Loading your Accounts..." />
                ) : tableLoading ? (
                    <div
                        className="admin-accounts-list-loading"
                        role="status"
                        aria-live="polite"
                    >
                        <RefreshCw
                            size={20}
                            className="admin-accounts-spin"
                            aria-hidden="true"
                        />
                        <span>Loading accounts...</span>
                    </div>
                ) : accounts.length === 0 ? (
                    <div className="admin-accounts-empty">
                        <div className="admin-accounts-empty-icon">
                            <WalletCards
                                size={24}
                                strokeWidth={1.7}
                            />
                        </div>

                        <h3>
                            {appliedSearch
                                ? "No accounts found"
                                : "No accounts available"}
                        </h3>

                        <p>
                            {appliedSearch
                                ? "Try searching with a different account number, customer, branch or IFSC."
                                : "There are currently no accounts to display."}
                        </p>
                    </div>
                ) : (
                    <div className="admin-accounts-table-wrapper">
                        <table className="admin-accounts-table">
                            <thead>
                                <tr>
                                    <th>Account</th>
                                    <th>Customer</th>
                                    <th>Branch</th>
                                    <th>Type</th>
                                    <th>Balance</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {accounts.map((account) => (
                                    <tr key={account.id}>
                                        <td>
                                            <div className="admin-account-number">
                                                <div className="admin-account-icon">
                                                    <WalletCards
                                                        size={15}
                                                        strokeWidth={1.8}
                                                    />
                                                </div>

                                                <div>
                                                    <strong>
                                                        {account.accountNumber}
                                                    </strong>
                                                    <span>
                                                        Account #{account.id}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        <td>
                                            <div className="admin-account-customer">
                                                <span>
                                                    {account.customerName || "—"}
                                                </span>
                                            </div>
                                        </td>

                                        <td>
                                            <span className="admin-account-branch">
                                                {account.branchCode || "—"}
                                            </span>
                                        </td>

                                        <td>
                                            <span
                                                className={getAccountTypeClass(
                                                    account.accountType
                                                )}
                                            >
                                                {account.accountType || "—"}
                                            </span>
                                        </td>

                                        <td>
                                            <span className="admin-account-balance">
                                                {formatBalance(account.balance)}
                                            </span>
                                        </td>

                                        <td>
                                            <span
                                                className={getStatusClass(
                                                    account.status
                                                )}
                                            >
                                                <span className="admin-account-status-dot" />
                                                {account.status}
                                            </span>
                                        </td>

                                        <td>
                                            <Link
                                                to={`/admin/accounts/${account.id}`}
                                                className="admin-account-view-button"
                                            >
                                                <Eye
                                                    size={15}
                                                    strokeWidth={1.9}
                                                />
                                                <span>View</span>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {!initialLoading &&
                    !tableLoading &&
                    accounts.length > 0 &&
                    totalPages > 0 && (
                        <div className="admin-accounts-pagination">
                            <span className="admin-account-pagination-info">
                                Page {page + 1} of {totalPages}
                            </span>

                            <div className="admin-account-pagination-controls">
                                <button
                                    type="button"
                                    onClick={handlePreviousPage}
                                    disabled={page === 0}
                                    aria-label="Previous page"
                                >
                                    <ChevronLeft
                                        size={17}
                                        strokeWidth={1.9}
                                    />
                                </button>

                                <span className="admin-account-pagination-current">
                                    {page + 1}
                                </span>

                                <button
                                    type="button"
                                    onClick={handleNextPage}
                                    disabled={page >= totalPages - 1}
                                    aria-label="Next page"
                                >
                                    <ChevronRight
                                        size={17}
                                        strokeWidth={1.9}
                                    />
                                </button>
                            </div>
                        </div>
                    )}
            </section>
        </div>
    );
}

export default AdminAccounts;
