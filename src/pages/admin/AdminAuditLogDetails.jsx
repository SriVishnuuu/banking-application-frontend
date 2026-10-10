import { useEffect, useState } from "react";
import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    CircleAlert,
    FileText,
    Hash,
    RefreshCw,
    ShieldCheck,
    UserRound
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import adminApi from "../../api/adminApi";
import "../../css/admin/AdminAuditLogDetails.css";
import LoadingScreen from "../../components/common/LoadingScreen";

function AdminAuditLogDetails() {
    const { auditLogId } = useParams();

    const [auditLog, setAuditLog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [retryKey, setRetryKey] = useState(0);

    useEffect(() => {
        let isMounted = true;

        const fetchAuditLog = async () => {
            setLoading(true);
            setError("");

            try {
                const response = await adminApi.getAuditLog(auditLogId);

                if (!isMounted) {
                    return;
                }

                setAuditLog(response.data);
            } catch (err) {
                if (!isMounted) {
                    return;
                }

                setAuditLog(null);

                setError(
                    err.response?.data?.message ||
                    "Unable to load audit log. Please try again."
                );
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchAuditLog();

        return () => {
            isMounted = false;
        };
    }, [auditLogId, retryKey]);

    const formatAction = (action) => {
        if (!action) {
            return "—";
        }

        return action
            .toLowerCase()
            .split("_")
            .map(
                (word) =>
                    word.charAt(0).toUpperCase() + word.slice(1)
            )
            .join(" ");
    };

    const formatResourceType = (resourceType) => {
        if (!resourceType) {
            return "—";
        }

        if (resourceType === "AUTH") {
            return "Authentication";
        }

        return (
            resourceType.charAt(0) +
            resourceType.slice(1).toLowerCase()
        );
    };

    const formatStatus = (status) => {
        if (!status) {
            return "—";
        }

        return (
            status.charAt(0) +
            status.slice(1).toLowerCase()
        );
    };

    const formatDateTime = (timestamp) => {
        if (!timestamp) {
            return "—";
        }

        return new Intl.DateTimeFormat("en-IN", {
            dateStyle: "long",
            timeStyle: "medium",
            timeZone: "Asia/Kolkata"
        }).format(new Date(timestamp));
    };

    const getStatusClass = (status) => {
        if (status === "SUCCESS") {
            return "admin-audit-detail-status-success";
        }

        if (status === "FAILED") {
            return "admin-audit-detail-status-failed";
        }

        return "";
    };

    const handleRetry = () => {
        setRetryKey((previous) => previous + 1);
    };

    if (loading) {
    return <LoadingScreen message="Loading audit log details..." />;
}

    if (error) {
        return (
            <section className="admin-audit-detail-page">

                <Link
                    to="/admin/audit-logs"
                    className="admin-audit-detail-back-link"
                >
                    <ArrowLeft size={16} />
                    Back to Audit Logs
                </Link>

                <div className="admin-audit-detail-state-card admin-audit-detail-error-state">
                    <div className="admin-audit-detail-state-icon">
                        <CircleAlert size={23} />
                    </div>

                    <h3>Unable to load audit log</h3>

                    <p>{error}</p>

                    <button
                        type="button"
                        className="admin-audit-detail-retry-button"
                        onClick={handleRetry}
                    >
                        <RefreshCw size={16} />
                        Try Again
                    </button>
                </div>
            </section>
        );
    }

    if (!auditLog) {
        return null;
    }

    const isSuccess = auditLog.status === "SUCCESS";

    return (
        <section className="admin-audit-detail-page">

            <Link
                to="/admin/audit-logs"
                className="admin-audit-detail-back-link"
            >
                <ArrowLeft size={16} />
                Back to Audit Logs
            </Link>


            <div className="admin-audit-detail-header">

                <div>
                    <span className="admin-audit-detail-eyebrow">
                        SECURITY & COMPLIANCE
                    </span>

                    <h1>Audit Log Details</h1>

                    <p>
                        Review the recorded details of this
                        administrative or security event.
                    </p>
                </div>

                <span
                    className={`admin-audit-detail-status ${getStatusClass(
                        auditLog.status
                    )}`}
                >
                    {isSuccess ? (
                        <CheckCircle2 size={15} />
                    ) : (
                        <CircleAlert size={15} />
                    )}

                    {formatStatus(auditLog.status)}
                </span>

            </div>


            <div className="admin-audit-detail-summary">

                <div className="admin-audit-detail-summary-icon">
                    <ShieldCheck size={23} />
                </div>

                <div className="admin-audit-detail-summary-content">
                    <span>Recorded Action</span>

                    <strong>
                        {formatAction(auditLog.action)}
                    </strong>

                    <p>
                        Audit Log #{auditLog.id}
                    </p>
                </div>

            </div>


            <div className="admin-audit-detail-grid">

                <div className="admin-audit-detail-card">

                    <div className="admin-audit-detail-card-header">
                        <div className="admin-audit-detail-card-icon">
                            <UserRound size={18} />
                        </div>

                        <div>
                            <h2>Performed By</h2>
                            <p>User associated with this event</p>
                        </div>
                    </div>

                    <div className="admin-audit-detail-card-body">

                        <div className="admin-audit-detail-field">
                            <span>User Email</span>

                            <strong>
                                {auditLog.userEmail || "System"}
                            </strong>
                        </div>

                    </div>

                </div>

                <div className="admin-audit-detail-card">

                    <div className="admin-audit-detail-card-header">
                        <div className="admin-audit-detail-card-icon">
                            <FileText size={18} />
                        </div>

                        <div>
                            <h2>Event Information</h2>
                            <p>Classification of this audit event</p>
                        </div>
                    </div>

                    <div className="admin-audit-detail-card-body">

                        <div className="admin-audit-detail-field">
                            <span>Action</span>

                            <strong>
                                {formatAction(auditLog.action)}
                            </strong>
                        </div>

                        <div className="admin-audit-detail-field">
                            <span>Resource Type</span>

                            <strong>
                                {formatResourceType(
                                    auditLog.resourceType
                                )}
                            </strong>
                        </div>

                        <div className="admin-audit-detail-field">
                            <span>Resource ID</span>

                            <strong>
                                {auditLog.resourceId ?? "—"}
                            </strong>
                        </div>

                    </div>

                </div>

                <div className="admin-audit-detail-card">

                    <div className="admin-audit-detail-card-header">
                        <div className="admin-audit-detail-card-icon">
                            <CalendarDays size={18} />
                        </div>

                        <div>
                            <h2>Record Information</h2>
                            <p>When this event was recorded</p>
                        </div>
                    </div>

                    <div className="admin-audit-detail-card-body">

                        <div className="admin-audit-detail-field">
                            <span>Timestamp</span>

                            <strong>
                                {formatDateTime(
                                    auditLog.timestamp
                                )}
                            </strong>
                        </div>

                        <div className="admin-audit-detail-field">
                            <span>Audit ID</span>

                            <strong>
                                #{auditLog.id}
                            </strong>
                        </div>

                    </div>

                </div>

                <div className="admin-audit-detail-card">

                    <div className="admin-audit-detail-card-header">
                        <div className="admin-audit-detail-card-icon">
                            <Hash size={18} />
                        </div>

                        <div>
                            <h2>Status</h2>
                            <p>Result recorded for this event</p>
                        </div>
                    </div>

                    <div className="admin-audit-detail-card-body">

                        <div className="admin-audit-detail-status-row">

                            <span
                                className={`admin-audit-detail-status ${getStatusClass(
                                    auditLog.status
                                )}`}
                            >
                                {isSuccess ? (
                                    <CheckCircle2 size={15} />
                                ) : (
                                    <CircleAlert size={15} />
                                )}

                                {formatStatus(auditLog.status)}
                            </span>

                        </div>

                    </div>

                </div>

            </div>

            {auditLog.description && (
                <div className="admin-audit-detail-description-card">

                    <div className="admin-audit-detail-card-header">
                        <div className="admin-audit-detail-card-icon">
                            <FileText size={18} />
                        </div>

                        <div>
                            <h2>Description</h2>
                            <p>
                                Additional information recorded
                                with this event.
                            </p>
                        </div>
                    </div>

                    <div className="admin-audit-detail-description">
                        {auditLog.description}
                    </div>

                </div>
            )}

        </section>
    );
}

export default AdminAuditLogDetails;