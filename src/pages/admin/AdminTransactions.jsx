import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Search,
    X
} from "lucide-react";
import adminApi from "../../api/adminApi";
import "../../css/admin/AdminTransactions.css";
import LoadingScreen from "../../components/common/LoadingScreen";

function AdminTransactions() {
    const [transactions, setTransactions] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const [accountNumber, setAccountNumber] = useState("");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [transactionType, setTransactionType] = useState("");
    const [status, setStatus] = useState("");

    const [appliedFilters, setAppliedFilters] = useState({
        accountNumber: "",
        from: "",
        to: "",
        transactionType: "",
        status: ""
    });

    const [loading, setLoading] = useState(true);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState("");
    const [retryKey, setRetryKey] = useState(0);

    useEffect(() => {
        let isMounted = true;

        const fetchTransactions = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await adminApi.getTransactions(
                    page,
                    appliedFilters
                );

                if (!isMounted) {
                    return;
                }

                setTransactions(response.data.content || []);
                setTotalPages(response.data.totalPages || 0);
                setTotalElements(response.data.totalElements || 0);
            } catch (err) {
                if (!isMounted) {
                    return;
                }

                setError(
                    err.response?.data?.message ||
                    "Unable to load transactions. Please try again."
                );
            } finally {
                if (isMounted) {
                    setLoading(false);
                    setInitialLoading(false);
                }
            }
        };

        fetchTransactions();

        return () => {
            isMounted = false;
        };
    }, [page, appliedFilters, retryKey]);

    const handleApplyFilters = (event) => {
        event.preventDefault();

        if (from && to && from > to) {
            setError("From date cannot be later than To date.");
            return;
        }

        setError("");

        setAppliedFilters({
            accountNumber: accountNumber.trim(),
            from,
            to,
            transactionType,
            status
        });

        setPage(0);
    };

    const handleClearFilters = () => {
        setAccountNumber("");
        setFrom("");
        setTo("");
        setTransactionType("");
        setStatus("");

        setAppliedFilters({
            accountNumber: "",
            from: "",
            to: "",
            transactionType: "",
            status: ""
        });

        setPage(0);
        setError("");
    };

    const handlePreviousPage = () => {
        if (page > 0) {
            setPage((currentPage) => currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (page < totalPages - 1) {
            setPage((currentPage) => currentPage + 1);
        }
    };

    const formatAmount = (amount) => {
        if (amount === null || amount === undefined) {
            return "—";
        }

        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 2
        }).format(amount);
    };

    const formatDateTime = (value) => {
        if (!value) {
            return "—";
        }

        return new Intl.DateTimeFormat("en-IN", {
            dateStyle: "medium",
            timeStyle: "short"
        }).format(new Date(value));
    };

    const getTransactionTypeClass = (type) => {
        if (!type) {
            return "";
        }

        return `transaction-type-${type.toLowerCase()}`;
    };

    const getStatusClass = (transactionStatus) => {
        if (!transactionStatus) {
            return "";
        }

        return `transaction-status-${transactionStatus.toLowerCase()}`;
    };

    const hasActiveFilters =
        appliedFilters.accountNumber ||
        appliedFilters.from ||
        appliedFilters.to ||
        appliedFilters.transactionType ||
        appliedFilters.status;

        if (initialLoading && loading) {
            return (
                <LoadingScreen message="Loading transactions..." />
            );
        }

    return (
        <section className="admin-transactions-page">

            <div className="admin-transactions-filter-card">
                <div className="admin-transactions-filter-header">
                    <div>
                        <h2>Transaction Filters</h2>
                        <p>
                            Search and filter transactions using the available
                            criteria.
                        </p>
                    </div>

                    {hasActiveFilters && (
                        <button
                            type="button"
                            className="admin-transactions-clear-top"
                            onClick={handleClearFilters}
                        >
                            <X size={16} />
                            Clear Filters
                        </button>
                    )}
                </div>

                <form
                    className="admin-transactions-filter-form"
                    onSubmit={handleApplyFilters}
                >
                    <div className="admin-transactions-field account-field">
                        <label htmlFor="accountNumber">
                            Account Number
                        </label>

                        <div className="admin-transactions-input-wrapper">
                            <Search size={17} />

                            <input
                                id="accountNumber"
                                type="text"
                                value={accountNumber}
                                onChange={(event) =>
                                    setAccountNumber(event.target.value)
                                }
                                placeholder="Enter account number"
                            />
                        </div>
                    </div>

                    <div className="admin-transactions-field">
                        <label htmlFor="from">
                            From Date
                        </label>

                        <input
                            id="from"
                            type="date"
                            value={from}
                            onChange={(event) =>
                                setFrom(event.target.value)
                            }
                        />
                    </div>

                    <div className="admin-transactions-field">
                        <label htmlFor="to">
                            To Date
                        </label>

                        <input
                            id="to"
                            type="date"
                            value={to}
                            onChange={(event) =>
                                setTo(event.target.value)
                            }
                        />
                    </div>

                    <div className="admin-transactions-field">
                        <label htmlFor="transactionType">
                            Transaction Type
                        </label>

                        <select
                            id="transactionType"
                            value={transactionType}
                            onChange={(event) =>
                                setTransactionType(event.target.value)
                            }
                        >
                            <option value="">All Types</option>
                            <option value="DEPOSIT">Deposit</option>
                            <option value="WITHDRAW">Withdrawal</option>
                            <option value="TRANSFER">Transfer</option>
                        </select>
                    </div>

                    <div className="admin-transactions-field">
                        <label htmlFor="status">
                            Status
                        </label>

                        <select
                            id="status"
                            value={status}
                            onChange={(event) =>
                                setStatus(event.target.value)
                            }
                        >
                            <option value="">All Statuses</option>
                            <option value="SUCCESS">Success</option>
                            <option value="FAILED">Failed</option>
                        </select>
                    </div>

                    <div className="admin-transactions-filter-actions">
                        <button
                            type="submit"
                            className="admin-transactions-apply-button"
                        >
                            <Search size={17} />
                            Apply Filters
                        </button>

                        <button
                            type="button"
                            className="admin-transactions-clear-button"
                            onClick={handleClearFilters}
                        >
                            Clear
                        </button>
                    </div>
                </form>
            </div>

            <div className="admin-transactions-page-intro">
                <div>
                    <span className="admin-transactions-eyebrow">
                        TRANSACTION OPERATIONS
                    </span>

                    <h1>Transactions</h1>

                    <p>
                        Review and inspect financial transactions across the
                        banking system.
                    </p>
                </div>

                {!loading && !error && (
                    <div className="admin-transactions-count">
                        <span>{totalElements}</span>

                        <small>
                            {totalElements === 1
                                ? "Transaction"
                                : "Transactions"}
                        </small>
                    </div>
                )}
            </div>

        
            {error && (
                <div className="admin-transactions-error">
                    <span>{error}</span>

                    <button
                        type="button"
                        onClick={() =>
                            setRetryKey((currentKey) => currentKey + 1)
                        }
                    >
                        Retry
                    </button>
                </div>
            )}


            <div className="admin-transactions-table-card">
                {loading ? (
                    <div className="admin-transactions-state">
                        <div className="admin-transactions-loader" />

                        <p>Loading transactions...</p>
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="admin-transactions-state">
                        <div className="admin-transactions-empty-icon">
                            <Search size={24} />
                        </div>

                        <h3>No transactions found</h3>

                        <p>
                            No transactions match the selected filters.
                        </p>

                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={handleClearFilters}
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="admin-transactions-table-wrapper">
                            <table className="admin-transactions-table">
                                <colgroup>
                                    <col className="transaction-reference-column" />
                                    <col className="transaction-account-column" />
                                    <col className="transaction-type-column" />
                                    <col className="transaction-amount-column" />
                                    <col className="transaction-status-column" />
                                    <col className="transaction-date-column" />
                                    <col className="transaction-action-column" />
                                </colgroup>

                                <thead>
                                    <tr>
                                        <th>Reference</th>
                                        <th>Account</th>
                                        <th>Type</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Date &amp; Time</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {transactions.map((transaction) => (
                                        <tr
                                            key={
                                                transaction.transactionReference
                                            }
                                        >
                                            <td>
                                                <span className="admin-transaction-reference">
                                                    {
                                                        transaction.transactionReference
                                                    }
                                                </span>
                                            </td>

                                            <td>
                                                <div className="admin-transaction-account-cell">
                                                    <div>
                                                        <span className="admin-transaction-account-label">
                                                            From
                                                        </span>

                                                        <span>
                                                            {
                                                                transaction.sourceAccountNumber ||
                                                                "—"
                                                            }
                                                        </span>
                                                    </div>

                                                    <div>
                                                        <span className="admin-transaction-account-label">
                                                            To
                                                        </span>

                                                        <span>
                                                            {
                                                                transaction.destinationAccountNumber ||
                                                                "—"
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td>
                                                <span
                                                    className={`admin-transaction-type ${getTransactionTypeClass(
                                                        transaction.transactionType
                                                    )}`}
                                                >
                                                    {transaction.transactionType ||
                                                        "—"}
                                                </span>
                                            </td>

                                            <td>
                                                <span className="admin-transaction-amount">
                                                    {formatAmount(
                                                        transaction.amount
                                                    )}
                                                </span>
                                            </td>

                                            <td>
                                                <span
                                                    className={`admin-transaction-status ${getStatusClass(
                                                        transaction.status
                                                    )}`}
                                                >
                                                    {transaction.status ||
                                                        "—"}
                                                </span>
                                            </td>

                                            <td>
                                                <span className="admin-transaction-date">
                                                    {formatDateTime(
                                                        transaction.createdAt
                                                    )}
                                                </span>
                                            </td>

                                            <td>
                                                <Link
                                                    to={`/admin/transactions/${encodeURIComponent(
                                                        transaction.transactionReference
                                                    )}`}
                                                    className="admin-transaction-view-link"
                                                >
                                                    View
                                                    <ArrowRight size={15} />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="admin-transactions-pagination">
                            <span>
                                Page {page + 1} of {Math.max(totalPages, 1)}
                            </span>

                            <div className="admin-transactions-pagination-buttons">
                                <button
                                    type="button"
                                    onClick={handlePreviousPage}
                                    disabled={page === 0}
                                    aria-label="Previous page"
                                >
                                    <ChevronLeft size={18} />
                                </button>

                                <button
                                    type="button"
                                    onClick={handleNextPage}
                                    disabled={
                                        page >= totalPages - 1 ||
                                        totalPages === 0
                                    }
                                    aria-label="Next page"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}

export default AdminTransactions;