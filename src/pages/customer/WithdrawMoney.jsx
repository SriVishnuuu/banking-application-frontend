import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    CircleAlert,
    LoaderCircle,
    ShieldCheck,
    X,
} from "lucide-react";

import accountApi from "../../api/accountApi";
import transactionApi from "../../api/transactionApi";
import "../../css/WithdrawMoney.css";
import LoadingScreen from "../../components/common/LoadingScreen";

const EMPTY_FIELD_ERRORS = {
    accountNumber: "",
    amount: "",
    description: "",
};

function WithdrawMoney() {
    const navigate = useNavigate();

    const [accounts, setAccounts] = useState([]);
    const [accountNumber, setAccountNumber] = useState("");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [initialLoadError, setInitialLoadError] = useState("");
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState(EMPTY_FIELD_ERRORS);
    const [success, setSuccess] = useState("");
    const [showConfirmation, setShowConfirmation] = useState(false);

    const loadAccounts = useCallback(async () => {
        try {
            setLoading(true);
            setInitialLoadError("");

            const response = await accountApi.getMyAccounts();

            const activeAccounts = response.data.filter(
                (account) => account.status === "ACTIVE"
            );

            setAccounts(activeAccounts);
        } catch (requestError) {
            console.error(requestError);

            setInitialLoadError(
                requestError.response?.data?.message ||
                    "Unable to load withdrawal details."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            loadAccounts();
        }, 0);

        return () => {
            clearTimeout(timer);
        };
    }, [loadAccounts]);

    const handleRetry = () => {
        setError("");
        setFieldErrors({ ...EMPTY_FIELD_ERRORS });
        setSuccess("");
        loadAccounts();
    };

    const getAccountDisplayNumber = (number) => {
        if (!number) {
            return "";
        }

        if (number.length <= 4) {
            return number;
        }

        return `•••• ${number.slice(-4)}`;
    };

    const selectedAccount = accounts.find(
        (account) => account.accountNumber === accountNumber
    );

    const formatCurrency = (value) => {
        const numericValue = Number(value);

        return `₹ ${(
            Number.isFinite(numericValue) ? numericValue : 0
        ).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    const handleFieldChange = (field, value) => {
        if (field === "accountNumber") {
            setAccountNumber(value);
        } else if (field === "amount") {
            setAmount(value);
        } else if (field === "description") {
            setDescription(value);
        }

        setFieldErrors((previousErrors) => ({
            ...previousErrors,
            [field]: "",
        }));

        setError("");
        setSuccess("");
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        const errors = { ...EMPTY_FIELD_ERRORS };

        if (!accountNumber) {
            errors.accountNumber = "Please select an account.";
        }

        const trimmedAmount = amount.trim();
        const numericAmount = Number(trimmedAmount);

        if (!trimmedAmount) {
            errors.amount = "Please enter the withdrawal amount.";
        } else if (
            !/^\d+(\.\d{1,2})?$/.test(trimmedAmount) ||
            !Number.isFinite(numericAmount)
        ) {
            errors.amount =
                "Enter a valid amount with up to two decimal places.";
        } else if (numericAmount < 500) {
            errors.amount = "Minimum withdrawal amount is ₹500.";
        }

        if (description.length > 200) {
            errors.description =
                "Description cannot exceed 200 characters.";
        }

        setFieldErrors(errors);

        const hasErrors = Object.values(errors).some(Boolean);

        if (hasErrors) {
            setShowConfirmation(false);
            return;
        }

        setShowConfirmation(true);
    };

    const closeConfirmation = () => {
        if (!submitting) {
            setShowConfirmation(false);
        }
    };

    useEffect(() => {
        if (!showConfirmation) {
            return undefined;
        }

        const handleKeyDown = (event) => {
            if (event.key === "Escape" && !submitting) {
                setShowConfirmation(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [showConfirmation, submitting]);

    const confirmWithdrawal = async () => {
        if (submitting) {
            return;
        }

        setError("");
        setFieldErrors({ ...EMPTY_FIELD_ERRORS });

        try {
            setSubmitting(true);

            const response = await transactionApi.withdrawMoney({
                accountNumber,
                amount: Number(amount),
                description: description.trim(),
            });

            setShowConfirmation(false);
            setSuccess("Withdrawal completed successfully.");

            setAccountNumber("");
            setAmount("");
            setDescription("");

            const transactionReference =
                response.data.transactionReference;

            setTimeout(() => {
                navigate(
                    `/customer/transactions/${transactionReference}`
                );
            }, 1000);
        } catch (requestError) {
            console.error(requestError);

            const responseData = requestError.response?.data;
            const backendFieldErrors = responseData?.fieldErrors;

            setShowConfirmation(false);

            if (
                backendFieldErrors &&
                typeof backendFieldErrors === "object"
            ) {
                setFieldErrors({
                    ...EMPTY_FIELD_ERRORS,
                    ...backendFieldErrors,
                });

                setError("");
            } else {
                setFieldErrors({ ...EMPTY_FIELD_ERRORS });

                setError(
                    responseData?.message ||
                        "Unable to complete withdrawal."
                );
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
            return (
                <LoadingScreen message="Safe and Secure Withdrawals..." />
            );
        }

    if (initialLoadError) {
        return (
            <div className="withdraw-page">
                <div className="withdraw-error-card">
                    <div className="withdraw-error-icon">!</div>

                    <h2>Unable to load withdrawal</h2>

                    <p>{initialLoadError}</p>

                    <button
                        type="button"
                        className="withdraw-error-button"
                        onClick={handleRetry}
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "Try Again"}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="withdraw-page">
            <section className="withdraw-header">
                <div>
                    <p className="withdraw-eyebrow">
                        CASH WITHDRAWAL
                    </p>

                    <h1>Withdraw Money</h1>

                    <p>
                        Withdraw money securely from your active bank
                        account.
                    </p>
                </div>

                <Link
                    to="/customer/transactions"
                    className="withdraw-back-button"
                >
                    Back to Transactions
                </Link>
            </section>

            {error && (
                <div className="withdraw-operation-error" role="alert">
                    <span className="operation-error-icon">!</span>

                    <div>
                        <strong>
                            Unable to complete withdrawal
                        </strong>

                        <p>{error}</p>
                    </div>
                </div>
            )}

            {success && (
                <div className="withdraw-success" role="status">
                    <span className="withdraw-success-icon">✓</span>
                    <span>{success}</span>
                </div>
            )}

            {accounts.length === 0 && (
                <div className="withdraw-operation-error">
                    <span className="operation-error-icon">!</span>

                    <div>
                        <strong>No active accounts</strong>

                        <p>
                            You need an active account to withdraw money.
                        </p>
                    </div>
                </div>
            )}

            <div className="withdraw-content">
                <section className="withdraw-form-card">
                    <div className="withdraw-card-header">
                        <p className="withdraw-section-eyebrow">
                            NEW WITHDRAWAL
                        </p>

                        <h2>Withdrawal Details</h2>

                        <p>
                            Select your account and enter the amount you
                            want to withdraw.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="withdraw-field">
                            <label htmlFor="accountNumber">
                                From Account
                            </label>

                            <select
                                id="accountNumber"
                                value={accountNumber}
                                onChange={(event) =>
                                    handleFieldChange(
                                        "accountNumber",
                                        event.target.value
                                    )
                                }
                                disabled={submitting}
                                className={
                                    fieldErrors.accountNumber
                                        ? "field-invalid"
                                        : ""
                                }
                                aria-invalid={Boolean(
                                    fieldErrors.accountNumber
                                )}
                                aria-describedby={
                                    fieldErrors.accountNumber
                                        ? "accountNumber-error"
                                        : undefined
                                }
                            >
                                <option value="">Select account</option>

                                {accounts.map((account) => (
                                    <option
                                        key={account.accountNumber}
                                        value={account.accountNumber}
                                    >
                                        {account.accountType} —{" "}
                                        {getAccountDisplayNumber(
                                            account.accountNumber
                                        )}
                                    </option>
                                ))}
                            </select>

                            {fieldErrors.accountNumber && (
                                <p
                                    id="accountNumber-error"
                                    className="field-error"
                                >
                                    {fieldErrors.accountNumber}
                                </p>
                            )}
                        </div>

                        <div className="withdraw-field">
                            <label htmlFor="withdrawAmount">
                                Withdrawal Amount
                            </label>

                            <div
                                className={`withdraw-amount-wrapper ${
                                    fieldErrors.amount
                                        ? "field-invalid"
                                        : ""
                                }`}
                            >
                                <span className="currency-symbol">₹</span>

                                <input
                                    id="withdrawAmount"
                                    type="number"
                                    min="500"
                                    step="0.01"
                                    value={amount}
                                    onChange={(event) =>
                                        handleFieldChange(
                                            "amount",
                                            event.target.value
                                        )
                                    }
                                    placeholder="500.00"
                                    disabled={submitting}
                                    aria-invalid={Boolean(
                                        fieldErrors.amount
                                    )}
                                    aria-describedby={
                                        fieldErrors.amount
                                            ? "withdrawAmount-error"
                                            : "withdrawAmount-hint"
                                    }
                                />
                            </div>

                            <p
                                id="withdrawAmount-hint"
                                className="withdraw-field-hint"
                            >
                                Minimum withdrawal amount is ₹500.
                            </p>

                            {fieldErrors.amount && (
                                <p
                                    id="withdrawAmount-error"
                                    className="field-error"
                                >
                                    {fieldErrors.amount}
                                </p>
                            )}
                        </div>

                        <div className="withdraw-field">
                            <label htmlFor="withdrawDescription">
                                Description
                                <span className="optional-label">
                                    Optional
                                </span>
                            </label>

                            <textarea
                                id="withdrawDescription"
                                value={description}
                                onChange={(event) =>
                                    handleFieldChange(
                                        "description",
                                        event.target.value
                                    )
                                }
                                placeholder="Enter a description"
                                maxLength={200}
                                rows={4}
                                disabled={submitting}
                                className={
                                    fieldErrors.description
                                        ? "field-invalid"
                                        : ""
                                }
                                aria-invalid={Boolean(
                                    fieldErrors.description
                                )}
                                aria-describedby={
                                    fieldErrors.description
                                        ? "withdrawDescription-error"
                                        : undefined
                                }
                            />

                            <div className="description-footer">
                                <span>
                                    Add a note for this withdrawal.
                                </span>

                                <span>{description.length}/200</span>
                            </div>

                            {fieldErrors.description && (
                                <p
                                    id="withdrawDescription-error"
                                    className="field-error"
                                >
                                    {fieldErrors.description}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="withdraw-submit-button"
                            disabled={
                                submitting || accounts.length === 0
                            }
                        >
                            Withdraw
                        </button>
                    </form>
                </section>

                <aside className="withdraw-summary-card">
                    <div className="withdraw-card-header">
                        <p className="withdraw-section-eyebrow">
                            WITHDRAWAL SUMMARY
                        </p>

                        <h2>Review Details</h2>
                    </div>

                    <div className="withdraw-summary-details">
                        <div className="withdraw-summary-item">
                            <span>From Account</span>

                            <strong>
                                {selectedAccount
                                    ? `${
                                          selectedAccount.accountType
                                      } — ${getAccountDisplayNumber(
                                          selectedAccount.accountNumber
                                      )}`
                                    : "Not selected"}
                            </strong>
                        </div>

                        <div className="withdraw-summary-divider" />

                        <div className="withdraw-summary-amount">
                            <span>Withdrawal Amount</span>

                            <strong>{formatCurrency(amount)}</strong>
                        </div>
                    </div>

                    <div className="withdraw-security-note">
                        <span className="security-icon">✓</span>

                        <p>
                            Your withdrawal will be processed securely
                            after confirmation.
                        </p>
                    </div>
                </aside>
            </div>

            {showConfirmation && (
                <div
                    className="withdraw-confirmation-overlay"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            closeConfirmation();
                        }
                    }}
                >
                    <section
                        className="withdraw-confirmation-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="withdraw-confirmation-title"
                        aria-describedby="withdraw-confirmation-description"
                    >
                        <button
                            type="button"
                            className="withdraw-confirmation-close"
                            onClick={closeConfirmation}
                            disabled={submitting}
                            aria-label="Close confirmation"
                        >
                            <X size={20} />
                        </button>

                        <div className="withdraw-confirmation-icon">
                            <ShieldCheck size={30} />
                        </div>

                        <p className="withdraw-confirmation-eyebrow">
                            REVIEW YOUR TRANSACTION
                        </p>

                        <h2 id="withdraw-confirmation-title">
                            Confirm Withdrawal
                        </h2>

                        <p id="withdraw-confirmation-description">
                            Review the details carefully before withdrawing
                            money from your account.
                        </p>

                        <div className="withdraw-confirmation-details">
                            <div className="withdraw-confirmation-row">
                                <span>From Account</span>

                                <strong>
                                    {selectedAccount?.accountType ||
                                        "Bank Account"}
                                </strong>
                            </div>

                            <div className="withdraw-confirmation-row">
                                <span>Account Number</span>

                                <strong>
                                    {getAccountDisplayNumber(
                                        selectedAccount?.accountNumber
                                    )}
                                </strong>
                            </div>

                            <div className="withdraw-confirmation-row withdraw-confirmation-amount">
                                <span>Withdrawal Amount</span>

                                <strong>{formatCurrency(amount)}</strong>
                            </div>

                            {description.trim() && (
                                <div className="withdraw-confirmation-row">
                                    <span>Description</span>

                                    <strong className="withdraw-confirmation-description-value">
                                        {description.trim()}
                                    </strong>
                                </div>
                            )}
                        </div>

                        <div className="withdraw-confirmation-notice">
                            <CircleAlert size={18} />

                            <p>
                                Verify the account and amount. Confirming
                                will submit your withdrawal request.
                            </p>
                        </div>

                        <div className="withdraw-confirmation-actions">
                            <button
                                type="button"
                                className="withdraw-confirmation-cancel"
                                onClick={closeConfirmation}
                                disabled={submitting}
                            >
                                Go Back
                            </button>

                            <button
                                type="button"
                                className="withdraw-confirmation-confirm"
                                onClick={confirmWithdrawal}
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <>
                                        <LoaderCircle
                                            size={18}
                                            className="withdraw-confirmation-spinner"
                                        />
                                        Processing...
                                    </>
                                ) : (
                                    "Confirm Withdrawal"
                                )}
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
}

export default WithdrawMoney;