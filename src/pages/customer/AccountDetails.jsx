import { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";

import {
    Eye,
    EyeOff,
    LoaderCircle,
    ShieldCheck,
    X
} from "lucide-react";

import accountApi from "../../api/accountApi";

import transactionApi from "../../api/transactionApi";

import "../../css/AccountDetails.css";
import LoadingScreen from "../../components/common/LoadingScreen";


function AccountDetails() {

    const { accountNumber } = useParams();

    const [account, setAccount] = useState(null);

    const [balance, setBalance] = useState(null);


    const [loading, setLoading] = useState(true);

    const [balanceLoading, setBalanceLoading] = useState(false);

    const [statusLoading, setStatusLoading] = useState(false);


    const [statusError, setStatusError] = useState("");

    const [statusSuccess, setStatusSuccess] = useState("");


    const [showBalance, setShowBalance] = useState(false);

    const [showConfirmation, setShowConfirmation] = useState(false);


    const [limits, setLimits] = useState(null);

    const [limitsLoading, setLimitsLoading] = useState(true);

    const [limitsError, setLimitsError] = useState("");


    const [error, setError] = useState("");

    const [balanceError, setBalanceError] = useState("");


    useEffect(() => {

        const fetchAccount = async () => {

            try {

                const response =
                    await accountApi.getAccount(accountNumber);

                setAccount(response.data);

            } catch (error) {

                console.error(error);

                setError(
                    error.response?.data?.message ||
                    "Unable to load account details."
                );

            } finally {

                setLoading(false);

            }

        };

        fetchAccount();

    }, [accountNumber]);


    useEffect(() => {

        if (!accountNumber) {

            return;

        }


        const loadLimits = async () => {

            try {

                setLimitsLoading(true);

                setLimitsError("");


                const response =
                    await transactionApi.getTransactionLimits(
                        accountNumber
                    );

                setLimits(response.data);

            } catch (error) {

                console.error(error);


                setLimitsError(
                    error.response?.data?.message ||
                    "Unable to load transaction limits."
                );

            } finally {

                setLimitsLoading(false);

            }

        };


        loadLimits();

    }, [accountNumber]);


    const handleBalanceToggle = async () => {

        if (showBalance) {

            setShowBalance(false);

            return;

        }


        if (balance !== null) {

            setShowBalance(true);

            return;

        }


        try {

            setBalanceLoading(true);

            setBalanceError("");


            const response =
                await accountApi.getBalance(accountNumber);


            setBalance(response.data.balance);

            setShowBalance(true);

        } catch (error) {

            console.error(error);


            setBalanceError(
                error.response?.data?.message ||
                "Unable to load balance."
            );

        } finally {

            setBalanceLoading(false);

        }

    };


    /*
     * Open confirmation overlay.
     * The actual status update happens only
     * after the user clicks Confirm.
     */
    const handleStatusChange = () => {

        setStatusError("");

        setStatusSuccess("");

        setShowConfirmation(true);

    };


    /*
     * Close confirmation overlay.
     */
    const handleCancelConfirmation = () => {

        if (statusLoading) {

            return;

        }

        setShowConfirmation(false);

    };


    /*
     * Perform the actual status update
     * after confirmation.
     */
    const handleConfirmStatusChange = async () => {

        try {

            setStatusLoading(true);

            setStatusError("");

            setStatusSuccess("");


            const response =
                await accountApi.changeAccountStatus(
                    accountNumber
                );


            setAccount(response.data);


            setStatusSuccess(
                `Account status changed to ${response.data.status}.`
            );


            setShowConfirmation(false);

        } catch (error) {

            console.error(error);


            setStatusError(
                error.response?.data?.message ||
                "Unable to change account status."
            );

        } finally {

            setStatusLoading(false);

        }

    };


    const formatCurrency = (amount) => {

        return Number(amount).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

    };


    const formatDate = (date) => {

        if (!date) {

            return "-";

        }


        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });

    };

    if (loading) {
        return (
            <LoadingScreen message="Loading your Account Details..." />
        );
    }


    if (error || !account) {

        return (

            <div className="account-details-page">

                <div className="account-details-error">

                    <h3>

                        Unable to load account

                    </h3>


                    <p>

                        {error ||
                            "Account information is unavailable."}

                    </p>


                    <Link
                        to="/customer/accounts"
                        className="primary-button"
                    >

                        Back to Accounts

                    </Link>

                </div>

            </div>

        );

    }


    const isActive = account.status === "ACTIVE";

    const nextStatus = isActive
        ? "INACTIVE"
        : "ACTIVE";

    const actionText = isActive
        ? "deactivate"
        : "activate";


    return (

        <div className="account-details-page">


            <section className="account-details-header">

                <div>

                    <Link
                        to="/customer/accounts"
                        className="details-back-link"
                    >

                        ← Back to Accounts

                    </Link>


                    <p className="page-eyebrow">

                        ACCOUNT DETAILS

                    </p>


                    <div className="account-title-row">

                        <div>

                            <h1>

                                {account.accountType} Account

                            </h1>


                            <p className="details-account-number">

                                {account.accountNumber}

                            </p>

                        </div>


                        <span
                            className={`details-status ${account.status.toLowerCase()}`}
                        >

                            <span>●</span>

                            {account.status}

                        </span>

                    </div>

                </div>

            </section>



            <section className="account-balance-card">

                <div>

                    <p className="balance-card-label">

                        AVAILABLE BALANCE

                    </p>


                    <h2>

                        {showBalance && balance !== null

                            ? `₹ ${formatCurrency(balance)}`

                            : "₹ ••••••••"}

                    </h2>


                    {balanceError && (

                        <p className="balance-error">

                            {balanceError}

                        </p>

                    )}

                </div>


                <button
                    type="button"
                    className="balance-toggle-button"
                    onClick={handleBalanceToggle}
                    disabled={balanceLoading}
                    aria-label={
                        showBalance
                            ? "Hide balance"
                            : "View balance"
                    }
                    title={
                        showBalance
                            ? "Hide balance"
                            : "View balance"
                    }
                >

                    {balanceLoading ? (

                        <LoaderCircle
                            size={19}
                            strokeWidth={1.8}
                            className="balance-button-spinner"
                        />

                    ) : showBalance ? (

                        <EyeOff
                            size={20}
                            strokeWidth={1.8}
                        />

                    ) : (

                        <Eye
                            size={20}
                            strokeWidth={1.8}
                        />

                    )}

                </button>

            </section>


            {statusError && (

                <div className="account-details-error-message">

                    {statusError}

                </div>

            )}


            {statusSuccess && (

                <div className="account-details-success-message">

                    {statusSuccess}

                </div>

            )}


            <section className="details-section">

                <div className="details-section-heading">

                    <p className="page-eyebrow">

                        ACCOUNT

                    </p>


                    <h2>

                        Account Information

                    </h2>

                </div>


                <div className="details-info-grid">

                    <div className="details-info-item">

                        <span>

                            Account Number

                        </span>


                        <strong>

                            {account.accountNumber}

                        </strong>

                    </div>


                    <div className="details-info-item">

                        <span>

                            Account Type

                        </span>


                        <strong>

                            {account.accountType}

                        </strong>

                    </div>


                    <div className="details-info-item">

                        <span>

                            Account Status

                        </span>


                        <strong>

                            {account.status}

                        </strong>

                    </div>


                    <div className="details-info-item">

                        <span>

                            Created On

                        </span>


                        <strong>

                            {formatDate(account.createdAt)}

                        </strong>

                    </div>

                </div>

            </section>


            <section className="details-section">

                <div className="details-section-heading">

                    <p className="page-eyebrow">

                        BRANCH

                    </p>


                    <h2>

                        Branch Information

                    </h2>

                </div>


                <div className="details-info-grid">

                    <div className="details-info-item">

                        <span>

                            Branch Code

                        </span>


                        <strong>

                            {account.branch?.branchCode || "-"}

                        </strong>

                    </div>


                    <div className="details-info-item">

                        <span>

                            Branch Name

                        </span>


                        <strong>

                            {account.branch?.branchName || "-"}

                        </strong>

                    </div>


                    <div className="details-info-item">

                        <span>

                            IFSC Code

                        </span>


                        <strong>

                            {account.branch?.ifscCode || "-"}

                        </strong>

                    </div>


                    <div className="details-info-item details-address">

                        <span>

                            Address

                        </span>


                        <strong>

                            {account.branch?.address || "-"}

                        </strong>

                    </div>

                </div>

            </section>


            <section className="account-details-section transaction-limits-section">

                <div className="account-section-heading">

                    <p className="account-section-eyebrow">

                        DAILY LIMITS

                    </p>


                    <h2>

                        Transaction Limits

                    </h2>


                    <p>

                        Your daily limits for outgoing transactions.

                    </p>

                </div>


                {limitsLoading ? (

                    <div className="limits-loading">

                        Loading transaction limits...

                    </div>

                ) : limitsError ? (

                    <div className="limits-error">

                        {limitsError}

                    </div>

                ) : limits ? (

                    <div className="transaction-limit-grid">

                        <div className="transaction-limit-card">

                            <div className="transaction-limit-header">

                                <div>

                                    <span className="transaction-limit-type">

                                        Transfer

                                    </span>


                                    <h3>

                                        ₹{" "}

                                        {formatCurrency(
                                            limits.transfer.remainingAmount
                                        )}

                                    </h3>


                                    <span className="transaction-limit-caption">

                                        remaining today

                                    </span>

                                </div>

                            </div>


                            <div className="transaction-limit-stats">

                                <div>

                                    <span>

                                        Daily Limit

                                    </span>


                                    <strong>

                                        ₹{" "}

                                        {formatCurrency(
                                            limits.transfer.dailyLimit
                                        )}

                                    </strong>

                                </div>


                                <div>

                                    <span>

                                        Used Today

                                    </span>


                                    <strong>

                                        ₹{" "}

                                        {formatCurrency(
                                            limits.transfer.usedAmount
                                        )}

                                    </strong>

                                </div>

                            </div>


                            <div className="transaction-limit-progress">

                                <div
                                    className="transaction-limit-progress-bar"
                                    style={{
                                        width: `${Math.min(
                                            (
                                                Number(
                                                    limits.transfer.usedAmount
                                                ) /
                                                Number(
                                                    limits.transfer.dailyLimit
                                                )
                                            ) * 100,
                                            100
                                        )}%`
                                    }}
                                />

                            </div>

                        </div>


                        <div className="transaction-limit-card">

                            <div className="transaction-limit-header">

                                <div>

                                    <span className="transaction-limit-type">

                                        Withdrawal

                                    </span>


                                    <h3>

                                        ₹{" "}

                                        {formatCurrency(
                                            limits.withdrawal.remainingAmount
                                        )}

                                    </h3>


                                    <span className="transaction-limit-caption">

                                        remaining today

                                    </span>

                                </div>

                            </div>


                            <div className="transaction-limit-stats">

                                <div>

                                    <span>

                                        Daily Limit

                                    </span>


                                    <strong>

                                        ₹{" "}

                                        {formatCurrency(
                                            limits.withdrawal.dailyLimit
                                        )}

                                    </strong>

                                </div>


                                <div>

                                    <span>

                                        Used Today

                                    </span>


                                    <strong>

                                        ₹{" "}

                                        {formatCurrency(
                                            limits.withdrawal.usedAmount
                                        )}

                                    </strong>

                                </div>

                            </div>


                            <div className="transaction-limit-progress">

                                <div
                                    className="transaction-limit-progress-bar"
                                    style={{
                                        width: `${Math.min(
                                            (
                                                Number(
                                                    limits.withdrawal.usedAmount
                                                ) /
                                                Number(
                                                    limits.withdrawal.dailyLimit
                                                )
                                            ) * 100,
                                            100
                                        )}%`
                                    }}
                                />

                            </div>

                        </div>

                    </div>

                ) : null}

            </section>

            {(account.status === "ACTIVE" ||
                account.status === "INACTIVE") && (

                <section className="account-action-card">

                    <div>

                        <p className="page-eyebrow">

                            ACCOUNT ACTION

                        </p>


                        <h2>

                            {account.status === "ACTIVE"
                                ? "Deactivate this account?"
                                : "Activate this account?"}

                        </h2>


                        <p>

                            {account.status === "ACTIVE"
                                ? "You can deactivate your account when you no longer want to use it temporarily."
                                : "Activate this account to make it available for normal banking operations."}

                        </p>

                    </div>


                    <button
                        type="button"
                        className={
                            account.status === "ACTIVE"
                                ? "danger-button"
                                : "primary-button"
                        }
                        onClick={handleStatusChange}
                        disabled={statusLoading}
                    >

                        {account.status === "ACTIVE"
                            ? "Deactivate Account"
                            : "Activate Account"}

                    </button>

                </section>

            )}


            {showConfirmation && (

                <div
                    className="account-status-confirmation-overlay"
                    onMouseDown={(event) => {

                        if (
                            event.target === event.currentTarget &&
                            !statusLoading
                        ) {

                            handleCancelConfirmation();

                        }

                    }}
                >

                    <div
                        className="account-status-confirmation-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="account-status-confirmation-title"
                    >

                        <button
                            type="button"
                            className="account-status-confirmation-close"
                            onClick={handleCancelConfirmation}
                            disabled={statusLoading}
                            aria-label="Close confirmation"
                        >

                            <X
                                size={18}
                                strokeWidth={1.9}
                            />

                        </button>


                        <div className="account-status-confirmation-icon">

                            <ShieldCheck
                                size={22}
                                strokeWidth={1.8}
                            />

                        </div>


                        <h3 id="account-status-confirmation-title">

                            Change Account Status?

                        </h3>


                        <p>

                            You are about to {actionText} this account.

                            {" "}

                            The account status will change from{" "}

                            <strong>

                                {account.status}

                            </strong>

                            {" "}to{" "}

                            <strong>

                                {nextStatus}

                            </strong>.

                        </p>


                        <div className="account-status-confirmation-actions">

                            <button
                                type="button"
                                className="account-status-confirmation-cancel"
                                onClick={handleCancelConfirmation}
                                disabled={statusLoading}
                            >

                                Cancel

                            </button>


                            <button
                                type="button"
                                className="account-status-confirmation-confirm"
                                onClick={handleConfirmStatusChange}
                                disabled={statusLoading}
                            >

                                {statusLoading ? (

                                    <>

                                        <LoaderCircle
                                            size={15}
                                            strokeWidth={1.9}
                                            className="account-status-button-spinner"
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


export default AccountDetails;