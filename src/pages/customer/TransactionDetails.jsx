import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import transactionApi from "../../api/transactionApi";
import "../../css/TransactionDetails.css";
import LoadingScreen from "../../components/common/LoadingScreen";

function TransactionDetails() {

    const { transactionReference } = useParams();

    const [transaction, setTransaction] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchTransaction = async () => {

            try {

                setLoading(true);
                setError("");

                const response =
                    await transactionApi.getTransaction(
                        transactionReference
                    );

                setTransaction(response.data);

            } catch (error) {

                console.error(error);

                setError(
                    error.response?.data?.message ||
                    "Unable to load transaction details."
                );

            } finally {
                setLoading(false);
            }
        };

        fetchTransaction();

    }, [transactionReference]);

    const formatCurrency = (amount) => {

        return Number(amount).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const maskAccountNumber = (accountNumber) => {

        if (!accountNumber) {
            return "—";
        }

        return `•••• ${accountNumber.slice(-4)}`;
    };

    const formatDate = (dateTime) => {

        return new Intl.DateTimeFormat("en-IN", {
            timeZone: "Asia/Kolkata",
            day: "2-digit",
            month: "short",
            year: "numeric"
        }).format(new Date(dateTime));
    };

    const formatTime = (dateTime) => {

        return new Intl.DateTimeFormat("en-IN", {
            timeZone: "Asia/Kolkata",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        }).format(new Date(dateTime));
    };

    const getTransactionTitle = () => {

        if (!transaction) {
            return "";
        }

        if (transaction.transactionType === "TRANSFER") {

            return transaction.direction === "DEBIT"
                ? "Transfer Sent"
                : "Transfer Received";
        }

        if (transaction.transactionType === "DEPOSIT") {
            return "Deposit";
        }

        if (transaction.transactionType === "WITHDRAW") {
            return "Withdrawal";
        }

        return transaction.transactionType;
    };

    const getAccountLabel = () => {

        if (!transaction) {
            return "";
        }

        if (transaction.transactionType === "TRANSFER") {

            return transaction.direction === "DEBIT"
                ? "To Account"
                : "From Account";
        }

        if (transaction.transactionType === "DEPOSIT") {
            return "To Account";
        }

        if (transaction.transactionType === "WITHDRAW") {
            return "From Account";
        }

        return "Account";
    };

    const getAccountNumber = () => {

        if (!transaction) {
            return null;
        }

        if (transaction.direction === "DEBIT") {
            return transaction.sourceAccountNumber;
        }

        return transaction.destinationAccountNumber;
    };

    if (loading) {
            return (
                <LoadingScreen message="Loading your Transaction Details..." />
            );
        }

    if (error) {

        return (
            <div className="transaction-details-page">

                <Link
                    to="/customer/transactions"
                    className="transaction-back-link"
                >
                    ← Back to Transactions
                </Link>

                <div className="transaction-details-error">
                    <h2>Unable to load transaction</h2>

                    <p>{error}</p>
                </div>

            </div>
        );
    }

    const isDebit = transaction.direction === "DEBIT";

    return (
        <div className="transaction-details-page">

            <Link
                to="/customer/transactions"
                className="transaction-back-link"
            >
                ← Back to Transactions
            </Link>

            <section className="transaction-details-header">

                <div>
                    <p className="transaction-details-eyebrow">
                        TRANSACTION DETAILS
                    </p>

                    <h1>{getTransactionTitle()}</h1>

                    <p>
                        {formatDate(transaction.createdAt)}
                        {" · "}
                        {formatTime(transaction.createdAt)}
                    </p>
                </div>

                <span
                    className={`transaction-large-status ${
                        transaction.status.toLowerCase()
                    }`}
                >
                    {transaction.status}
                </span>

            </section>

            <section className="transaction-amount-card">

                <p>Transaction Amount</p>

                <h2
                    className={
                        isDebit
                            ? "amount-debit"
                            : "amount-credit"
                    }
                >
                    {isDebit ? "- ₹" : "+ ₹"}
                    {formatCurrency(transaction.amount)}
                </h2>

                <span
                    className={`transaction-large-direction ${
                        transaction.direction.toLowerCase()
                    }`}
                >
                    {transaction.direction}
                </span>

            </section>

            <section className="transaction-information-card">

                <div className="transaction-section-title">
                    <p className="section-eyebrow">
                        TRANSACTION INFORMATION
                    </p>

                    <h2>Details</h2>
                </div>

                <div className="transaction-information-grid">

                    <div className="transaction-info-item">

                        <span>
                            Transaction Reference
                        </span>

                        <strong>
                            {transaction.transactionReference}
                        </strong>

                    </div>

                    <div className="transaction-info-item">

                        <span>
                            Transaction Type
                        </span>

                        <strong>
                            {transaction.transactionType}
                        </strong>

                    </div>

                    <div className="transaction-info-item">

                        <span>
                            {getAccountLabel()}
                        </span>

                        <strong>
                            {maskAccountNumber(
                                getAccountNumber()
                            )}
                        </strong>

                    </div>

                    {transaction.transactionType ===
                        "TRANSFER" && (
                        <div className="transaction-info-item">

                            <span>
                                {isDebit
                                    ? "Beneficiary Account"
                                    : "Source Account"}
                            </span>

                            <strong>
                                {maskAccountNumber(
                                    isDebit
                                        ? transaction.destinationAccountNumber
                                        : transaction.sourceAccountNumber
                                )}
                            </strong>

                        </div>
                    )}

                    <div className="transaction-info-item">

                        <span>
                            Date
                        </span>

                        <strong>
                            {formatDate(
                                transaction.createdAt
                            )}
                        </strong>

                    </div>

                    <div className="transaction-info-item">

                        <span>
                            Time
                        </span>

                        <strong>
                            {formatTime(
                                transaction.createdAt
                            )}
                        </strong>

                    </div>

                </div>

            </section>

            {transaction.description && (

                <section className="transaction-description-card">

                    <p className="section-eyebrow">
                        DESCRIPTION
                    </p>

                    <p>
                        {transaction.description}
                    </p>

                </section>
            )}

            {transaction.status === "FAILED" &&
                transaction.failureReason && (

                <section className="transaction-failure-card">

                    <p className="section-eyebrow">
                        FAILURE INFORMATION
                    </p>

                    <h3>Transaction Failed</h3>

                    <p>
                        {transaction.failureReason}
                    </p>

                </section>
            )}

        </div>
    );
}

export default TransactionDetails;