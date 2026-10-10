import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    ArrowLeft,
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    CircleAlert,
    FileText,
    Landmark,
    RefreshCw,
    UserRound
} from "lucide-react";
import adminApi from "../../api/adminApi";
import "../../css/admin/AdminTransactionDetails.css";
import LoadingScreen from "../../components/common/LoadingScreen";

function AdminTransactionDetails() {
    const { transactionReference } = useParams();

    const [transaction, setTransaction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [retryKey, setRetryKey] = useState(0);

    useEffect(() => {
        let isMounted = true;

        const fetchTransaction = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await adminApi.getTransaction(
                    transactionReference
                );

                if (!isMounted) {
                    return;
                }

                setTransaction(response.data);
            } catch (err) {
                if (!isMounted) {
                    return;
                }

                setError(
                    err.response?.data?.message ||
                    "Unable to load transaction details. Please try again."
                );
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchTransaction();

        return () => {
            isMounted = false;
        };
    }, [transactionReference, retryKey]);

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

    const getStatusClass = (status) => {
        if (!status) {
            return "";
        }

        return `admin-transaction-detail-status-${status.toLowerCase()}`;
    };

    const getTypeClass = (type) => {
        if (!type) {
            return "";
        }

        return `admin-transaction-detail-type-${type.toLowerCase()}`;
    };

    const getTypeLabel = (type) => {
        if (!type) {
            return "—";
        }

        if (type === "WITHDRAW") {
            return "Withdrawal";
        }

        if (type === "DEPOSIT") {
            return "Deposit";
        }

        if (type === "TRANSFER") {
            return "Transfer";
        }

        return type;
    };

    if (loading) {
        return (
            <LoadingScreen message="Loading transaction details..." />
        );
    }

    if (error) {
        return (
            <section className="admin-transaction-details-page">
                <div className="admin-transaction-details-error-state">
                    <div className="admin-transaction-details-error-icon">
                        <CircleAlert size={24} />
                    </div>

                    <h2>Unable to load transaction</h2>

                    <p>{error}</p>

                    <div className="admin-transaction-details-error-actions">
                        <button
                            type="button"
                            onClick={() =>
                                setRetryKey((currentKey) => currentKey + 1)
                            }
                        >
                            <RefreshCw size={16} />
                            Retry
                        </button>

                        <Link to="/admin/transactions">
                            <ArrowLeft size={16} />
                            Back to Transactions
                        </Link>
                    </div>
                </div>
            </section>
        );
    }

    if (!transaction) {
        return null;
    }

    const isFailed = transaction.status === "FAILED";
    const isTransfer = transaction.transactionType === "TRANSFER";
    const isDeposit = transaction.transactionType === "DEPOSIT";
    const isWithdraw = transaction.transactionType === "WITHDRAW";

    return (
        <section className="admin-transaction-details-page">


            <Link
                to="/admin/transactions"
                className="admin-transaction-details-back"
            >
                <ArrowLeft size={17} />
                Back to Transactions
            </Link>

            <div className="admin-transaction-details-header">
                <div>
                    <span className="admin-transaction-details-eyebrow">
                        TRANSACTION DETAILS
                    </span>

                    <h1>Transaction</h1>

                    <p>
                        Review the complete details of this banking
                        transaction.
                    </p>
                </div>

                <span
                    className={`admin-transaction-details-status ${getStatusClass(
                        transaction.status
                    )}`}
                >
                    {transaction.status === "SUCCESS" && (
                        <CheckCircle2 size={16} />
                    )}

                    {transaction.status === "FAILED" && (
                        <CircleAlert size={16} />
                    )}

                    {transaction.status}
                </span>
            </div>

            <div className="admin-transaction-summary-card">

                <div className="admin-transaction-summary-main">
                    <div className="admin-transaction-summary-icon">
                        ₹
                    </div>

                    <div>
                        <span className="admin-transaction-summary-label">
                            Transaction Amount
                        </span>

                        <strong>
                            {formatAmount(transaction.amount)}
                        </strong>
                    </div>
                </div>

                <div className="admin-transaction-summary-divider" />

                <div className="admin-transaction-summary-item">
                    <span>Transaction Type</span>

                    <span
                        className={`admin-transaction-details-type ${getTypeClass(
                            transaction.transactionType
                        )}`}
                    >
                        {getTypeLabel(transaction.transactionType)}
                    </span>
                </div>

                <div className="admin-transaction-summary-divider" />

                <div className="admin-transaction-summary-item">
                    <span>Transaction Reference</span>

                    <strong>
                        {transaction.transactionReference}
                    </strong>
                </div>
            </div>


            <div className="admin-transaction-details-section">

                <div className="admin-transaction-details-section-header">
                    <div className="admin-transaction-details-section-icon">
                        <Landmark size={19} />
                    </div>

                    <div>
                        <h2>
                            {isTransfer
                                ? "Transaction Accounts"
                                : "Transaction Account"}
                        </h2>

                        <p>
                            {isTransfer
                                ? "Accounts and customers involved in this transfer."
                                : "Account and customer involved in this transaction."}
                        </p>
                    </div>
                </div>

                {isTransfer && (
                    <div className="admin-transaction-accounts-grid">

                        <div className="admin-transaction-account-card">
                            <span className="admin-transaction-account-role">
                                SOURCE ACCOUNT
                            </span>

                            <div className="admin-transaction-account-number">
                                {transaction.sourceAccountNumber || "—"}
                            </div>

                            <div className="admin-transaction-account-customer">
                                <UserRound size={16} />

                                <div>
                                    <span>Customer</span>

                                    <strong>
                                        {transaction.sourceCustomerName ||
                                            "—"}
                                    </strong>
                                </div>
                            </div>
                        </div>

                        <div className="admin-transaction-transfer-arrow">
                            <ArrowRight size={19} />
                        </div>

                        <div className="admin-transaction-account-card">
                            <span className="admin-transaction-account-role">
                                DESTINATION ACCOUNT
                            </span>

                            <div className="admin-transaction-account-number">
                                {transaction.destinationAccountNumber ||
                                    "—"}
                            </div>

                            <div className="admin-transaction-account-customer">
                                <UserRound size={16} />

                                <div>
                                    <span>Customer</span>

                                    <strong>
                                        {transaction.destinationCustomerName ||
                                            "—"}
                                    </strong>
                                </div>
                            </div>
                        </div>

                    </div>
                )}

                {isDeposit && (
                    <div className="admin-transaction-single-account-card">

                        <span className="admin-transaction-account-role">
                            DESTINATION ACCOUNT
                        </span>

                        <div className="admin-transaction-single-account-content">

                            <div>
                                <span className="admin-transaction-single-account-number">
                                    {transaction.destinationAccountNumber ||
                                        "—"}
                                </span>
                            </div>

                            <div className="admin-transaction-account-customer">
                                <UserRound size={16} />

                                <div>
                                    <span>Customer</span>

                                    <strong>
                                        {transaction.destinationCustomerName ||
                                            "—"}
                                    </strong>
                                </div>
                            </div>

                        </div>
                    </div>
                )}

                {isWithdraw && (
                    <div className="admin-transaction-single-account-card">

                        <span className="admin-transaction-account-role">
                            SOURCE ACCOUNT
                        </span>

                        <div className="admin-transaction-single-account-content">

                            <div>
                                <span className="admin-transaction-single-account-number">
                                    {transaction.sourceAccountNumber ||
                                        "—"}
                                </span>
                            </div>

                            <div className="admin-transaction-account-customer">
                                <UserRound size={16} />

                                <div>
                                    <span>Customer</span>

                                    <strong>
                                        {transaction.sourceCustomerName ||
                                            "—"}
                                    </strong>
                                </div>
                            </div>

                        </div>
                    </div>
                )}

            </div>

            <div className="admin-transaction-details-section">

                <div className="admin-transaction-details-section-header">
                    <div className="admin-transaction-details-section-icon">
                        <FileText size={19} />
                    </div>

                    <div>
                        <h2>Transaction Information</h2>

                        <p>
                            Additional information recorded for this
                            transaction.
                        </p>
                    </div>
                </div>

                <div className="admin-transaction-information-grid">

                    <div className="admin-transaction-information-item">
                        <span>Transaction Reference</span>

                        <strong>
                            {transaction.transactionReference}
                        </strong>
                    </div>

                    <div className="admin-transaction-information-item">
                        <span>Transaction Type</span>

                        <strong>
                            {getTypeLabel(transaction.transactionType)}
                        </strong>
                    </div>

                    <div className="admin-transaction-information-item">
                        <span>Status</span>

                        <strong
                            className={`admin-transaction-information-status ${getStatusClass(
                                transaction.status
                            )}`}
                        >
                            {transaction.status}
                        </strong>
                    </div>

                    <div className="admin-transaction-information-item">
                        <span>Created At</span>

                        <strong className="admin-transaction-date-value">
                            <CalendarDays size={15} />
                            {formatDateTime(transaction.createdAt)}
                        </strong>
                    </div>

                </div>
            </div>

            {transaction.description && (
                <div className="admin-transaction-details-section">

                    <div className="admin-transaction-details-section-header">
                        <div className="admin-transaction-details-section-icon">
                            <FileText size={19} />
                        </div>

                        <div>
                            <h2>Description</h2>

                            <p>
                                Description provided for this transaction.
                            </p>
                        </div>
                    </div>

                    <div className="admin-transaction-description">
                        {transaction.description}
                    </div>
                </div>
            )}

            {isFailed && transaction.failureReason && (
                <div className="admin-transaction-failure-card">

                    <div className="admin-transaction-failure-icon">
                        <CircleAlert size={20} />
                    </div>

                    <div>
                        <h2>Failure Reason</h2>

                        <p>
                            {transaction.failureReason}
                        </p>
                    </div>

                </div>
            )}

        </section>
    );
}

export default AdminTransactionDetails;