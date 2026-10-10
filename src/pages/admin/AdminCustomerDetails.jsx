import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    ArrowLeft,
    UserRound,
    Mail,
    Phone,
    MapPin,
    CalendarDays,
    ShieldCheck,
    CircleAlert,
    CheckCircle2,
    LoaderCircle,
    X
} from "lucide-react";

import adminApi from "../../api/adminApi";
import "../../css/admin/AdminCustomerDetails.css";
import LoadingScreen from "../../components/common/LoadingScreen";

function AdminCustomerDetails() {

    const { customerId } = useParams();

    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedStatus, setSelectedStatus] = useState("");
    const [updatingStatus, setUpdatingStatus] = useState(false);

    const [showConfirmation, setShowConfirmation] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const loadCustomer = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await adminApi.getCustomer(customerId);
            const data = response.data;

            setCustomer(data);
            setSelectedStatus(data.status);
        } catch (error) {
            console.error("Failed to load customer:", error);

            setError(
                error.response?.data?.message ||
                "Unable to load customer details. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let isMounted = true;

        const fetchCustomer = async () => {
            try {
                const response = await adminApi.getCustomer(customerId);
                const data = response.data;

                if (!isMounted) {
                    return;
                }

                setCustomer(data);
                setSelectedStatus(data.status);
            } catch (error) {
                console.error("Failed to load customer:", error);

                if (!isMounted) {
                    return;
                }

                setError(
                    error.response?.data?.message ||
                    "Unable to load customer details. Please try again."
                );
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchCustomer();

        return () => {
            isMounted = false;
        };
    }, [customerId]);

    const getStatusClass = (status) => {
        switch (status) {
            case "ACTIVE":
                return "admin-customer-detail-status active";

            case "SUSPENDED":
                return "admin-customer-detail-status suspended";

            case "BLOCKED":
                return "admin-customer-detail-status blocked";

            default:
                return "admin-customer-detail-status";
        }
    };

    const formatDate = (dateValue) => {
        if (!dateValue) {
            return "—";
        }

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return "—";
        }

        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
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
            timeZone: "Asia/Kolkata",
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const getAvailableStatuses = () => {
        if (!customer) {
            return [];
        }

        switch (customer.status) {
            case "ACTIVE":
                return ["ACTIVE", "SUSPENDED", "BLOCKED"];

            case "SUSPENDED":
                return ["SUSPENDED", "ACTIVE", "BLOCKED"];

            case "BLOCKED":
                return ["BLOCKED"];

            default:
                return [customer.status];
        }
    };

    const handleStatusChange = (event) => {
        setSelectedStatus(event.target.value);
        setSuccessMessage("");
        setError("");
    };

    const handleUpdateClick = () => {
        if (!customer || selectedStatus === customer.status) {
            return;
        }

        setShowConfirmation(true);
    };

    const handleCancelConfirmation = () => {
        if (!updatingStatus) {
            setShowConfirmation(false);
        }
    };

    const handleConfirmStatusChange = async () => {
        if (!customer || selectedStatus === customer.status) {
            setShowConfirmation(false);
            return;
        }

        setUpdatingStatus(true);
        setError("");
        setSuccessMessage("");

        try {
            await adminApi.changeCustomerStatus(
                customer.id,
                selectedStatus
            );

            setCustomer((currentCustomer) => ({
                ...currentCustomer,
                status: selectedStatus
            }));

            setShowConfirmation(false);
            setSuccessMessage(
                `Customer status changed to ${selectedStatus}.`
            );
        } catch (error) {
            console.error("Failed to change customer status:", error);

            setError(
                error.response?.data?.message ||
                "Unable to change customer status. Please try again."
            );

            setShowConfirmation(false);
        } finally {
            setUpdatingStatus(false);
        }
    };

    const getStatusDescription = (status) => {
        switch (status) {
            case "ACTIVE":
                return "Customer has normal access to banking services.";

            case "SUSPENDED":
                return "Customer access is temporarily suspended.";

            case "BLOCKED":
                return "Customer is permanently blocked and cannot be reactivated.";

            default:
                return "Current customer account status.";
        }
    };

    if (loading) {
        return <LoadingScreen message="Loading customer details..." />;
    }

    if (error && !customer) {
        return (
            <div className="admin-customer-details">

                <div className="admin-customer-details-error-page">
                    <div className="admin-customer-details-error-icon">
                        <CircleAlert
                            size={24}
                            strokeWidth={1.8}
                        />
                    </div>

                    <h2>Unable to load customer</h2>

                    <p>{error}</p>

                    <div className="admin-customer-details-error-actions">
                        <button
                            type="button"
                            onClick={loadCustomer}
                            className="admin-customer-retry-button"
                        >
                            Try Again
                        </button>

                        <Link
                            to="/admin/customers"
                            className="admin-customer-back-button"
                        >
                            Back to Customers
                        </Link>
                    </div>
                </div>

            </div>
        );
    }

    if (!customer) {
        return null;
    }

    const availableStatuses = getAvailableStatuses();
    const isBlocked = customer.status === "BLOCKED";
    const hasStatusChange =
        selectedStatus !== customer.status;

    return (
        <div className="admin-customer-details">

            <section className="admin-customer-details-top">

                <div>
                    <Link
                        to="/admin/customers"
                        className="admin-customer-details-back"
                    >
                        <ArrowLeft
                            size={16}
                            strokeWidth={1.9}
                        />
                        <span>Back to Customers</span>
                    </Link>

                    <p className="admin-customer-details-eyebrow">
                        CUSTOMER MANAGEMENT
                    </p>

                    <h2>
                        Customer Details
                    </h2>

                    <p>
                        View customer information and manage account status.
                    </p>
                </div>

                <div className="admin-customer-details-id">
                    <span>Customer ID</span>
                    <strong>#{customer.id}</strong>
                </div>

            </section>

            {error && (
                <div className="admin-customer-details-error">
                    <CircleAlert
                        size={16}
                        strokeWidth={1.9}
                    />
                    <span>{error}</span>
                </div>
            )}

            {successMessage && (
                <div className="admin-customer-details-success">
                    <CheckCircle2
                        size={16}
                        strokeWidth={1.9}
                    />
                    <span>{successMessage}</span>
                </div>
            )}

            <section className="admin-customer-details-grid">

                <div className="admin-customer-information-card">

                    <div className="admin-customer-information-header">
                        <div className="admin-customer-large-avatar">
                            {customer.firstName
                                ?.charAt(0)
                                ?.toUpperCase() || "C"}
                        </div>

                        <div>
                            <h3>
                                {customer.firstName}{" "}
                                {customer.lastName || ""}
                            </h3>

                            <p>
                                Customer #{customer.id}
                            </p>
                        </div>
                    </div>

                    <div className="admin-customer-status-section">

                        <div className="admin-customer-status-heading">
                            <span>Current Status</span>

                            <span className={getStatusClass(customer.status)}>
                                <span className="admin-customer-status-dot" />
                                {customer.status}
                            </span>
                        </div>

                        <p>
                            {getStatusDescription(customer.status)}
                        </p>

                    </div>

                    <div className="admin-customer-information-divider" />

                    <div className="admin-customer-information-list">

                        <div className="admin-customer-information-item">
                            <div className="admin-customer-information-icon">
                                <Mail
                                    size={16}
                                    strokeWidth={1.8}
                                />
                            </div>

                            <div>
                                <span>Email Address</span>
                                <strong>
                                    {customer.email || "—"}
                                </strong>
                            </div>
                        </div>

                        <div className="admin-customer-information-item">
                            <div className="admin-customer-information-icon">
                                <Phone
                                    size={16}
                                    strokeWidth={1.8}
                                />
                            </div>

                            <div>
                                <span>Phone Number</span>
                                <strong>
                                    {customer.phoneNumber || "—"}
                                </strong>
                            </div>
                        </div>

                        <div className="admin-customer-information-item">
                            <div className="admin-customer-information-icon">
                                <CalendarDays
                                    size={16}
                                    strokeWidth={1.8}
                                />
                            </div>

                            <div>
                                <span>Date of Birth</span>
                                <strong>
                                    {formatDate(customer.dateOfBirth)}
                                </strong>
                            </div>
                        </div>

                        <div className="admin-customer-information-item">
                            <div className="admin-customer-information-icon">
                                <MapPin
                                    size={16}
                                    strokeWidth={1.8}
                                />
                            </div>

                            <div>
                                <span>Address</span>
                                <strong>
                                    {customer.address || "—"}
                                </strong>
                            </div>
                        </div>

                    </div>

                </div>

                <div className="admin-customer-management-column">

                    <div className="admin-customer-status-card">

                        <div className="admin-customer-card-heading">

                            <div className="admin-customer-card-heading-icon">
                                <ShieldCheck
                                    size={18}
                                    strokeWidth={1.8}
                                />
                            </div>

                            <div>
                                <h3>Customer Status</h3>
                                <p>
                                    Manage customer access status.
                                </p>
                            </div>

                        </div>

                        <div className="admin-customer-status-form">

                            <label htmlFor="customer-status">
                                Status
                            </label>

                            <select
                                id="customer-status"
                                value={selectedStatus}
                                onChange={handleStatusChange}
                                disabled={isBlocked || updatingStatus}
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

                            {isBlocked ? (
                                <div className="admin-customer-blocked-notice">
                                    <CircleAlert
                                        size={15}
                                        strokeWidth={1.8}
                                    />

                                    <span>
                                        This customer is blocked and cannot
                                        be reactivated.
                                    </span>
                                </div>
                            ) : (
                                <p className="admin-customer-status-help">
                                    Changing the status affects the
                                    customer's access to banking services.
                                </p>
                            )}

                            <button
                                type="button"
                                className="admin-customer-status-update-button"
                                onClick={handleUpdateClick}
                                disabled={
                                    !hasStatusChange ||
                                    isBlocked ||
                                    updatingStatus
                                }
                            >
                                {updatingStatus ? (
                                    <>
                                        <LoaderCircle
                                            size={16}
                                            strokeWidth={1.9}
                                            className="admin-customer-button-spinner"
                                        />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <ShieldCheck
                                            size={16}
                                            strokeWidth={1.9}
                                        />
                                        Update Status
                                    </>
                                )}
                            </button>

                        </div>

                    </div>

                    <div className="admin-customer-account-card">

                        <div className="admin-customer-card-heading">

                            <div className="admin-customer-card-heading-icon">
                                <UserRound
                                    size={18}
                                    strokeWidth={1.8}
                                />
                            </div>

                            <div>
                                <h3>Customer Record</h3>
                                <p>
                                    Account information and registration details.
                                </p>
                            </div>

                        </div>

                        <div className="admin-customer-record-list">

                            <div className="admin-customer-record-row">
                                <span>Customer ID</span>
                                <strong>#{customer.id}</strong>
                            </div>

                            <div className="admin-customer-record-row">
                                <span>Registered On</span>
                                <strong>
                                    {formatDateTime(customer.createdAt)}
                                </strong>
                            </div>

                            <div className="admin-customer-record-row">
                                <span>Current Status</span>

                                <span className={getStatusClass(customer.status)}>
                                    <span className="admin-customer-status-dot" />
                                    {customer.status}
                                </span>
                            </div>

                        </div>

                    </div>

                </div>

            </section>

            {showConfirmation && (
                <div
                    className="admin-customer-confirmation-overlay"
                    onMouseDown={(event) => {
                        if (
                            event.target === event.currentTarget &&
                            !updatingStatus
                        ) {
                            handleCancelConfirmation();
                        }
                    }}
                >
                    <div
                        className="admin-customer-confirmation-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="customer-status-confirmation-title"
                    >

                        <button
                            type="button"
                            className="admin-customer-confirmation-close"
                            onClick={handleCancelConfirmation}
                            disabled={updatingStatus}
                            aria-label="Close confirmation"
                        >
                            <X
                                size={18}
                                strokeWidth={1.9}
                            />
                        </button>

                        <div className="admin-customer-confirmation-icon">
                            <ShieldCheck
                                size={22}
                                strokeWidth={1.8}
                            />
                        </div>

                        <h3 id="customer-status-confirmation-title">
                            Change Customer Status?
                        </h3>

                        <p>
                            You are changing this customer's status from{" "}
                            <strong>{customer.status}</strong> to{" "}
                            <strong>{selectedStatus}</strong>.
                        </p>

                        <div className="admin-customer-confirmation-actions">

                            <button
                                type="button"
                                className="admin-customer-confirmation-cancel"
                                onClick={handleCancelConfirmation}
                                disabled={updatingStatus}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="admin-customer-confirmation-confirm"
                                onClick={handleConfirmStatusChange}
                                disabled={updatingStatus}
                            >
                                {updatingStatus ? (
                                    <>
                                        <LoaderCircle
                                            size={15}
                                            strokeWidth={1.9}
                                            className="admin-customer-button-spinner"
                                        />
                                        Updating...
                                    </>
                                ) : (
                                    "Confirm Change"
                                )}
                            </button>

                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}

export default AdminCustomerDetails;