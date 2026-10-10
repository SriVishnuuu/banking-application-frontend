import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Building2, CheckCircle2, MapPin, Phone, RefreshCw } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import adminApi from "../../api/adminApi";
import "../../css/admin/AdminBranchDetails.css";
import LoadingScreen from "../../components/common/LoadingScreen";

function AdminBranchDetails() {
    const { branchId } = useParams();

    const [branch, setBranch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedStatus, setSelectedStatus] = useState("");
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [changingStatus, setChangingStatus] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");
    const [statusError, setStatusError] = useState("");

    const loadBranch = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await adminApi.getBranch(branchId);

            setBranch(response.data);
            setSelectedStatus(response.data.status);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load branch details. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }, [branchId]);

    useEffect(() => {
        let isMounted = true;

        const fetchBranch = async () => {
            if (!isMounted) {
                return;
            }

            await loadBranch();
        };

        fetchBranch();

        return () => {
            isMounted = false;
        };
    }, [loadBranch]);

    const formatStatus = (status) => {
        if (!status) {
            return "Unknown";
        }

        return status.charAt(0) + status.slice(1).toLowerCase();
    };

    const getStatusClass = (status) => {
        if (!status) {
            return "";
        }

        return status.toLowerCase();
    };

    const formatDateTime = (value) => {
        if (!value) {
            return "—";
        }

        return new Intl.DateTimeFormat("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }).format(new Date(value));
    };

    const handleStatusChange = (event) => {
        const newStatus = event.target.value;

        if (newStatus === branch.status) {
            return;
        }

        setStatusError("");
        setStatusMessage("");
        setSelectedStatus(newStatus);
        setShowStatusModal(true);
    };

    const handleCloseStatusModal = () => {
        if (changingStatus) {
            return;
        }

        setSelectedStatus(branch.status);
        setShowStatusModal(false);
    };

    const handleConfirmStatusChange = async () => {
        setChangingStatus(true);
        setStatusError("");
        setStatusMessage("");

        try {
            await adminApi.changeBranchStatus(
                branch.id,
                selectedStatus
            );

            setBranch((currentBranch) => ({
                ...currentBranch,
                status: selectedStatus,
                updatedAt: new Date().toISOString()
            }));

            setStatusMessage(
                `Branch status changed to ${formatStatus(selectedStatus)} successfully.`
            );

            setShowStatusModal(false);
        } catch (err) {
            setSelectedStatus(branch.status);

            setStatusError(
                err.response?.data?.message ||
                "Unable to change branch status. Please try again."
            );

            setShowStatusModal(false);
        } finally {
            setChangingStatus(false);
        }
    };

    if (loading) {
        return <LoadingScreen message="Loading branch details..." />;
    }

    if (error) {
        return (
            <section className="admin-branch-details">
                <div className="admin-branch-details-state admin-branch-details-error-state">
                    <div className="admin-branch-details-state-icon">
                        !
                    </div>

                    <h2>Unable to load branch</h2>

                    <p>{error}</p>

                    <button
                        type="button"
                        onClick={loadBranch}
                        className="admin-branch-details-retry-button"
                    >
                        <RefreshCw size={16} />
                        Try Again
                    </button>
                </div>
            </section>
        );
    }

    if (!branch) {
        return null;
    }

    return (
        <section className="admin-branch-details">
            <Link
                to="/admin/branches"
                className="admin-branch-details-back"
            >
                <ArrowLeft size={17} />
                Back to Branches
            </Link>

            <div className="admin-branch-details-header">
                <div className="admin-branch-details-title-section">
                    <div className="admin-branch-details-icon">
                        <Building2 size={23} />
                    </div>

                    <div>
                        <p className="admin-branch-details-eyebrow">
                            Branch Details
                        </p>

                        <h1>{branch.branchName}</h1>

                        <p className="admin-branch-details-code">
                            {branch.branchCode}
                        </p>
                    </div>
                </div>

                <span
                    className={`admin-branch-details-status ${getStatusClass(
                        branch.status
                    )}`}
                >
                    <span className="admin-branch-details-status-dot"></span>
                    {formatStatus(branch.status)}
                </span>
            </div>

            {statusMessage && (
                <div className="admin-branch-details-success">
                    <CheckCircle2 size={18} />
                    <span>{statusMessage}</span>
                </div>
            )}

            {statusError && (
                <div className="admin-branch-details-alert">
                    <span>{statusError}</span>
                </div>
            )}

            <div className="admin-branch-details-grid">
                <div className="admin-branch-details-card">
                    <div className="admin-branch-details-card-header">
                        <Building2 size={19} />
                        <h2>Branch Information</h2>
                    </div>

                    <div className="admin-branch-details-info-grid">
                        <div className="admin-branch-details-info-item">
                            <span>Branch Code</span>
                            <strong>{branch.branchCode}</strong>
                        </div>

                        <div className="admin-branch-details-info-item">
                            <span>Branch Name</span>
                            <strong>{branch.branchName}</strong>
                        </div>

                        <div className="admin-branch-details-info-item">
                            <span>IFSC Code</span>
                            <strong>{branch.ifscCode}</strong>
                        </div>

                        <div className="admin-branch-details-info-item">
                            <span>Phone Number</span>
                            <strong>{branch.phoneNumber || "—"}</strong>
                        </div>
                    </div>
                </div>

                <div className="admin-branch-details-card">
                    <div className="admin-branch-details-card-header">
                        <MapPin size={19} />
                        <h2>Address</h2>
                    </div>

                    <div className="admin-branch-details-address">
                        <MapPin size={18} />
                        <p>{branch.address || "No address available"}</p>
                    </div>

                    <div className="admin-branch-details-phone">
                        <Phone size={17} />
                        <span>{branch.phoneNumber || "No phone number available"}</span>
                    </div>
                </div>
            </div>

            <div className="admin-branch-details-record-card">
                <div className="admin-branch-details-card-header">
                    <Building2 size={19} />
                    <h2>Record Information</h2>
                </div>

                <div className="admin-branch-details-record-grid">
                    <div className="admin-branch-details-info-item">
                        <span>Branch ID</span>
                        <strong>{branch.id}</strong>
                    </div>

                    <div className="admin-branch-details-info-item">
                        <span>Created</span>
                        <strong>{formatDateTime(branch.createdAt)}</strong>
                    </div>

                    <div className="admin-branch-details-info-item">
                        <span>Last Updated</span>
                        <strong>{formatDateTime(branch.updatedAt)}</strong>
                    </div>
                </div>
            </div>

            <div className="admin-branch-details-management-card">
                <div className="admin-branch-details-management-header">
                    <div>
                        <p className="admin-branch-details-section-eyebrow">
                            Branch Management
                        </p>

                        <h2>Branch Status</h2>

                        <p>
                            Change whether this branch is currently active
                            or inactive.
                        </p>
                    </div>
                </div>

                <div className="admin-branch-details-management-body">
                    <div className="admin-branch-details-status-control">
                        <label htmlFor="branch-status">
                            Current Status
                        </label>

                        <select
                            id="branch-status"
                            value={selectedStatus}
                            onChange={handleStatusChange}
                        >
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                        </select>
                    </div>

                    <div className="admin-branch-details-management-note">
                        Changing the status controls whether this branch is available for active banking operations.
                    </div>
                </div>
            </div>

            {showStatusModal && (
                <div
                    className="admin-branch-details-modal-overlay"
                    onMouseDown={handleCloseStatusModal}
                >
                    <div
                        className="admin-branch-details-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="branch-status-modal-title"
                        onMouseDown={(event) => event.stopPropagation()}
                    >
                        <div className="admin-branch-details-modal-icon">
                            <Building2 size={22} />
                        </div>

                        <h2 id="branch-status-modal-title">
                            Change Branch Status?
                        </h2>

                        <p>
                            Are you sure you want to change{" "}
                            <strong>{branch.branchName}</strong> from{" "}
                            <strong>
                                {formatStatus(branch.status)}
                            </strong>{" "}
                            to{" "}
                            <strong>
                                {formatStatus(selectedStatus)}
                            </strong>
                            ?
                        </p>

                        <div className="admin-branch-details-modal-actions">
                            <button
                                type="button"
                                className="admin-branch-details-modal-cancel"
                                onClick={handleCloseStatusModal}
                                disabled={changingStatus}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="admin-branch-details-modal-confirm"
                                onClick={handleConfirmStatusChange}
                                disabled={changingStatus}
                            >
                                {changingStatus
                                    ? "Updating..."
                                    : "Confirm Change"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

export default AdminBranchDetails;