import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    CircleAlert,
    LoaderCircle,
    ShieldCheck,
    X
} from "lucide-react";

import accountApi from "../../api/accountApi";
import beneficiaryApi from "../../api/beneficiaryApi";
import transactionApi from "../../api/transactionApi";

import "../../css/TransferMoney.css";
import LoadingScreen from "../../components/common/LoadingScreen";

function TransferMoney() {
    const navigate = useNavigate();

    const [accounts, setAccounts] = useState([]);
    const [beneficiaries, setBeneficiaries] = useState([]);

    const [transferType, setTransferType] = useState("BENEFICIARY");

    const [sourceAccountNumber, setSourceAccountNumber] = useState("");
    const [beneficiaryId, setBeneficiaryId] = useState("");
    const [destinationAccountNumber, setDestinationAccountNumber] =
        useState("");

    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [initialLoadError, setInitialLoadError] = useState("");
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [success, setSuccess] = useState("");

    const [showConfirmation, setShowConfirmation] = useState(false);

    const loadTransferData = async () => {
        try {
            setLoading(true);
            setInitialLoadError("");

            const [
                accountsResponse,
                beneficiariesResponse
            ] = await Promise.all([
                accountApi.getMyAccounts(),
                beneficiaryApi.getMyBeneficiaries()
            ]);

            const activeAccounts = accountsResponse.data.filter(
                (account) => account.status === "ACTIVE"
            );

            const activeBeneficiaries =
                beneficiariesResponse.data.filter(
                    (beneficiary) => beneficiary.status === "ACTIVE"
                );

            setAccounts(activeAccounts);
            setBeneficiaries(activeBeneficiaries);
        } catch (requestError) {
            console.error(requestError);

            setInitialLoadError(
                requestError.response?.data?.message ||
                "Unable to load transfer details."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let cancelled = false;

        const fetchData = async () => {
            try {
                const [
                    accountsResponse,
                    beneficiariesResponse
                ] = await Promise.all([
                    accountApi.getMyAccounts(),
                    beneficiaryApi.getMyBeneficiaries()
                ]);

                if (cancelled) {
                    return;
                }

                setAccounts(
                    accountsResponse.data.filter(
                        (account) => account.status === "ACTIVE"
                    )
                );

                setBeneficiaries(
                    beneficiariesResponse.data.filter(
                        (beneficiary) =>
                            beneficiary.status === "ACTIVE"
                    )
                );
            } catch (requestError) {
                if (!cancelled) {
                    console.error(requestError);

                    setInitialLoadError(
                        requestError.response?.data?.message ||
                        "Unable to load transfer details."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            cancelled = true;
        };
    }, []);

    const handleRetry = () => {
        setError("");
        setFieldErrors({});
        setSuccess("");
        loadTransferData();
    };

    const getAccountDisplayNumber = (accountNumber) => {
        if (!accountNumber) {
            return "";
        }

        if (accountNumber.length <= 4) {
            return accountNumber;
        }

        return `•••• ${accountNumber.slice(-4)}`;
    };

    const getBeneficiaryName = (beneficiary) => {
        return (
            beneficiary.nickName ||
            beneficiary.name ||
            "Beneficiary"
        );
    };

    const formatCurrency = (value) => {
        if (!value) {
            return "₹ 0.00";
        }

        return `₹ ${Number(value).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    const selectedAccount = accounts.find(
        (account) =>
            account.accountNumber === sourceAccountNumber
    );

    const selectedBeneficiary = beneficiaries.find(
        (beneficiary) =>
            String(beneficiary.id) === String(beneficiaryId)
    );

    const selectedDestinationAccount = accounts.find(
        (account) =>
            account.accountNumber === destinationAccountNumber
    );

    const destinationAccounts = accounts.filter(
        (account) =>
            account.accountNumber !== sourceAccountNumber
    );

    const clearFieldError = (fieldName) => {
        setFieldErrors((previousErrors) => {
            const updatedErrors = { ...previousErrors };
            delete updatedErrors[fieldName];
            return updatedErrors;
        });
    };

    const handleTransferTypeChange = (type) => {
        setTransferType(type);

        setError("");
        setFieldErrors({});
        setSuccess("");
        setBeneficiaryId("");
        setDestinationAccountNumber("");
        setShowConfirmation(false);
    };

    const handleSourceAccountChange = (value) => {
        setSourceAccountNumber(value);

        setError("");
        clearFieldError("sourceAccountNumber");

        if (value === destinationAccountNumber) {
            setDestinationAccountNumber("");
        }
    };

    const handleBeneficiaryChange = (value) => {
        setBeneficiaryId(value);

        setError("");
        clearFieldError("beneficiaryId");
    };

    const handleDestinationAccountChange = (value) => {
        setDestinationAccountNumber(value);

        setError("");
        clearFieldError("destinationAccountNumber");
    };

    const handleAmountChange = (value) => {
        setAmount(value);

        setError("");
        clearFieldError("amount");
    };

    const handleDescriptionChange = (value) => {
        setDescription(value);

        clearFieldError("description");
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        setError("");
        setFieldErrors({});
        setSuccess("");

        const validationErrors = {};

        if (!sourceAccountNumber) {
            validationErrors.sourceAccountNumber =
                "Please select a source account.";
        }

        if (
            transferType === "BENEFICIARY" &&
            !beneficiaryId
        ) {
            validationErrors.beneficiaryId =
                "Please select a beneficiary.";
        }

        if (
            transferType === "SELF" &&
            !destinationAccountNumber
        ) {
            validationErrors.destinationAccountNumber =
                "Please select a destination account.";
        }

        if (!amount || Number(amount) <= 0) {
            validationErrors.amount =
                "Please enter an amount greater than zero.";
        }

        if (Object.keys(validationErrors).length > 0) {
            setFieldErrors(validationErrors);
            return;
        }

        setShowConfirmation(true);
    };

    const confirmTransfer = async () => {
        if (submitting) {
            return;
        }

        setError("");
        setFieldErrors({});

        try {
            setSubmitting(true);

            let response;

            if (transferType === "BENEFICIARY") {
                response = await transactionApi.transferMoney({
                    sourceAccountNumber,
                    beneficiaryId: Number(beneficiaryId),
                    amount: Number(amount),
                    description
                });
            } else {
                response = await transactionApi.selfTransferMoney({
                    sourceAccountNumber,
                    destinationAccountNumber,
                    amount: Number(amount),
                    description
                });
            }

            setShowConfirmation(false);
            setSuccess("Transfer completed successfully.");

            setSourceAccountNumber("");
            setBeneficiaryId("");
            setDestinationAccountNumber("");
            setAmount("");
            setDescription("");

            setTimeout(() => {
                navigate(
                    `/customer/transactions/${response.data.transactionReference}`
                );
            }, 1000);
        } catch (requestError) {
            console.error(requestError);

            const responseData = requestError.response?.data;

            if (responseData?.fieldErrors) {
                setFieldErrors(responseData.fieldErrors);
                setError("");
            } else {
                setFieldErrors({});

                setError(
                    responseData?.message ||
                    "Unable to complete transfer."
                );
            }

            setShowConfirmation(false);
        } finally {
            setSubmitting(false);
        }
    };

   if (loading) {
            return (
                <LoadingScreen message="Safe and Secure Transfers..." />
            );
        }

    if (initialLoadError) {
        return (
            <div className="transfer-page">
                <div className="transfer-error-card">
                    <div className="transfer-error-icon">!</div>

                    <h2>Unable to load transfer</h2>

                    <p>{initialLoadError}</p>

                    <button
                        type="button"
                        className="transfer-error-button"
                        onClick={handleRetry}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="transfer-page">
            <section className="transfer-header">
                <div>
                    <p className="transfer-eyebrow">
                        MONEY TRANSFER
                    </p>

                    <h1>Transfer Money</h1>

                    <p>
                        Send money securely to a beneficiary
                        or between your own accounts.
                    </p>
                </div>

                <Link
                    to="/customer/transactions"
                    className="transfer-back-button"
                >
                    Back to Transactions
                </Link>
            </section>

            {error && (
                <div className="transfer-operation-error">
                    <span className="operation-error-icon">!</span>

                    <div>
                        <strong>Unable to complete transfer</strong>
                        <p>{error}</p>
                    </div>
                </div>
            )}

            {success && (
                <div className="transfer-success">
                    <span className="transfer-success-icon">✓</span>
                    <span>{success}</span>
                </div>
            )}

            <div className="transfer-content">
                <section className="transfer-form-card">
                    <div className="transfer-card-header">
                        <p className="transfer-section-eyebrow">
                            NEW TRANSFER
                        </p>

                        <h2>Transfer Details</h2>

                        <p>
                            Choose how you want to transfer
                            your money, then enter the details.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        
                        <div className="transfer-field">
                            <label>Transfer Type</label>

                            <div className="transfer-type-options">
                                <label
                                    className={
                                        transferType === "BENEFICIARY"
                                            ? "transfer-type-option selected"
                                            : "transfer-type-option"
                                    }
                                >
                                    <input
                                        type="radio"
                                        name="transferType"
                                        value="BENEFICIARY"
                                        checked={
                                            transferType === "BENEFICIARY"
                                        }
                                        onChange={() =>
                                            handleTransferTypeChange(
                                                "BENEFICIARY"
                                            )
                                        }
                                        disabled={submitting}
                                    />

                                    <span>To Beneficiary</span>
                                </label>

                                <label
                                    className={
                                        transferType === "SELF"
                                            ? "transfer-type-option selected"
                                            : "transfer-type-option"
                                    }
                                >
                                    <input
                                        type="radio"
                                        name="transferType"
                                        value="SELF"
                                        checked={transferType === "SELF"}
                                        onChange={() =>
                                            handleTransferTypeChange("SELF")
                                        }
                                        disabled={submitting}
                                    />

                                    <span>Self Transfer</span>
                                </label>
                            </div>
                        </div>

                    
                        <div className="transfer-field">
                            <label htmlFor="sourceAccount">
                                From Account
                            </label>

                            <select
                                id="sourceAccount"
                                value={sourceAccountNumber}
                                onChange={(event) =>
                                    handleSourceAccountChange(
                                        event.target.value
                                    )
                                }
                                disabled={submitting}
                                className={
                                    fieldErrors.sourceAccountNumber
                                        ? "field-invalid"
                                        : ""
                                }
                            >
                                <option value="">
                                    Select source account
                                </option>

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

                            {fieldErrors.sourceAccountNumber && (
                                <p className="field-error">
                                    {fieldErrors.sourceAccountNumber}
                                </p>
                            )}
                        </div>

                    
                        {transferType === "BENEFICIARY" && (
                            <div className="transfer-field">
                                <label htmlFor="beneficiary">
                                    Beneficiary
                                </label>

                                <select
                                    id="beneficiary"
                                    value={beneficiaryId}
                                    onChange={(event) =>
                                        handleBeneficiaryChange(
                                            event.target.value
                                        )
                                    }
                                    disabled={submitting}
                                    className={
                                        fieldErrors.beneficiaryId
                                            ? "field-invalid"
                                            : ""
                                    }
                                    aria-invalid={
                                        Boolean(fieldErrors.beneficiaryId)
                                    }
                                    aria-describedby={
                                        fieldErrors.beneficiaryId
                                            ? "beneficiary-error"
                                            : undefined
                                    }
                                >
                                    <option value="">
                                        Select beneficiary
                                    </option>

                                    {beneficiaries.map((beneficiary) => (
                                        <option
                                            key={beneficiary.id}
                                            value={beneficiary.id}
                                        >
                                            {getBeneficiaryName(beneficiary)}{" "}
                                            —{" "}
                                            {getAccountDisplayNumber(
                                                beneficiary.accountNumber
                                            )}
                                        </option>
                                    ))}
                                </select>

                                {fieldErrors.beneficiaryId && (
                                    <p
                                        id="beneficiary-error"
                                        className="field-error"
                                        role="alert"
                                    >
                                        {fieldErrors.beneficiaryId}
                                    </p>
                                )}

                                {beneficiaries.length === 0 && (
                                    <p className="transfer-field-hint">
                                        No active beneficiaries available.{" "}
                                        <Link to="/customer/beneficiaries">
                                            Add a beneficiary
                                        </Link>
                                    </p>
                                )}
                            </div>
                        )}

                       
                        {transferType === "SELF" && (
                            <div className="transfer-field">
                                <label htmlFor="destinationAccount">
                                    To Account
                                </label>

                                <select
                                    id="destinationAccount"
                                    value={destinationAccountNumber}
                                    onChange={(event) =>
                                        handleDestinationAccountChange(
                                            event.target.value
                                        )
                                    }
                                    disabled={
                                        submitting || !sourceAccountNumber
                                    }
                                    className={
                                        fieldErrors.destinationAccountNumber
                                            ? "field-invalid"
                                            : ""
                                    }
                                >
                                    <option value="">
                                        Select destination account
                                    </option>

                                    {destinationAccounts.map((account) => (
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

                                {fieldErrors.destinationAccountNumber && (
                                    <p className="field-error">
                                        {
                                            fieldErrors.destinationAccountNumber
                                        }
                                    </p>
                                )}

                                {accounts.length < 2 && (
                                    <p className="transfer-field-hint">
                                        You need at least two active accounts
                                        to transfer between your own accounts.
                                    </p>
                                )}
                            </div>
                        )}

                      
                        <div className="transfer-field">
                            <label htmlFor="amount">
                                Transfer Amount
                            </label>

                            <div
                                className={`amount-input-wrapper ${
                                    fieldErrors.amount ? "field-invalid" : ""
                                }`}
                            >
                                <span className="currency-symbol">₹</span>

                                <input
                                    id="amount"
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    value={amount}
                                    onChange={(event) =>
                                        handleAmountChange(
                                            event.target.value
                                        )
                                    }
                                    placeholder="0.00"
                                    disabled={submitting}
                                    aria-invalid={Boolean(fieldErrors.amount)}
                                />
                            </div>

                            {fieldErrors.amount && (
                                <p className="field-error">
                                    {fieldErrors.amount}
                                </p>
                            )}
                        </div>

                        
                        <div className="transfer-field">
                            <label htmlFor="description">
                                Description
                                <span className="optional-label">
                                    Optional
                                </span>
                            </label>

                            <textarea
                                id="description"
                                value={description}
                                onChange={(event) =>
                                    handleDescriptionChange(
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
                            />

                            <div className="description-footer">
                                <span>Add a note for this transfer.</span>
                                <span>{description.length}/200</span>
                            </div>

                            {fieldErrors.description && (
                                <p className="field-error">
                                    {fieldErrors.description}
                                </p>
                            )}
                        </div>

                     
                        <button
                            type="submit"
                            className="transfer-submit-button"
                            disabled={
                                submitting ||
                                accounts.length === 0 ||
                                (
                                    transferType === "SELF" &&
                                    accounts.length < 2
                                )
                            }
                        >
                            Transfer
                        </button>
                    </form>
                </section>

              
                <aside className="transfer-summary-card">
                    <div className="transfer-card-header">
                        <p className="transfer-section-eyebrow">
                            TRANSFER SUMMARY
                        </p>

                        <h2>Review Details</h2>
                    </div>

                    <div className="summary-details">
                        <div className="summary-item">
                            <span>From</span>

                            <strong>
                                {selectedAccount
                                    ? `${selectedAccount.accountType} — ${getAccountDisplayNumber(
                                        selectedAccount.accountNumber
                                    )}`
                                    : "Not selected"}
                            </strong>
                        </div>

                        <div className="summary-item">
                            <span>
                                {transferType === "BENEFICIARY"
                                    ? "Beneficiary"
                                    : "To Account"}
                            </span>

                            <strong>
                                {transferType === "BENEFICIARY"
                                    ? selectedBeneficiary
                                        ? getBeneficiaryName(
                                            selectedBeneficiary
                                        )
                                        : "Not selected"
                                    : selectedDestinationAccount
                                        ? `${selectedDestinationAccount.accountType} — ${getAccountDisplayNumber(
                                            selectedDestinationAccount.accountNumber
                                        )}`
                                        : "Not selected"}
                            </strong>
                        </div>

                        <div className="summary-divider" />

                        <div className="summary-amount">
                            <span>Transfer Amount</span>
                            <strong>{formatCurrency(amount)}</strong>
                        </div>
                    </div>

                    <div className="transfer-security-note">
                        <span className="security-icon">✓</span>

                        <p>
                            Your transfer will be processed securely
                            after confirmation.
                        </p>
                    </div>
                </aside>
            </div>

            {showConfirmation && (
                <div
                    className="transfer-confirmation-overlay"
                    onMouseDown={(event) => {
                        if (
                            event.target === event.currentTarget &&
                            !submitting
                        ) {
                            setShowConfirmation(false);
                        }
                    }}
                >
                    <section
                        className="transfer-confirmation-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="transfer-confirmation-title"
                    >
                        <button
                            type="button"
                            className="transfer-confirmation-close"
                            aria-label="Close confirmation"
                            onClick={() => setShowConfirmation(false)}
                            disabled={submitting}
                        >
                            <X size={18} />
                        </button>

                        <div className="transfer-confirmation-icon">
                            <ShieldCheck size={23} />
                        </div>

                        <p className="transfer-confirmation-eyebrow">
                            SECURE TRANSACTION
                        </p>

                        <h2 id="transfer-confirmation-title">
                            Confirm your transfer
                        </h2>

                        <p className="transfer-confirmation-description">
                            Review the details below before confirming
                            this transfer.
                        </p>

                        <div className="transfer-confirmation-details">
                            <div>
                                <span>From account</span>

                                <strong>
                                    {selectedAccount
                                        ? `${selectedAccount.accountType} — ${getAccountDisplayNumber(
                                            selectedAccount.accountNumber
                                        )}`
                                        : "Not selected"}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    {transferType === "BENEFICIARY"
                                        ? "Beneficiary"
                                        : "To account"}
                                </span>

                                <strong>
                                    {transferType === "BENEFICIARY"
                                        ? selectedBeneficiary
                                            ? getBeneficiaryName(
                                                selectedBeneficiary
                                            )
                                            : "Not selected"
                                        : selectedDestinationAccount
                                            ? `${selectedDestinationAccount.accountType} — ${getAccountDisplayNumber(
                                                selectedDestinationAccount.accountNumber
                                            )}`
                                            : "Not selected"}
                                </strong>
                            </div>

                            {transferType === "BENEFICIARY" &&
                                selectedBeneficiary && (
                                    <div>
                                        <span>Recipient account</span>

                                        <strong>
                                            {getAccountDisplayNumber(
                                                selectedBeneficiary.accountNumber
                                            )}
                                        </strong>
                                    </div>
                                )}

                            <div>
                                <span>Transfer amount</span>

                                <strong className="transfer-confirmation-amount">
                                    {formatCurrency(amount)}
                                </strong>
                            </div>

                            {description.trim() && (
                                <div>
                                    <span>Description</span>
                                    <strong>{description.trim()}</strong>
                                </div>
                            )}
                        </div>

                        <div className="transfer-confirmation-notice">
                            <CircleAlert size={18} />

                            <p>
                                Verify the recipient and amount. Confirming
                                will submit this transfer for processing.
                            </p>
                        </div>

                        <div className="transfer-confirmation-actions">
                            <button
                                type="button"
                                className="transfer-confirmation-cancel"
                                onClick={() => setShowConfirmation(false)}
                                disabled={submitting}
                            >
                                Go Back
                            </button>

                            <button
                                type="button"
                                className="transfer-confirmation-confirm"
                                onClick={confirmTransfer}
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <>
                                        <LoaderCircle
                                            size={16}
                                            className="transfer-confirmation-spinner"
                                        />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <ShieldCheck size={16} />
                                        Confirm Transfer
                                    </>
                                )}
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
}

export default TransferMoney;