import { useState } from "react";
import {
    ArrowLeft,
    Building2,
    CheckCircle2,
    Save
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import adminApi from "../../api/adminApi";
import "../../css/admin/AdminCreateBranch.css";

function AdminCreateBranch() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        branchCode: "",
        branchName: "",
        address: "",
        phoneNumber: ""
    });

    const [fieldErrors, setFieldErrors] = useState({
        branchCode: "",
        branchName: "",
        address: "",
        phoneNumber: ""
    });

    const [generalError, setGeneralError] = useState("");
    const [success, setSuccess] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const clearFieldError = (fieldName) => {
        setFieldErrors((currentErrors) => ({
            ...currentErrors,
            [fieldName]: ""
        }));
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((currentData) => ({
            ...currentData,
            [name]: value
        }));

        clearFieldError(name);
        setGeneralError("");
        setSuccess("");
    };

    const validateForm = () => {
        const errors = {
            branchCode: "",
            branchName: "",
            address: "",
            phoneNumber: ""
        };

        if (!formData.branchCode.trim()) {
            errors.branchCode = "Branch code is required.";
        }

        if (!formData.branchName.trim()) {
            errors.branchName = "Branch name is required.";
        }

        if (!formData.address.trim()) {
            errors.address = "Address is required.";
        }

        if (!formData.phoneNumber.trim()) {
            errors.phoneNumber = "Phone number is required.";
        }

        setFieldErrors(errors);

        return !Object.values(errors).some(
            (errorMessage) => errorMessage
        );
    };

    const getBackendFieldErrors = (responseData) => {
        if (!responseData) {
            return null;
        }

        const backendErrors = responseData.fieldErrors;

        if (
            !backendErrors ||
            typeof backendErrors !== "object" ||
            Array.isArray(backendErrors)
        ) {
            return null;
        }

        const errors = {
            branchCode: "",
            branchName: "",
            address: "",
            phoneNumber: ""
        };

        if (typeof backendErrors.branchCode === "string") {
            errors.branchCode = backendErrors.branchCode;
        }

        if (typeof backendErrors.branchName === "string") {
            errors.branchName = backendErrors.branchName;
        }

        if (typeof backendErrors.address === "string") {
            errors.address = backendErrors.address;
        }

        if (typeof backendErrors.phoneNumber === "string") {
            errors.phoneNumber = backendErrors.phoneNumber;
        }

        const hasFieldErrors = Object.values(errors).some(
            (errorMessage) => errorMessage
        );

        if (!hasFieldErrors) {
            return null;
        }

        return errors;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setGeneralError("");
        setSuccess("");

        const isValid = validateForm();

        if (!isValid) {
            return;
        }

        setSubmitting(true);

        try {
            const response = await adminApi.createBranch({
                branchCode: formData.branchCode.trim(),
                branchName: formData.branchName.trim(),
                address: formData.address.trim(),
                phoneNumber: formData.phoneNumber.trim()
            });

            setSuccess("Branch created successfully.");

            setTimeout(() => {
                navigate(`/admin/branches/${response.data.id}`);
            }, 700);
        } catch (err) {
            const status = err.response?.status;
            const responseData = err.response?.data;

            if (status === 400) {
                const backendFieldErrors =
                    getBackendFieldErrors(responseData);

                if (backendFieldErrors) {
                    setFieldErrors(backendFieldErrors);
                    setGeneralError("");
                } else {
                    setGeneralError(
                        responseData?.message ||
                        "Please check the entered information."
                    );
                }

                return;
            }

            
            setGeneralError(
                responseData?.message ||
                "Unable to create branch. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="admin-create-branch">
            <Link
                to="/admin/branches"
                className="admin-create-branch-back"
            >
                <ArrowLeft size={17} />
                Back to Branches
            </Link>

            <div className="admin-create-branch-header">
                <div className="admin-create-branch-title-section">
                    <div className="admin-create-branch-icon">
                        <Building2 size={23} />
                    </div>

                    <div>
                        <p className="admin-create-branch-eyebrow">
                            Branch Management
                        </p>

                        <h1>Create Branch</h1>

                        <p>
                            Add a new branch to the bank's branch network.
                        </p>
                    </div>
                </div>
            </div>

            {generalError && (
                <div className="admin-create-branch-alert">
                    <span>{generalError}</span>
                </div>
            )}

            {success && (
                <div className="admin-create-branch-success">
                    <CheckCircle2 size={18} />
                    <span>{success}</span>
                </div>
            )}

            <form
                className="admin-create-branch-form-card"
                onSubmit={handleSubmit}
                noValidate
            >
                <div className="admin-create-branch-card-header">
                    <Building2 size={19} />

                    <div>
                        <h2>Branch Information</h2>

                        <p>
                            Enter the basic information for the new branch.
                        </p>
                    </div>
                </div>

                <div className="admin-create-branch-form-grid">
                    <div className="admin-create-branch-field">
                        <label htmlFor="branchCode">
                            Branch Code
                        </label>

                        <input
                            id="branchCode"
                            name="branchCode"
                            type="text"
                            value={formData.branchCode}
                            onChange={handleChange}
                            placeholder="e.g. BR001"
                            autoComplete="off"
                            disabled={submitting}
                            className={
                                fieldErrors.branchCode
                                    ? "admin-create-branch-input-error"
                                    : ""
                            }
                        />

                        {fieldErrors.branchCode && (
                            <span className="admin-create-branch-field-error">
                                {fieldErrors.branchCode}
                            </span>
                        )}
                    </div>

                    <div className="admin-create-branch-field">
                        <label htmlFor="branchName">
                            Branch Name
                        </label>

                        <input
                            id="branchName"
                            name="branchName"
                            type="text"
                            value={formData.branchName}
                            onChange={handleChange}
                            placeholder="e.g. Hyderabad Main Branch"
                            autoComplete="off"
                            disabled={submitting}
                            className={
                                fieldErrors.branchName
                                    ? "admin-create-branch-input-error"
                                    : ""
                            }
                        />

                        {fieldErrors.branchName && (
                            <span className="admin-create-branch-field-error">
                                {fieldErrors.branchName}
                            </span>
                        )}
                    </div>

                    <div className="admin-create-branch-field admin-create-branch-field-full">
                        <label htmlFor="address">
                            Address
                        </label>

                        <textarea
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Enter complete branch address"
                            rows="4"
                            disabled={submitting}
                            className={
                                fieldErrors.address
                                    ? "admin-create-branch-input-error"
                                    : ""
                            }
                        />

                        {fieldErrors.address && (
                            <span className="admin-create-branch-field-error">
                                {fieldErrors.address}
                            </span>
                        )}
                    </div>

                    <div className="admin-create-branch-field">
                        <label htmlFor="phoneNumber">
                            Phone Number
                        </label>

                        <input
                            id="phoneNumber"
                            name="phoneNumber"
                            type="tel"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            placeholder="e.g. 9876543210"
                            autoComplete="tel"
                            disabled={submitting}
                            className={
                                fieldErrors.phoneNumber
                                    ? "admin-create-branch-input-error"
                                    : ""
                            }
                        />

                        {fieldErrors.phoneNumber && (
                            <span className="admin-create-branch-field-error">
                                {fieldErrors.phoneNumber}
                            </span>
                        )}
                    </div>
                </div>

                <div className="admin-create-branch-form-footer">
                    <p>
                        The branch will be created according to the bank's
                        branch validation rules.
                    </p>

                    <div className="admin-create-branch-actions">
                        <Link
                            to="/admin/branches"
                            className="admin-create-branch-cancel-button"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            className="admin-create-branch-submit-button"
                            disabled={submitting}
                        >
                            <Save size={17} />

                            {submitting
                                ? "Creating..."
                                : "Create Branch"}
                        </button>
                    </div>
                </div>
            </form>
        </section>
    );
}

export default AdminCreateBranch;