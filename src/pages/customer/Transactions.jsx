import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import accountApi from "../../api/accountApi";
import transactionApi from "../../api/transactionApi";
import "../../css/Transactions.css";
import LoadingScreen from "../../components/common/LoadingScreen";

function Transactions() {

    const [transactions, setTransactions] = useState([]);
    const [accounts, setAccounts] = useState([]);

    const [accountNumber, setAccountNumber] = useState("");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [direction, setDirection] = useState("");

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [initialLoadError, setInitialLoadError] = useState("");

    const loadTransactions = async (
        filterParams = {},
        pageNumber = 0
    ) => {

        try {

            setLoading(true);
            setError("");

            const response =
                await transactionApi.getTransactions({
                    ...filterParams,
                    page: pageNumber
                });

            setTransactions(
                response.data.content
            );

            setPage(
                response.data.number
            );

            setTotalPages(
                response.data.totalPages
            );

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to load transactions."
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        const loadInitialData = async () => {

            try {

                const [
                    accountsResponse,
                    transactionsResponse
                ] = await Promise.all([

                    accountApi.getMyAccounts(),

                    transactionApi.getTransactions({
                        page: 0
                    })

                ]);


                setAccounts(
                    accountsResponse.data
                );


                setTransactions(
                    transactionsResponse.data.content
                );


                setPage(
                    transactionsResponse.data.number
                );


                setTotalPages(
                    transactionsResponse.data.totalPages
                );

            } catch (error) {

                console.error(error);

                setInitialLoadError(
                    error.response?.data?.message ||
                    "Unable to load transactions."
                );

            } finally {

                setLoading(false);

            }

        };


        loadInitialData();

    }, []);


    const handleRetry = async () => {

        setLoading(true);
        setInitialLoadError("");

        try {

            const [
                accountsResponse,
                transactionsResponse
            ] = await Promise.all([

                accountApi.getMyAccounts(),

                transactionApi.getTransactions({
                    page: 0
                })

            ]);


            setAccounts(
                accountsResponse.data
            );


            setTransactions(
                transactionsResponse.data.content
            );


            setPage(
                transactionsResponse.data.number
            );


            setTotalPages(
                transactionsResponse.data.totalPages
            );

        } catch (error) {

            console.error(error);

            setInitialLoadError(
                error.response?.data?.message ||
                "Unable to load transactions."
            );

        } finally {

            setLoading(false);

        }

    };


    const buildFilters = () => {

        const filters = {};


        if (accountNumber) {

            filters.accountNumber =
                accountNumber;

        }


        if (from) {

            filters.from = from;

        }


        if (to) {

            filters.to = to;

        }


        if (direction) {

            filters.direction =
                direction;

        }


        return filters;

    };


    const handleApplyFilters = async (event) => {

        event.preventDefault();


        if (from && to && from > to) {

            setError(
                "From date cannot be after To date."
            );

            return;

        }


        await loadTransactions(
            buildFilters(),
            0
        );

    };



    const handleResetFilters = async () => {

        setAccountNumber("");
        setFrom("");
        setTo("");
        setDirection("");


        await loadTransactions(
            {},
            0
        );

    };

    const handlePageChange = async (
        pageNumber
    ) => {

        await loadTransactions(
            buildFilters(),
            pageNumber
        );

    };

    const formatCurrency = (amount) => {

        return Number(amount).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

    };

    const maskAccountNumber = (number) => {

        if (!number) {

            return "Unknown account";

        }


        return `•••• ${number.slice(-4)}`;

    };


    const formatDateGroup = (dateTime) => {

        return new Intl.DateTimeFormat(
            "en-IN",
            {
                timeZone: "Asia/Kolkata",
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        ).format(
            new Date(dateTime)
        );

    };


    const formatTime = (dateTime) => {

        return new Intl.DateTimeFormat(
            "en-IN",
            {
                timeZone: "Asia/Kolkata",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
            }
        ).format(
            new Date(dateTime)
        );

    };


    const getTransactionTitle = (
        transaction
    ) => {

        if (
            transaction.transactionType ===
            "TRANSFER"
        ) {

            return transaction.direction ===
                "DEBIT"
                ? "Transfer Sent"
                : "Transfer Received";

        }


        if (
            transaction.transactionType ===
            "DEPOSIT"
        ) {

            return "Deposit";

        }


        if (
            transaction.transactionType ===
            "WITHDRAW"
        ) {

            return "Withdrawal";

        }


        return transaction.transactionType;

    };

    const getTransactionParty = (
        transaction
    ) => {

        if (
            transaction.transactionType ===
            "TRANSFER"
        ) {

            return transaction.direction ===
                "DEBIT"

                ? `To ${maskAccountNumber(
                    transaction.destinationAccountNumber
                )}`

                : `From ${maskAccountNumber(
                    transaction.sourceAccountNumber
                )}`;

        }


        if (
            transaction.transactionType ===
            "DEPOSIT"
        ) {

            return `To ${maskAccountNumber(
                transaction.destinationAccountNumber
            )}`;

        }


        if (
            transaction.transactionType ===
            "WITHDRAW"
        ) {

            return `From ${maskAccountNumber(
                transaction.sourceAccountNumber
            )}`;

        }


        return "";

    };


    const groupedTransactions =
        transactions.reduce(
            (groups, transaction) => {

                const date =
                    formatDateGroup(
                        transaction.createdAt
                    );


                if (!groups[date]) {

                    groups[date] = [];

                }


                groups[date].push(
                    transaction
                );


                return groups;

            },
            {}
        );


   if (loading) {
            return (
                <LoadingScreen message="Loading your Transactions..." />
            );
        }


    if (initialLoadError) {

        return (

            <div className="transactions-page">

                <div className="transactions-error-card">

                    <h3>
                        Unable to load transactions
                    </h3>

                    <p>
                        {initialLoadError}
                    </p>

                    <button
                        type="button"
                        className="transaction-error-button"
                        onClick={handleRetry}
                    >
                        Try Again
                    </button>

                </div>

            </div>

        );

    }

    return (

        <div className="transactions-page">


            <section className="transactions-header">

                <div>

                    <p className="transactions-eyebrow">
                        BANKING ACTIVITY
                    </p>

                    <h1>
                        Transactions
                    </h1>

                    <p>
                        View and manage your transaction
                        history.
                    </p>

                </div>


                <div className="transactions">

                    <Link
                        to="/customer/transactions/transfer"
                        className="transaction-primary-button"
                    >
                        Transfer Money
                    </Link>


                    <Link
                        to="/customer/transactions/withdraw"
                        className="transaction-primary-button"
                    >
                        Withdraw Money
                    </Link>

                </div>

            </section>


            {error && (

                <div className="transactions-error">
                    {error}
                </div>

            )}


            <section className="transaction-filters">

                <div className="section-heading">

                    <div>

                        <p className="section-eyebrow">
                            FILTERS
                        </p>

                        <h2>
                            Transaction History
                        </h2>

                    </div>

                </div>


                <form
                    onSubmit={
                        handleApplyFilters
                    }
                >

                    <div className="filter-grid">

                        <div className="filter-field">

                            <label htmlFor="account">
                                Account
                            </label>

                            <select
                                id="account"
                                value={accountNumber}
                                onChange={(event) =>
                                    setAccountNumber(
                                        event.target.value
                                    )
                                }
                            >

                                <option value="">
                                    All Accounts
                                </option>


                                {accounts.map(
                                    (account) => (

                                        <option
                                            key={
                                                account.accountNumber
                                            }
                                            value={
                                                account.accountNumber
                                            }
                                        >

                                            {
                                                account.accountType
                                            }

                                            {" — "}

                                            {maskAccountNumber(
                                                account.accountNumber
                                            )}

                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        <div className="filter-field">

                            <label htmlFor="from">
                                From
                            </label>

                            <input
                                id="from"
                                type="date"
                                value={from}
                                onChange={(event) =>
                                    setFrom(
                                        event.target.value
                                    )
                                }
                            />

                        </div>


                        <div className="filter-field">

                            <label htmlFor="to">
                                To
                            </label>

                            <input
                                id="to"
                                type="date"
                                value={to}
                                onChange={(event) =>
                                    setTo(
                                        event.target.value
                                    )
                                }
                            />

                        </div>


                        <div className="filter-field">

                            <label htmlFor="direction">
                                Direction
                            </label>

                            <select
                                id="direction"
                                value={direction}
                                onChange={(event) =>
                                    setDirection(
                                        event.target.value
                                    )
                                }
                            >

                                <option value="">
                                    All Transactions
                                </option>

                                <option value="DEBIT">
                                    Debit
                                </option>

                                <option value="CREDIT">
                                    Credit
                                </option>

                            </select>

                        </div>

                    </div>

                    <div className="filter-actions">

                        <button
                            type="submit"
                            className="filter-apply-button"
                        >
                            Apply Filters
                        </button>


                        <button
                            type="button"
                            className="filter-reset-button"
                            onClick={
                                handleResetFilters
                            }
                        >
                            Reset
                        </button>

                    </div>

                </form>

            </section>


            <section className="transaction-history">

                {transactions.length === 0 ? (

                    <div className="transactions-empty">

                        <h3>
                            No transactions found
                        </h3>

                        <p>
                            There are no transactions
                            matching your selected filters.
                        </p>

                    </div>

                ) : (

                    Object.entries(
                        groupedTransactions
                    ).map(
                        (
                            [
                                date,
                                dateTransactions
                            ]
                        ) => (

                            <div
                                className="transaction-date-group"
                                key={date}
                            >


                                <div className="transaction-date-heading">
                                    {date}
                                </div>


                                <div className="transaction-list">

                                    {dateTransactions.map(
                                        (transaction) => {

                                            const isDebit =
                                                transaction.direction ===
                                                "DEBIT";


                                            const amountPrefix =
                                                isDebit
                                                    ? "- ₹"
                                                    : "+ ₹";


                                            return (

                                                <Link
                                                    to={`/customer/transactions/${transaction.transactionReference}`}
                                                    className="transaction-card"
                                                    key={
                                                        transaction.transactionReference
                                                    }
                                                >


                                                    <div
                                                        className={`transaction-direction-icon ${
                                                            isDebit
                                                                ? "debit"
                                                                : "credit"
                                                        }`}
                                                    >

                                                        {isDebit
                                                            ? "↓"
                                                            : "↑"}

                                                    </div>


                                                    <div className="transaction-main">


                                                        <div className="transaction-title-row">

                                                            <h3>
                                                                {
                                                                    getTransactionTitle(
                                                                        transaction
                                                                    )
                                                                }
                                                            </h3>


                                                            <span
                                                                className={`transaction-amount ${
                                                                    isDebit
                                                                        ? "debit"
                                                                        : "credit"
                                                                }`}
                                                            >

                                                                {amountPrefix}

                                                                {formatCurrency(
                                                                    transaction.amount
                                                                )}

                                                            </span>

                                                        </div>


                                                        <div className="transaction-details">


                                                            <span>
                                                                {
                                                                    getTransactionParty(
                                                                        transaction
                                                                    )
                                                                }
                                                            </span>


                                                            <span>
                                                                {
                                                                    formatTime(
                                                                        transaction.createdAt
                                                                    )
                                                                }
                                                            </span>


                                                            <span
                                                                className={`transaction-status ${
                                                                    transaction.status.toLowerCase()
                                                                }`}
                                                            >
                                                                {
                                                                    transaction.status
                                                                }
                                                            </span>


                                                            <span
                                                                className={`transaction-direction ${
                                                                    transaction.direction.toLowerCase()
                                                                }`}
                                                            >
                                                                {
                                                                    transaction.direction
                                                                }
                                                            </span>

                                                        </div>


                                                        {transaction.description && (

                                                            <p className="transaction-description">

                                                                {
                                                                    transaction.description
                                                                }

                                                            </p>

                                                        )}

                                                    </div>

                                                </Link>

                                            );

                                        }
                                    )}

                                </div>

                            </div>

                        )
                    )

                )}

            </section>



            {totalPages > 1 && (

                <div className="transaction-pagination">


                    <button
                        type="button"
                        disabled={page === 0}
                        onClick={() =>
                            handlePageChange(
                                page - 1
                            )
                        }
                    >
                        Previous
                    </button>


                    {Array.from(
                        { length: totalPages },
                        (_, index) => (

                            <button
                                type="button"
                                key={index}
                                className={
                                    page === index
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    handlePageChange(
                                        index
                                    )
                                }
                            >
                                {index + 1}
                            </button>

                        )
                    )}


                    <button
                        type="button"
                        disabled={
                            page === totalPages - 1
                        }
                        onClick={() =>
                            handlePageChange(
                                page + 1
                            )
                        }
                    >
                        Next
                    </button>

                </div>

            )}

        </div>

    );

}

export default Transactions;