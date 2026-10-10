import { useEffect, useState } from "react";
import {
    CircleAlert,
    LoaderCircle,
    ShieldCheck,
    Trash2,
    UserRound,
    X
} from "lucide-react";

import beneficiaryApi from "../../api/beneficiaryApi";
import "../../css/Beneficiaries.css";
import LoadingScreen from "../../components/common/LoadingScreen";

function Beneficiaries() {
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showCreateConfirmation, setShowCreateConfirmation] =
        useState(false);
    const [beneficiaryToRemove, setBeneficiaryToRemove] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        accountNumber: "",
        ifscCode: "",
        nickname: ""
    });

    const [creating, setCreating] = useState(false);
    const [formError, setFormError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [formSuccess, setFormSuccess] = useState("");
    const [removingId, setRemovingId] = useState(null);

    useEffect(() => {
        let cancelled = false;

        const loadBeneficiaries = async () => {
            try {
                const response =
                    await beneficiaryApi.getMyBeneficiaries();

                if (!cancelled) {
                    setBeneficiaries(response.data);
                }
            } catch (error) {
                console.error(error);

                if (!cancelled) {
                    setError(
                        error.response?.data?.message ||
                        "Unable to load beneficiaries."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadBeneficiaries();

        return () => {
            cancelled = true;
        };
    }, []);

    const handleRetry = async () => {
        setLoading(true);
        setError("");

        try {
            const response =
                await beneficiaryApi.getMyBeneficiaries();

            setBeneficiaries(response.data);
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to load beneficiaries."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

        setFieldErrors((previous) => {
            if (!previous[name]) {
                return previous;
            }

            const updatedErrors = { ...previous };
            delete updatedErrors[name];

            return updatedErrors;
        });

        setFormError("");
    };

    const openCreateForm = () => {
        setShowCreateForm(true);
        setFormError("");
        setFieldErrors({});
        setFormSuccess("");
    };

    const closeCreateForm = () => {
        if (creating) {
            return;
        }

        setShowCreateForm(false);
        setShowCreateConfirmation(false);
        setFormError("");
        setFieldErrors({});
    };

    const handleCreate = (event) => {
        event.preventDefault();

        setFormError("");
        setFormSuccess("");

        if (
            !formData.name.trim() ||
            !formData.accountNumber.trim() ||
            !formData.ifscCode.trim()
        ) {
            setFormError(
                "Please complete the required beneficiary details."
            );
            return;
        }

        setShowCreateConfirmation(true);
    };

    const confirmCreate = async () => {
        if (creating) {
            return;
        }

        setCreating(true);
        setFormError("");

        try {
            const response =
                await beneficiaryApi.createBeneficiary(formData);

            setBeneficiaries((previous) => [
                ...previous,
                response.data
            ]);

            setFormData({
                name: "",
                accountNumber: "",
                ifscCode: "",
                nickname: ""
            });

            setFieldErrors({});
            setFormSuccess("Beneficiary added successfully.");
            setShowCreateConfirmation(false);
            setShowCreateForm(false);
        } catch (error) {
            console.error(error);

            const responseData = error.response?.data;

            if (responseData?.fieldErrors) {
                setFieldErrors(responseData.fieldErrors);
                setFormError("");
            } else {
                setFieldErrors({});

                setFormError(
                    responseData?.message ||
                    "Unable to add beneficiary."
                );
            }

            setShowCreateConfirmation(false);
        } finally {
            setCreating(false);
        }
    };

    const requestRemove = (beneficiary) => {
        if (removingId !== null) {
            return;
        }

        setError("");
        setFormSuccess("");
        setBeneficiaryToRemove(beneficiary);
    };

    
    const confirmRemove = async () => {
        if (!beneficiaryToRemove || removingId !== null) {
            return;
        }

        const beneficiaryId = beneficiaryToRemove.id;

        try {
            setRemovingId(beneficiaryId);
            setError("");

            const response =
                await beneficiaryApi.removeBeneficiary(
                    beneficiaryId
                );

            setBeneficiaries((previous) =>
                previous.filter(
                    (beneficiary) =>
                        beneficiary.id !== response.data.id
                )
            );

            setFormSuccess("Beneficiary removed successfully.");
            setBeneficiaryToRemove(null);
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to remove beneficiary."
            );

            setBeneficiaryToRemove(null);
        } finally {
            setRemovingId(null);
        }
    };

  
    const getInitials = (name) => {
        if (!name) {
            return "?";
        }

        return name
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((part) => part.charAt(0).toUpperCase())
            .join("");
    };

    const maskAccountNumber = (accountNumber) => {
        if (!accountNumber) {
            return "";
        }

        return `${accountNumber.slice(0, 4)} •••• •••• ${accountNumber.slice(-4)}`;
    };

    if (loading) {
            return (
                <LoadingScreen message="Loading your Beneficiaries..." />
            );
        }

    
    if (error && beneficiaries.length === 0) {
        return (
            <div className="beneficiaries-page">
                <div className="beneficiaries-error">
                    <h3>Unable to load beneficiaries</h3>
                    <p>{error}</p>

                    <button
                        type="button"
                        className="primary-button"
                        onClick={handleRetry}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="beneficiaries-page">
            
            <section className="beneficiaries-header">
                <div>
                    <p className="page-eyebrow">PAYMENTS</p>
                    <h1>Beneficiaries</h1>
                    <p>
                        Manage the people and accounts you
                        frequently transfer money to.
                    </p>
                </div>

                <button
                    type="button"
                    className="add-beneficiary-button"
                    onClick={openCreateForm}
                >
                    <span>+</span>
                    Add Beneficiary
                </button>
            </section>

            
            {error && beneficiaries.length > 0 && (
                <div className="beneficiary-error">
                    {error}
                </div>
            )}

            {formSuccess && (
                <div className="beneficiary-success">
                    {formSuccess}
                </div>
            )}

           
            {showCreateForm && (
                <section className="beneficiary-form-card">
                    <div className="form-card-header">
                        <div>
                            <p className="page-eyebrow">
                                NEW BENEFICIARY
                            </p>
                            <h2>Add Beneficiary</h2>
                        </div>

                        <button
                            type="button"
                            className="close-form-button"
                            onClick={closeCreateForm}
                            disabled={creating}
                            aria-label="Close form"
                        >
                            ×
                        </button>
                    </div>

                    {formError && (
                        <div className="beneficiary-error">
                            {formError}
                        </div>
                    )}

                    <form onSubmit={handleCreate}>
                        <div className="beneficiary-form-grid">
                           
                            <div className="form-field">
                                <label htmlFor="name">
                                    Beneficiary Name
                                </label>

                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter beneficiary name"
                                    disabled={creating}
                                    className={
                                        fieldErrors.name
                                            ? "field-invalid"
                                            : ""
                                    }
                                />

                                {fieldErrors.name && (
                                    <p className="field-error">
                                        {fieldErrors.name}
                                    </p>
                                )}
                            </div>

                           
                            <div className="form-field">
                                <label htmlFor="nickname">
                                    Nickname
                                </label>

                                <input
                                    id="nickname"
                                    name="nickname"
                                    type="text"
                                    value={formData.nickname}
                                    onChange={handleChange}
                                    placeholder="Optional"
                                    disabled={creating}
                                    className={
                                        fieldErrors.nickname
                                            ? "field-invalid"
                                            : ""
                                    }
                                />

                                {fieldErrors.nickname && (
                                    <p className="field-error">
                                        {fieldErrors.nickname}
                                    </p>
                                )}
                            </div>

                          
                            <div className="form-field">
                                <label htmlFor="accountNumber">
                                    Account Number
                                </label>

                                <input
                                    id="accountNumber"
                                    name="accountNumber"
                                    type="text"
                                    inputMode="numeric"
                                    value={formData.accountNumber}
                                    onChange={handleChange}
                                    placeholder="12-digit account number"
                                    disabled={creating}
                                    className={
                                        fieldErrors.accountNumber
                                            ? "field-invalid"
                                            : ""
                                    }
                                />

                                {fieldErrors.accountNumber && (
                                    <p className="field-error">
                                        {fieldErrors.accountNumber}
                                    </p>
                                )}
                            </div>

                            
                            <div className="form-field">
                                <label htmlFor="ifscCode">
                                    IFSC Code
                                </label>

                                <input
                                    id="ifscCode"
                                    name="ifscCode"
                                    type="text"
                                    value={formData.ifscCode}
                                    onChange={handleChange}
                                    placeholder="Enter IFSC code"
                                    disabled={creating}
                                    className={
                                        fieldErrors.ifscCode
                                            ? "field-invalid"
                                            : ""
                                    }
                                />

                                {fieldErrors.ifscCode && (
                                    <p className="field-error">
                                        {fieldErrors.ifscCode}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="beneficiary-form-actions">
                            <button
                                type="button"
                                className="secondary-button"
                                onClick={closeCreateForm}
                                disabled={creating}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="primary-button"
                                disabled={creating}
                            >
                                Add Beneficiary
                            </button>
                        </div>
                    </form>
                </section>
            )}

           
            <section className="beneficiaries-section">
                <div className="section-title">
                    <div>
                        <p className="page-eyebrow">
                            YOUR BENEFICIARIES
                        </p>
                        <h2>Saved Accounts</h2>
                    </div>

                    <span className="beneficiary-count">
                        {beneficiaries.length}
                    </span>
                </div>

                
                {beneficiaries.length === 0 ? (
                    <div className="beneficiaries-empty">
                        <div className="empty-icon">+</div>

                        <h3>No beneficiaries yet</h3>

                        <p>
                            Add a beneficiary to make future
                            transfers faster and easier.
                        </p>

                        <button
                            type="button"
                            className="primary-button"
                            onClick={openCreateForm}
                        >
                            Add Your First Beneficiary
                        </button>
                    </div>
                ) : (
                  
                    <div className="beneficiary-grid">
                        {beneficiaries.map((beneficiary) => (
                            <article
                                className="beneficiary-card"
                                key={beneficiary.id}
                            >
                              
                                <div className="beneficiary-card-header">
                                    <div className="beneficiary-avatar">
                                        {getInitials(beneficiary.name)}
                                    </div>

                                    <div className="beneficiary-name-block">
                                        <h3>{beneficiary.name}</h3>

                                        {beneficiary.nickname && (
                                            <p>{beneficiary.nickname}</p>
                                        )}
                                    </div>

                                    <span
                                        className={`beneficiary-status ${beneficiary.status.toLowerCase()}`}
                                    >
                                        {beneficiary.status}
                                    </span>
                                </div>

                                
                                <div className="beneficiary-details">
                                    <div className="beneficiary-detail">
                                        <span>Account Number</span>
                                        <strong>
                                            {maskAccountNumber(
                                                beneficiary.accountNumber
                                            )}
                                        </strong>
                                    </div>

                                    <div className="beneficiary-detail">
                                        <span>IFSC Code</span>
                                        <strong>
                                            {beneficiary.ifscCode}
                                        </strong>
                                    </div>
                                </div>

                              
                                <div className="beneficiary-card-actions">
                                    <button
                                        type="button"
                                        className="remove-beneficiary-button"
                                        disabled={removingId !== null}
                                        onClick={() =>
                                            requestRemove(beneficiary)
                                        }
                                    >
                                        Remove
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            {showCreateConfirmation && (
                <div
                    className="beneficiary-confirmation-overlay"
                    onMouseDown={(event) => {
                        if (
                            event.target === event.currentTarget &&
                            !creating
                        ) {
                            setShowCreateConfirmation(false);
                        }
                    }}
                >
                    <section
                        className="beneficiary-confirmation-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="create-beneficiary-confirmation-title"
                    >
                        <button
                            type="button"
                            className="beneficiary-confirmation-close"
                            aria-label="Close confirmation"
                            onClick={() =>
                                setShowCreateConfirmation(false)
                            }
                            disabled={creating}
                        >
                            <X size={18} />
                        </button>

                        <div className="beneficiary-confirmation-icon">
                            <UserRound size={23} />
                        </div>

                        <p className="beneficiary-confirmation-eyebrow">
                            BENEFICIARY SETUP
                        </p>

                        <h2 id="create-beneficiary-confirmation-title">
                            Confirm new beneficiary
                        </h2>

                        <p className="beneficiary-confirmation-description">
                            Review the details before adding this
                            beneficiary to your saved accounts.
                        </p>

                        <div className="beneficiary-confirmation-details">
                            <div>
                                <span>Beneficiary name</span>
                                <strong>
                                    {formData.name.trim() || "—"}
                                </strong>
                            </div>

                            <div>
                                <span>Account number</span>
                                <strong>
                                    {formData.accountNumber.trim() || "—"}
                                </strong>
                            </div>

                            <div>
                                <span>IFSC code</span>
                                <strong>
                                    {formData.ifscCode.trim().toUpperCase() || "—"}
                                </strong>
                            </div>

                            <div>
                                <span>Nickname</span>
                                <strong>
                                    {formData.nickname.trim() || "Not provided"}
                                </strong>
                            </div>
                        </div>

                        <div className="beneficiary-confirmation-notice">
                            <ShieldCheck size={18} />
                            <p>
                                Verify the account number and IFSC code
                                before continuing. You can go back to
                                edit any detail.
                            </p>
                        </div>

                        <div className="beneficiary-confirmation-actions">
                            <button
                                type="button"
                                className="beneficiary-confirmation-cancel"
                                onClick={() =>
                                    setShowCreateConfirmation(false)
                                }
                                disabled={creating}
                            >
                                Go Back
                            </button>

                            <button
                                type="button"
                                className="beneficiary-confirmation-confirm"
                                onClick={confirmCreate}
                                disabled={creating}
                            >
                                {creating ? (
                                    <>
                                        <LoaderCircle
                                            size={16}
                                            className="beneficiary-confirmation-spinner"
                                        />
                                        Adding...
                                    </>
                                ) : (
                                    <>
                                        <ShieldCheck size={16} />
                                        Confirm & Add
                                    </>
                                )}
                            </button>
                        </div>
                    </section>
                </div>
            )}

            {beneficiaryToRemove && (
                <div
                    className="beneficiary-confirmation-overlay"
                    onMouseDown={(event) => {
                        if (
                            event.target === event.currentTarget &&
                            removingId === null
                        ) {
                            setBeneficiaryToRemove(null);
                        }
                    }}
                >
                    <section
                        className="beneficiary-confirmation-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="remove-beneficiary-confirmation-title"
                    >
                        <button
                            type="button"
                            className="beneficiary-confirmation-close"
                            aria-label="Close confirmation"
                            onClick={() =>
                                setBeneficiaryToRemove(null)
                            }
                            disabled={removingId !== null}
                        >
                            <X size={18} />
                        </button>

                        <div className="beneficiary-confirmation-icon beneficiary-confirmation-icon-warning">
                            <Trash2 size={22} />
                        </div>

                        <p className="beneficiary-confirmation-eyebrow">
                            SAVED ACCOUNTS
                        </p>

                        <h2 id="remove-beneficiary-confirmation-title">
                            Remove beneficiary?
                        </h2>

                        <p className="beneficiary-confirmation-description">
                            Are you sure you want to remove this
                            beneficiary from your saved accounts?
                        </p>

                        <div className="beneficiary-confirmation-details">
                            <div>
                                <span>Beneficiary name</span>
                                <strong>
                                    {beneficiaryToRemove.name}
                                </strong>
                            </div>

                            <div>
                                <span>Account number</span>
                                <strong>
                                    {maskAccountNumber(
                                        beneficiaryToRemove.accountNumber
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>IFSC code</span>
                                <strong>
                                    {beneficiaryToRemove.ifscCode}
                                </strong>
                            </div>
                        </div>

                        <div className="beneficiary-confirmation-notice beneficiary-confirmation-notice-warning">
                            <CircleAlert size={18} />
                            <p>
                                This removes the beneficiary from your
                                saved list. It does not reverse completed
                                transactions.
                            </p>
                        </div>

                        <div className="beneficiary-confirmation-actions">
                            <button
                                type="button"
                                className="beneficiary-confirmation-cancel"
                                onClick={() =>
                                    setBeneficiaryToRemove(null)
                                }
                                disabled={removingId !== null}
                            >
                                Keep Beneficiary
                            </button>

                            <button
                                type="button"
                                className="beneficiary-confirmation-confirm beneficiary-confirmation-remove"
                                onClick={confirmRemove}
                                disabled={removingId !== null}
                            >
                                {removingId !== null ? (
                                    <>
                                        <LoaderCircle
                                            size={16}
                                            className="beneficiary-confirmation-spinner"
                                        />
                                        Removing...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 size={16} />
                                        Confirm Removal
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

export default Beneficiaries;