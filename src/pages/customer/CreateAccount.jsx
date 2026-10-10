
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    CheckCircle2,
    CircleAlert,
    LoaderCircle,
    ShieldCheck,
    X
} from "lucide-react";

import accountApi from "../../api/accountApi";
import "../../css/CreateAccount.css";
import LoadingScreen from "../../components/common/LoadingScreen";

const EMPTY_FIELD_ERRORS = {
    accountType: "",
    branchCode: ""
};

function CreateAccount() {
    const [accountTypes, setAccountTypes] = useState([]);
    const [branches, setBranches] = useState([]);

    const [accountType, setAccountType] = useState("");
    const [branchCode, setBranchCode] = useState("");

    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [fieldErrors, setFieldErrors] = useState(EMPTY_FIELD_ERRORS);

    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;

        const fetchOptions = async () => {
            try {
                const response = await accountApi.getAccountOptions();

                if (!isMounted) return;

                setAccountTypes(response.data.accountTypes);
                setBranches(response.data.branches);
            } catch (err) {
                console.error(err);

                if (isMounted) {
                    setError(
                        err.response?.data?.message ||
                        "Unable to load account creation options."
                    );
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchOptions();

        return () => {
            isMounted = false;
        };
    }, []);

    const clearFieldError = (field) => {
        setFieldErrors((previous) => ({
            ...previous,
            [field]: ""
        }));
    };

    const getBackendFieldErrors = (responseData) => {
        const backendErrors = responseData?.fieldErrors;

        if (
            !backendErrors ||
            typeof backendErrors !== "object" ||
            Array.isArray(backendErrors)
        ) {
            return null;
        }

        const errors = {
            accountType:
                typeof backendErrors.accountType === "string"
                    ? backendErrors.accountType
                    : "",
            branchCode:
                typeof backendErrors.branchCode === "string"
                    ? backendErrors.branchCode
                    : ""
        };

        return Object.values(errors).some(Boolean) ? errors : null;
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");
        setFieldErrors({ ...EMPTY_FIELD_ERRORS });

        const validationErrors = {
            accountType: accountType
                ? ""
                : "Please select an account type.",
            branchCode: branchCode
                ? ""
                : "Please select a branch."
        };

        setFieldErrors(validationErrors);

        if (Object.values(validationErrors).some(Boolean)) {
            return;
        }

        setShowConfirmation(true);
    };

    const handleCancelConfirmation = () => {
        if (creating) return;

        setShowConfirmation(false);
    };

    const handleConfirmCreate = async () => {
        if (creating || !accountType || !branchCode) return;

        setCreating(true);
        setError("");
        setSuccess("");
        setFieldErrors({ ...EMPTY_FIELD_ERRORS });

        try {
            const response = await accountApi.createAccount({
                accountType,
                branchCode
            });

            setShowConfirmation(false);

            setSuccess(
                `Account ${response.data.accountNumber} created successfully.`
            );

            setTimeout(() => {
                navigate("/customer/accounts");
            }, 1500);
        } catch (err) {
            console.error(err);

            const status = err.response?.status;
            const responseData = err.response?.data;

            if (status === 400) {
                const backendErrors = getBackendFieldErrors(responseData);

                if (backendErrors) {
                    setFieldErrors(backendErrors);
                    setShowConfirmation(false);
                    return;
                }
            }

            setShowConfirmation(false);
            setError(
                responseData?.message ||
                "Unable to create account. Please try again."
            );
        } finally {
            setCreating(false);
        }
    };

    useEffect(() => {
        if (!showConfirmation || creating) return undefined;

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setShowConfirmation(false);
            }
        };

        window.addEventListener("keydown", handleEscape);

        return () => {
            window.removeEventListener("keydown", handleEscape);
        };
    }, [showConfirmation, creating]);

    if (loading) {
        return (
            <LoadingScreen message="Create your Accounts..." />
        );
    }

    return (
        <div className="create-account-page">
            <section className="create-account-header">
                <div>
                    <p className="page-eyebrow">BANKING</p>
                    <h1>Open New Account</h1>
                    <p>
                        Choose an account type and your preferred
                        VISHNU BANK branch.
                    </p>
                </div>

                <Link
                    to="/customer/accounts"
                    className="back-link"
                >
                    ← Back to Accounts
                </Link>
            </section>

            <div className="create-account-layout">
                <section className="create-account-card">
                    <div className="form-card-heading">
                        <div className="form-icon">+</div>

                        <div>
                            <h2>Account Information</h2>
                            <p>Select the account you want to open.</p>
                        </div>
                    </div>

                    {error && (
                        <div
                            className="create-account-error"
                            role="alert"
                        >
                            {error}
                        </div>
                    )}

                    {success && (
                        <div
                            className="create-account-success"
                            role="status"
                        >
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="create-form-field">
                            <label htmlFor="accountType">
                                Account Type
                            </label>

                            <select
                                id="accountType"
                                value={accountType}
                                onChange={(event) => {
                                    setAccountType(event.target.value);
                                    clearFieldError("accountType");
                                    setError("");
                                }}
                                disabled={creating}
                                aria-invalid={Boolean(fieldErrors.accountType)}
                                aria-describedby={
                                    fieldErrors.accountType
                                        ? "accountType-error"
                                        : "accountType-help"
                                }
                                className={
                                    fieldErrors.accountType
                                        ? "field-invalid"
                                        : ""
                                }
                            >
                                <option value="">
                                    Select Account Type
                                </option>

                                {accountTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>

                            {fieldErrors.accountType ? (
                                <span
                                    id="accountType-error"
                                    className="create-field-error"
                                    role="alert"
                                >
                                    {fieldErrors.accountType}
                                </span>
                            ) : (
                                <span
                                    id="accountType-help"
                                    className="field-help"
                                >
                                    Choose between Savings and Current
                                    account types.
                                </span>
                            )}
                        </div>

                        <div className="create-form-field">
                            <label htmlFor="branchCode">
                                Branch
                            </label>

                            <select
                                id="branchCode"
                                value={branchCode}
                                onChange={(event) => {
                                    setBranchCode(event.target.value);
                                    clearFieldError("branchCode");
                                    setError("");
                                }}
                                disabled={creating}
                                aria-invalid={Boolean(fieldErrors.branchCode)}
                                aria-describedby={
                                    fieldErrors.branchCode
                                        ? "branchCode-error"
                                        : "branchCode-help"
                                }
                                className={
                                    fieldErrors.branchCode
                                        ? "field-invalid"
                                        : ""
                                }
                            >
                                <option value="">
                                    Select Branch
                                </option>

                                {branches.map((branch) => (
                                    <option key={branch} value={branch}>
                                        {branch}
                                    </option>
                                ))}
                            </select>

                            {fieldErrors.branchCode ? (
                                <span
                                    id="branchCode-error"
                                    className="create-field-error"
                                    role="alert"
                                >
                                    {fieldErrors.branchCode}
                                </span>
                            ) : (
                                <span
                                    id="branchCode-help"
                                    className="field-help"
                                >
                                    Only currently active branches are
                                    available.
                                </span>
                            )}
                        </div>

                        <div className="create-account-actions">
                            <Link
                                to="/customer/accounts"
                                className="secondary-button"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                className="primary-button"
                                disabled={creating}
                            >
                                Create Account
                            </button>
                        </div>
                    </form>
                </section>

                <aside className="account-opening-info">
                    <div className="info-card-icon">✓</div>

                    <h2>Opening an Account</h2>

                    <p>
                        Your new account will be created with
                        VISHNU BANK based on the options you select.
                    </p>

                    <div className="info-list">
                        <div>
                            <span>01</span>
                            <div>
                                <strong>Choose account type</strong>
                                <p>Select Savings or Current.</p>
                            </div>
                        </div>

                        <div>
                            <span>02</span>
                            <div>
                                <strong>Select a branch</strong>
                                <p>
                                    Choose from available active branches.
                                </p>
                            </div>
                        </div>

                        <div>
                            <span>03</span>
                            <div>
                                <strong>Confirm account creation</strong>
                                <p>
                                    Review your selections before creating
                                    the account.
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            {showConfirmation && (
                <div
                    className="create-account-confirmation-overlay"
                    onMouseDown={(event) => {
                        if (
                            event.target === event.currentTarget &&
                            !creating
                        ) {
                            handleCancelConfirmation();
                        }
                    }}
                >
                    <section
                        className="create-account-confirmation-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="create-account-confirmation-title"
                        aria-describedby="create-account-confirmation-description"
                    >
                        <button
                            type="button"
                            className="create-account-confirmation-close"
                            onClick={handleCancelConfirmation}
                            disabled={creating}
                            aria-label="Close confirmation"
                        >
                            <X size={19} />
                        </button>

                        <div className="create-account-confirmation-icon">
                            <ShieldCheck size={25} />
                        </div>

                        <p className="create-account-confirmation-eyebrow">
                            ACCOUNT OPENING
                        </p>

                        <h2 id="create-account-confirmation-title">
                            Confirm New Account
                        </h2>

                        <p
                            id="create-account-confirmation-description"
                            className="create-account-confirmation-description"
                        >
                            Please review your account details.
                            Do you want to proceed with creating
                            this account?
                        </p>

                        <div className="create-account-confirmation-details">
                            <div>
                                <span>Account Type</span>
                                <strong>{accountType}</strong>
                            </div>

                            <div>
                                <span>Branch Code</span>
                                <strong>{branchCode}</strong>
                            </div>
                        </div>

                        <div className="create-account-confirmation-notice">
                            <CircleAlert size={17} />

                            <p>
                                Please verify your selections before
                                continuing. The account will be created
                                only after you confirm.
                            </p>
                        </div>

                        <div className="create-account-confirmation-actions">
                            <button
                                type="button"
                                className="create-account-confirmation-cancel"
                                onClick={handleCancelConfirmation}
                                disabled={creating}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="create-account-confirmation-confirm"
                                onClick={handleConfirmCreate}
                                disabled={creating}
                            >
                                {creating ? (
                                    <>
                                        <LoaderCircle
                                            size={17}
                                            className="create-account-confirmation-spinner"
                                        />
                                        Creating Account...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 size={17} />
                                        Confirm &amp; Create
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

export default CreateAccount;
