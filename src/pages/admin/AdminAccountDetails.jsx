import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Building2,
    CheckCircle2,
    CreditCard,
    Mail,
    User,
    WalletCards,
    X,
    AlertCircle,
    Clock3,
    ShieldCheck
} from "lucide-react";

import adminApi from "../../api/adminApi";
import "../../css/admin/AdminAccountDetails.css";
import LoadingScreen from "../../components/common/LoadingScreen";

function AdminAccountDetails() {
    const { accountId } = useParams();

    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedStatus, setSelectedStatus] = useState("");
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [showStatusConfirmation, setShowStatusConfirmation] = useState(false);

    const [depositAmount, setDepositAmount] = useState("");
    const [depositDescription, setDepositDescription] = useState("");
    const [showDepositConfirmation, setShowDepositConfirmation] = useState(false);
    const [depositing, setDepositing] = useState(false);

    const [successMessage, setSuccessMessage] = useState("");
    const [actionError, setActionError] = useState("");

    useEffect(() => {
        let isMounted = true;

        const loadAccount = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await adminApi.getAccount(accountId);

                if (!isMounted) {
                    return;
                }

                setAccount(response.data);
                setSelectedStatus(response.data.status);
            } catch (err) {
                if (!isMounted) {
                    return;
                }

                console.error("Failed to load account:", err);

                const message =
                    err.response?.data?.message ||
                    "Unable to load account details.";

                setError(message);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadAccount();

        return () => {
            isMounted = false;
        };
    }, [accountId]);

    const formatCurrency = (value) => {
        if (value === null || value === undefined) {
            return "₹0.00";
        }

        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(Number(value));
    };

    const formatDateTime = (dateValue) => {
        if (!dateValue) {
            return "—";
        }

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return "—";
        }

        return date.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "ACTIVE":
                return "status-active";

            case "INACTIVE":
                return "status-inactive";

            case "FROZEN":
                return "status-frozen";

            case "CLOSED":
                return "status-closed";

            default:
                return "";
        }
    };

    const getAvailableStatuses = (status) => {
        switch (status) {
            case "ACTIVE":
                return ["ACTIVE", "INACTIVE", "FROZEN", "CLOSED"];

            case "INACTIVE":
                return ["INACTIVE", "ACTIVE", "FROZEN", "CLOSED"];

            case "FROZEN":
                return ["FROZEN", "ACTIVE", "INACTIVE", "CLOSED"];

            case "CLOSED":
                return ["CLOSED"];

            default:
                return [];
        }
    };

    const getStatusDescription = (status) => {
        switch (status) {
            case "ACTIVE":
                return "Account is active and available for normal banking operations.";

            case "INACTIVE":
                return "Account is inactive and restricted from normal banking operations.";

            case "FROZEN":
                return "Account is frozen and banking operations are restricted.";

            case "CLOSED":
                return "Account is permanently closed and cannot be reactivated.";

            default:
                return "";
        }
    };

    const handleStatusChange = (event) => {
        const newStatus = event.target.value;

        setSelectedStatus(newStatus);
        setActionError("");
        setSuccessMessage("");

        if (!account || newStatus === account.status) {
            return;
        }

        setShowStatusConfirmation(true);
    };

    const handleStatusUpdate = async () => {
        if (!account || selectedStatus === account.status) {
            setShowStatusConfirmation(false);
            return;
        }

        try {
            setUpdatingStatus(true);
            setActionError("");
            setSuccessMessage("");

            await adminApi.changeAccountStatus(
                account.id,
                selectedStatus
            );

            setAccount((previousAccount) => ({
                ...previousAccount,
                status: selectedStatus,
                updatedAt: new Date().toISOString()
            }));

            setSuccessMessage(
                `Account status changed to ${selectedStatus}.`
            );

            setShowStatusConfirmation(false);
        } catch (err) {
            console.error("Failed to change account status:", err);

            const message =
                err.response?.data?.message ||
                "Unable to change account status.";

            setActionError(message);
            setSelectedStatus(account.status);
            setShowStatusConfirmation(false);
        } finally {
            setUpdatingStatus(false);
        }
    };

    const cancelStatusChange = () => {
        if (updatingStatus) {
            return;
        }

        setSelectedStatus(account.status);
        setShowStatusConfirmation(false);
    };

    const handleDepositSubmit = (event) => {
        event.preventDefault();

        setActionError("");
        setSuccessMessage("");

        const amount = Number(depositAmount);

        if (!depositAmount || Number.isNaN(amount)) {
            setActionError("Please enter a valid deposit amount.");
            return;
        }

        if (amount < 1000) {
            setActionError("Deposit amount must be at least ₹1,000.00.");
            return;
        }

        if (account.status !== "ACTIVE") {
            setActionError(
                "Deposits can only be made to an ACTIVE account."
            );
            return;
        }

        setShowDepositConfirmation(true);
    };

    const handleDeposit = async () => {
        try {
            setDepositing(true);
            setActionError("");
            setSuccessMessage("");

            const response = await adminApi.depositToAccount(
                account.id,
                {
                    amount: Number(depositAmount),
                    description:
                        depositDescription.trim() || null
                }
            );

            const transaction = response.data;

            setAccount((previousAccount) => ({
                ...previousAccount,
                balance:
                    Number(previousAccount.balance || 0) +
                    Number(transaction.amount || 0),
                updatedAt: transaction.createdAt
            }));

            setDepositAmount("");
            setDepositDescription("");
            setShowDepositConfirmation(false);

            setSuccessMessage(
                `Deposit successful. Transaction reference: ${transaction.transactionReference}`
            );
        } catch (err) {
            console.error("Failed to deposit:", err);

            const message =
                err.response?.data?.message ||
                "Unable to complete the deposit.";

            setActionError(message);
            setShowDepositConfirmation(false);
        } finally {
            setDepositing(false);
        }
    };

    const cancelDeposit = () => {
        if (depositing) {
            return;
        }

        setShowDepositConfirmation(false);
    };

    if (loading) {
            return (
                <LoadingScreen message="Loading Account Details..." />
            );
        }

    if (error || !account) {
        return (
            <section className="admin-account-details-page">
                <div className="admin-account-details-error">
                    <div className="admin-account-error-icon">
                        <AlertCircle size={24} strokeWidth={1.8} />
                    </div>

                    <h2>Unable to load account</h2>

                    <p>
                        {error || "Account details could not be found."}
                    </p>

                    <div className="admin-account-error-actions">
                        <Link
                            to="/admin/accounts"
                            className="admin-account-back-button"
                        >
                            <ArrowLeft size={17} strokeWidth={2} />
                            Back to Accounts
                        </Link>

                        <button
                            type="button"
                            className="admin-account-retry-button"
                            onClick={() => window.location.reload()}
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    const availableStatuses = getAvailableStatuses(account.status);

    return (
        <section className="admin-account-details-page">

            <div className="admin-account-details-header">
                <div>
                    <Link
                        to="/admin/accounts"
                        className="admin-account-back-link"
                    >
                        <ArrowLeft size={17} strokeWidth={2} />
                        Back to Accounts
                    </Link>

                    <div className="admin-account-title-row">
                        <div className="admin-account-title-icon">
                            <WalletCards
                                size={24}
                                strokeWidth={1.8}
                            />
                        </div>

                        <div>
                            <p className="admin-account-eyebrow">
                                ACCOUNT DETAILS
                            </p>

                            <h1>{account.accountNumber}</h1>

                            <p className="admin-account-id">
                                Account ID: #{account.id}
                            </p>
                        </div>
                    </div>
                </div>

                <span
                    className={`admin-account-status-badge ${getStatusClass(
                        account.status
                    )}`}
                >
                    <span className="admin-account-status-dot" />
                    {account.status}
                </span>
            </div>

            {successMessage && (
                <div className="admin-account-success-message">
                    <CheckCircle2
                        size={19}
                        strokeWidth={1.9}
                    />
                    <span>{successMessage}</span>
                </div>
            )}

            {actionError && (
                <div className="admin-account-action-error">
                    <AlertCircle
                        size={19}
                        strokeWidth={1.9}
                    />

                    <span>{actionError}</span>

                    <button
                        type="button"
                        onClick={() => setActionError("")}
                        aria-label="Dismiss error"
                    >
                        <X size={17} strokeWidth={2} />
                    </button>
                </div>
            )}

            <div className="admin-account-balance-card">
                <div className="admin-account-balance-content">
                    <div className="admin-account-balance-icon">
                        <span className="admin-account-rupee-icon">
                            ₹
                        </span>
                    </div>

                    <div>
                        <p>Available Balance</p>
                        <h2>{formatCurrency(account.balance)}</h2>
                    </div>
                </div>

                <div className="admin-account-balance-meta">
                    <span>Account Type</span>
                    <strong>{account.accountType}</strong>
                </div>
            </div>

            <div className="admin-account-details-grid">

                <div className="admin-account-details-card">
                    <div className="admin-account-card-header">
                        <div className="admin-account-card-icon">
                            <User
                                size={19}
                                strokeWidth={1.9}
                            />
                        </div>

                        <div>
                            <h2>Customer Information</h2>
                            <p>Account holder details</p>
                        </div>
                    </div>

                    <div className="admin-account-info-list">
                        <div className="admin-account-info-item">
                            <span className="admin-account-info-label">
                                Customer Name
                            </span>

                            <span className="admin-account-info-value">
                                {account.customerName || "—"}
                            </span>
                        </div>

                        <div className="admin-account-info-item">
                            <span className="admin-account-info-label">
                                Email Address
                            </span>

                            <span className="admin-account-info-value admin-account-email-value">
                                <Mail
                                    size={15}
                                    strokeWidth={1.8}
                                />
                                {account.customerEmail || "—"}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="admin-account-details-card">
                    <div className="admin-account-card-header">
                        <div className="admin-account-card-icon">
                            <Building2
                                size={19}
                                strokeWidth={1.9}
                            />
                        </div>

                        <div>
                            <h2>Branch Information</h2>
                            <p>Account branch details</p>
                        </div>
                    </div>

                    <div className="admin-account-info-list">
                        <div className="admin-account-info-item">
                            <span className="admin-account-info-label">
                                Branch
                            </span>

                            <span className="admin-account-info-value">
                                {account.branchName || "—"}
                            </span>
                        </div>

                        <div className="admin-account-info-item">
                            <span className="admin-account-info-label">
                                IFSC Code
                            </span>

                            <span className="admin-account-info-value admin-account-ifsc">
                                {account.branchIfscCode || "—"}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="admin-account-details-card">
                    <div className="admin-account-card-header">
                        <div className="admin-account-card-icon">
                            <CreditCard
                                size={19}
                                strokeWidth={1.9}
                            />
                        </div>

                        <div>
                            <h2>Account Information</h2>
                            <p>Account configuration</p>
                        </div>
                    </div>

                    <div className="admin-account-info-list">
                        <div className="admin-account-info-item">
                            <span className="admin-account-info-label">
                                Account Number
                            </span>

                            <span className="admin-account-info-value admin-account-number">
                                {account.accountNumber}
                            </span>
                        </div>

                        <div className="admin-account-info-item">
                            <span className="admin-account-info-label">
                                Account Type
                            </span>

                            <span className="admin-account-info-value">
                                {account.accountType}
                            </span>
                        </div>

                        <div className="admin-account-info-item">
                            <span className="admin-account-info-label">
                                Current Status
                            </span>

                            <span
                                className={`admin-account-inline-status ${getStatusClass(
                                    account.status
                                )}`}
                            >
                                {account.status}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="admin-account-details-card">
                    <div className="admin-account-card-header">
                        <div className="admin-account-card-icon">
                            <Clock3
                                size={19}
                                strokeWidth={1.9}
                            />
                        </div>

                        <div>
                            <h2>Record Information</h2>
                            <p>Account timeline</p>
                        </div>
                    </div>

                    <div className="admin-account-info-list">
                        <div className="admin-account-info-item">
                            <span className="admin-account-info-label">
                                Created
                            </span>

                            <span className="admin-account-info-value">
                                {formatDateTime(account.createdAt)}
                            </span>
                        </div>

                        <div className="admin-account-info-item">
                            <span className="admin-account-info-label">
                                Last Updated
                            </span>

                            <span className="admin-account-info-value">
                                {formatDateTime(account.updatedAt)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="admin-account-management-section">

                <div className="admin-account-management-card">
                    <div className="admin-account-management-header">
                        <div className="admin-account-management-icon">
                            <ShieldCheck
                                size={19}
                                strokeWidth={1.9}
                            />
                        </div>

                        <div>
                            <h2>Account Status</h2>
                            <p>
                                Manage the operational status of this account.
                            </p>
                        </div>
                    </div>

                    <div className="admin-account-status-management">
                        <div className="admin-account-status-selector">
                            <label htmlFor="account-status">
                                Account Status
                            </label>

                            <select
                                id="account-status"
                                value={selectedStatus}
                                onChange={handleStatusChange}
                                disabled={
                                    updatingStatus ||
                                    account.status === "CLOSED"
                                }
                            >
                                {availableStatuses.map((status) => (
                                    <option
                                        key={status}
                                        value={status}
                                    >
                                        {status}
                                    </option>
                                ))}
                            </select>

                            <p>
                                {getStatusDescription(account.status)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="admin-account-management-card">
                    <div className="admin-account-management-header">
                        <div className="admin-account-management-icon deposit-icon">
                            <span className="admin-account-rupee-icon">
                                ₹
                            </span>
                        </div>

                        <div>
                            <h2>Deposit Funds</h2>
                            <p>
                                Deposit funds directly into this account.
                            </p>
                        </div>
                    </div>

                    <form
                        className="admin-account-deposit-form"
                        onSubmit={handleDepositSubmit}
                    >
                        <div className="admin-account-form-row">

                            <div className="admin-account-form-group">
                                <label htmlFor="deposit-amount">
                                    Amount
                                </label>

                                <div className="admin-account-input-wrapper">
                                    <span>₹</span>

                                    <input
                                        id="deposit-amount"
                                        type="number"
                                        min="1000"
                                        step="0.01"
                                        value={depositAmount}
                                        onChange={(event) =>
                                            setDepositAmount(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Enter amount"
                                        disabled={
                                            depositing ||
                                            account.status !== "ACTIVE"
                                        }
                                    />
                                </div>

                                <small>
                                    Minimum deposit: ₹1,000.00
                                </small>
                            </div>

                            <div className="admin-account-form-group">
                                <label htmlFor="deposit-description">
                                    Description
                                </label>

                                <input
                                    id="deposit-description"
                                    type="text"
                                    value={depositDescription}
                                    onChange={(event) =>
                                        setDepositDescription(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Optional description"
                                    maxLength={200}
                                    disabled={
                                        depositing ||
                                        account.status !== "ACTIVE"
                                    }
                                />

                                <small>
                                    Maximum 200 characters
                                </small>
                            </div>
                        </div>

                        <div className="admin-account-deposit-footer">
                            {account.status !== "ACTIVE" && (
                                <p className="admin-account-deposit-warning">
                                    <AlertCircle
                                        size={16}
                                        strokeWidth={1.8}
                                    />
                                    Deposits are available only for ACTIVE
                                    accounts.
                                </p>
                            )}

                            <button
                                type="submit"
                                className="admin-account-deposit-button"
                                disabled={
                                    depositing ||
                                    account.status !== "ACTIVE"
                                }
                            >
                                <span className="admin-account-button-rupee">
                                    ₹
                                </span>
                                Deposit Funds
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {showStatusConfirmation && (
                <div
                    className="admin-account-modal-overlay"
                    onMouseDown={(event) => {
                        if (
                            event.target === event.currentTarget &&
                            !updatingStatus
                        ) {
                            cancelStatusChange();
                        }
                    }}
                >
                    <div
                        className="admin-account-confirmation-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="account-status-confirmation-title"
                    >
                        <div className="admin-account-modal-icon">
                            <ShieldCheck
                                size={23}
                                strokeWidth={1.8}
                            />
                        </div>

                        <h2 id="account-status-confirmation-title">
                            Change Account Status?
                        </h2>

                        <p>
                            You are changing this account from{" "}
                            <strong>{account.status}</strong> to{" "}
                            <strong>{selectedStatus}</strong>.
                        </p>

                        <p className="admin-account-modal-warning">
                            This action will affect the customer's ability
                            to perform banking operations.
                        </p>

                        <div className="admin-account-modal-actions">
                            <button
                                type="button"
                                className="admin-account-modal-cancel"
                                onClick={cancelStatusChange}
                                disabled={updatingStatus}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="admin-account-modal-confirm"
                                onClick={handleStatusUpdate}
                                disabled={updatingStatus}
                            >
                                {updatingStatus
                                    ? "Updating..."
                                    : "Confirm Change"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showDepositConfirmation && (
                <div
                    className="admin-account-modal-overlay"
                    onMouseDown={(event) => {
                        if (
                            event.target === event.currentTarget &&
                            !depositing
                        ) {
                            cancelDeposit();
                        }
                    }}
                >
                    <div
                        className="admin-account-confirmation-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="deposit-confirmation-title"
                    >
                        <div className="admin-account-modal-icon deposit-modal-icon">
                            <span className="admin-account-rupee-icon">
                                ₹
                            </span>
                        </div>

                        <h2 id="deposit-confirmation-title">
                            Confirm Deposit
                        </h2>

                        <p>
                            You are about to deposit{" "}
                            <strong>
                                {formatCurrency(depositAmount)}
                            </strong>{" "}
                            into account{" "}
                            <strong>{account.accountNumber}</strong>.
                        </p>

                        {depositDescription.trim() && (
                            <div className="admin-account-deposit-summary">
                                <span>Description</span>
                                <strong>
                                    {depositDescription.trim()}
                                </strong>
                            </div>
                        )}

                        <p className="admin-account-modal-warning">
                            This will create a successful DEPOSIT transaction
                            for the account.
                        </p>

                        <div className="admin-account-modal-actions">
                            <button
                                type="button"
                                className="admin-account-modal-cancel"
                                onClick={cancelDeposit}
                                disabled={depositing}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="admin-account-modal-confirm deposit-confirm-button"
                                onClick={handleDeposit}
                                disabled={depositing}
                            >
                                {depositing
                                    ? "Processing..."
                                    : "Confirm Deposit"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

export default AdminAccountDetails;