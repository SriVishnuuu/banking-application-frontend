
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import accountApi from "../../api/accountApi";
import "../../css/Accounts.css";
import LoadingScreen from "../../components/common/LoadingScreen";

function Accounts() {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("ALL");

    const [balances, setBalances] = useState({});
    const [visibleBalances, setVisibleBalances] = useState({});
    const [balanceLoading, setBalanceLoading] = useState({});

    const fetchAccounts = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await accountApi.getMyAccounts();
            setAccounts(response.data);
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to load accounts."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadAccounts = async () => {
            try {
                const response = await accountApi.getMyAccounts();
                setAccounts(response.data);
            } catch (error) {
                console.error(error);

                setError(
                    error.response?.data?.message ||
                    "Unable to load accounts."
                );
            } finally {
                setLoading(false);
            }
        };

        loadAccounts();
    }, []);

    const getFilteredAccounts = () => {
        if (filter === "ALL") {
            return accounts;
        }

        return accounts.filter(
            (account) => account.accountType === filter
        );
    };

    const totalAccounts = accounts.length;

    const activeAccounts = accounts.filter(
        (account) => account.status === "ACTIVE"
    ).length;

    const inactiveAccounts = accounts.filter(
        (account) => account.status === "INACTIVE"
    ).length;

    const savingsAccounts = accounts.filter(
        (account) => account.accountType === "SAVINGS"
    ).length;

    const currentAccounts = accounts.filter(
        (account) => account.accountType === "CURRENT"
    ).length;

    const maskAccountNumber = (accountNumber) => {
        if (!accountNumber) {
            return "";
        }

        return `${accountNumber.slice(0, 4)} •••• •••• ${accountNumber.slice(-4)}`;
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

    const handleBalanceToggle = async (accountNumber) => {
        const currentlyVisible = visibleBalances[accountNumber];

        if (currentlyVisible) {
            setVisibleBalances((previous) => ({
                ...previous,
                [accountNumber]: false
            }));

            return;
        }

        if (balances[accountNumber] !== undefined) {
            setVisibleBalances((previous) => ({
                ...previous,
                [accountNumber]: true
            }));

            return;
        }

        try {
            setBalanceLoading((previous) => ({
                ...previous,
                [accountNumber]: true
            }));

            const response = await accountApi.getBalance(accountNumber);

            setBalances((previous) => ({
                ...previous,
                [accountNumber]: response.data.balance
            }));

            setVisibleBalances((previous) => ({
                ...previous,
                [accountNumber]: true
            }));
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to load account balance."
            );
        } finally {
            setBalanceLoading((previous) => ({
                ...previous,
                [accountNumber]: false
            }));
        }
    };

        if (loading) {
            return (
                <LoadingScreen message="Loading your Accounts..." />
            );
        }

    if (error && accounts.length === 0) {
        return (
            <div className="accounts-page">
                <div className="accounts-error">
                    <h3>Unable to load accounts</h3>
                    <p>{error}</p>

                    <button
                        type="button"
                        className="primary-button"
                        onClick={fetchAccounts}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const filteredAccounts = getFilteredAccounts();

    return (
        <div className="accounts-page">
            
            <section className="accounts-header">
                <div>
                    <p className="page-eyebrow">
                        BANKING
                    </p>

                    <h1>My Accounts</h1>

                    <p className="accounts-description">
                        View and manage all your VISHNU BANK accounts.
                    </p>
                </div>

                <Link
                    to="/customer/accounts/create"
                    className="primary-button"
                >
                    <span>+</span>
                    Open New Account
                </Link>
            </section>

          
            {error && accounts.length > 0 && (
                <div className="accounts-inline-error">
                    {error}
                </div>
            )}

            
            <section className="account-summary-grid">
                <div className="account-summary-card">
                    <div className="summary-icon">
                        #
                    </div>

                    <div>
                        <p>Total Accounts</p>
                        <h2>{totalAccounts}</h2>
                    </div>
                </div>

                <div className="account-summary-card">
                    <div className="summary-icon active-icon">
                        ✓
                    </div>

                    <div>
                        <p>Active Accounts</p>
                        <h2>{activeAccounts}</h2>
                    </div>
                </div>

                <div className="account-summary-card">
                    <div className="summary-icon inactive-icon">
                        ○
                    </div>

                    <div>
                        <p>Inactive Accounts</p>
                        <h2>{inactiveAccounts}</h2>
                    </div>
                </div>
            </section>

        
            <section className="accounts-section">
                <div className="accounts-section-header">
                    <div>
                        <p className="page-eyebrow">
                            YOUR ACCOUNTS
                        </p>

                        <h2>All Accounts</h2>
                    </div>

                    <div className="account-filters">
                        <button
                            type="button"
                            className={
                                filter === "ALL"
                                    ? "account-filter active"
                                    : "account-filter"
                            }
                            onClick={() => setFilter("ALL")}
                        >
                            All
                            <span>{totalAccounts}</span>
                        </button>

                        <button
                            type="button"
                            className={
                                filter === "SAVINGS"
                                    ? "account-filter active"
                                    : "account-filter"
                            }
                            onClick={() => setFilter("SAVINGS")}
                        >
                            Savings
                            <span>{savingsAccounts}</span>
                        </button>

                        <button
                            type="button"
                            className={
                                filter === "CURRENT"
                                    ? "account-filter active"
                                    : "account-filter"
                            }
                            onClick={() => setFilter("CURRENT")}
                        >
                            Current
                            <span>{currentAccounts}</span>
                        </button>
                    </div>
                </div>

                
                {filteredAccounts.length === 0 ? (
                    <div className="accounts-empty">
                        <div className="empty-account-icon">
                            +
                        </div>

                        <h3>No accounts found</h3>

                        <p>
                            You don't have any accounts in this category.
                        </p>

                        {filter !== "ALL" && (
                            <button
                                type="button"
                                className="secondary-button"
                                onClick={() => setFilter("ALL")}
                            >
                                View All Accounts
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="account-card-grid">
                        {filteredAccounts.map((account) => {
                            const accountNumber = account.accountNumber;
                            const isBalanceVisible =
                                Boolean(visibleBalances[accountNumber]);
                            const isBalanceLoading =
                                Boolean(balanceLoading[accountNumber]);

                            return (
                                <article
                                    className="account-card"
                                    key={accountNumber}
                                >
                                  
                                    <div className="account-card-header">
                                        <div>
                                            <p className="account-type">
                                                {account.accountType}
                                            </p>

                                            <p className="account-number">
                                                {maskAccountNumber(accountNumber)}
                                            </p>
                                        </div>

                                        <span
                                            className={`account-status ${account.status.toLowerCase()}`}
                                        >
                                            <span>●</span>
                                            {account.status}
                                        </span>
                                    </div>

                                  
                                    <div className="account-balance-section">
                                        <p>Available Balance</p>

                                        <div className="balance-row">
                                            <strong>
                                                {isBalanceVisible
                                                    ? `₹ ${formatCurrency(
                                                        balances[accountNumber]
                                                    )}`
                                                    : "₹ ••••••••"}
                                            </strong>

                                            <button
                                                type="button"
                                                className="balance-button"
                                                onClick={() =>
                                                    handleBalanceToggle(accountNumber)
                                                }
                                                disabled={isBalanceLoading}
                                                aria-label={
                                                    isBalanceLoading
                                                        ? "Loading balance"
                                                        : isBalanceVisible
                                                            ? "Hide balance"
                                                            : "View balance"
                                                }
                                                title={
                                                    isBalanceVisible
                                                        ? "Hide balance"
                                                        : "View balance"
                                                }
                                            >
                                                {isBalanceLoading ? (
                                                    <LoaderCircle
                                                        size={19}
                                                        strokeWidth={1.8}
                                                        className="balance-button-spinner"
                                                        aria-hidden="true"
                                                    />
                                                ) : isBalanceVisible ? (
                                                    <EyeOff
                                                        size={20}
                                                        strokeWidth={1.8}
                                                        aria-hidden="true"
                                                    />
                                                ) : (
                                                    <Eye
                                                        size={20}
                                                        strokeWidth={1.8}
                                                        aria-hidden="true"
                                                    />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                
                                    <div className="account-card-details">
                                        <div>
                                            <span>Branch</span>

                                            <strong>
                                                {account.branch?.branchCode || "-"}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>Opened</span>

                                            <strong>
                                                {formatDate(account.createdAt)}
                                            </strong>
                                        </div>
                                    </div>

                            
                                    <div className="account-card-footer">
                                        <span>
                                            {account.branch?.branchName ||
                                                "Branch information unavailable"}
                                        </span>

                                        <Link
                                            to={`/customer/accounts/${accountNumber}`}
                                            className="view-account-link"
                                        >
                                            View Account
                                            <span>→</span>
                                        </Link>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>


            {accounts.length > 0 && (
                <section className="accounts-bottom-cta">
                    <div>
                        <p className="page-eyebrow">
                            NEED ANOTHER ACCOUNT?
                        </p>

                        <h2>Open a new VISHNU BANK account</h2>

                        <p>
                            Choose between a Savings or Current account
                            based on your banking needs.
                        </p>
                    </div>

                    <Link
                        to="/customer/accounts/create"
                        className="secondary-button"
                    >
                        Open New Account
                    </Link>
                </section>
            )}
        </div>
    );
}

export default Accounts;
