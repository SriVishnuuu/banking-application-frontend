
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    UserRound,
    WalletCards,
    ArrowLeftRight,
    UsersRound,
    LockKeyhole,
    ArrowRight,
    Eye,
    EyeOff
} from "lucide-react";

import customerApi from "../../api/customerApi";
import accountApi from "../../api/accountApi";
import transactionApi from "../../api/transactionApi";
import "../../css/CustomerDashboard.css";
import LoadingScreen from "../../components/common/LoadingScreen";

function CustomerDashboard() {
    const [profile, setProfile] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [balances, setBalances] = useState({});
    const [todayTransactions, setTodayTransactions] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [isNewCustomer, setIsNewCustomer] = useState(false);
    const [showBalance, setShowBalance] = useState(false);

    const getToday = () => {
        const today = new Date();

        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        let isMounted = true;

        const loadDashboard = async () => {
            try {
                if (isMounted) {
                    setLoading(true);
                    setError("");
                }

                let profileResponse;

                try {
                    profileResponse = await customerApi.getProfile();
                } catch (profileError) {
                    if (profileError.response?.status === 404) {
                        if (isMounted) {
                            setIsNewCustomer(true);
                            setProfile(null);
                            setLoading(false);
                        }

                        return;
                    }

                    throw profileError;
                }

                if (!isMounted) {
                    return;
                }

                setIsNewCustomer(false);

                const profileData = profileResponse.data;
                setProfile(profileData);

                const [
                    accountsResponse,
                    transactionsResponse
                ] = await Promise.all([
                    accountApi.getMyAccounts(),
                    transactionApi.getTransactions({
                        page: 0,
                        from: getToday(),
                        to: getToday()
                    })
                ]);

                if (!isMounted) {
                    return;
                }

                setAccounts(accountsResponse.data);

                setTodayTransactions(
                    transactionsResponse.data.content.slice(0, 5)
                );

                // Load balances for all customer accounts.
                const balanceResponses = await Promise.all(
                    accountsResponse.data.map((account) =>
                        accountApi.getBalance(account.accountNumber)
                    )
                );

                if (!isMounted) {
                    return;
                }

                const balanceMap = {};

                accountsResponse.data.forEach((account, index) => {
                    balanceMap[account.accountNumber] =
                        balanceResponses[index].data.balance;
                });

                setBalances(balanceMap);
            } catch (error) {
                console.error(error);

                if (isMounted) {
                    setError(
                        error.response?.data?.message ||
                        "Unable to load dashboard."
                    );
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadDashboard();

        return () => {
            isMounted = false;
        };
    }, []);

    const getTotalBalance = () => {
        return accounts.reduce((total, account) => {
            const balance = Number(
                balances[account.accountNumber] || 0
            );

            return total + balance;
        }, 0);
    };

    const formatCurrency = (amount) => {
        return Number(amount).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const getFirstName = () => {
        if (!profile?.firstName) {
            return "Customer";
        }

        return profile.firstName;
    };

    const maskAccountNumber = (accountNumber) => {
        if (!accountNumber) {
            return "";
        }

        return `•••• ${accountNumber.slice(-4)}`;
    };

    const formatTransactionTime = (createdAt) => {
        return new Date(createdAt).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const formatTransactionAmount = (transaction) => {
        const amount = formatCurrency(transaction.amount);

        return transaction.direction === "DEBIT"
            ? `- ₹ ${amount}`
            : `+ ₹ ${amount}`;
    };

    const getTransactionTitle = (transaction) => {
        if (transaction.transactionType === "TRANSFER") {
            return transaction.direction === "DEBIT"
                ? "Transfer Money"
                : "Money Received";
        }

        if (transaction.transactionType === "WITHDRAW") {
            return "Cash Withdrawal";
        }

        if (transaction.transactionType === "DEPOSIT") {
            return "Money Deposited";
        }

        return "Transaction";
    };

    const getTransactionAccountText = (transaction) => {
        if (transaction.transactionType === "TRANSFER") {
            if (transaction.direction === "DEBIT") {
                return `${maskAccountNumber(
                    transaction.sourceAccountNumber
                )} → ${maskAccountNumber(
                    transaction.destinationAccountNumber
                )}`;
            }

            return `From ${maskAccountNumber(
                transaction.sourceAccountNumber
            )}`;
        }

        return maskAccountNumber(
            transaction.sourceAccountNumber ||
            transaction.destinationAccountNumber
        );
    };



    if (loading) {
    return (
        <LoadingScreen message="Loading your dashboard..." />
    );
}

   

    if (isNewCustomer) {
        return (
            <div className="customer-dashboard new-customer-dashboard">
                {/* Welcome Hero */}
                <section className="new-customer-hero">
                    <div className="new-customer-hero-content">
                        <p className="dashboard-eyebrow">
                            WELCOME TO VISHNU BANK
                        </p>

                        <h1>Welcome to VISHNU BANK!</h1>

                        <p className="new-customer-hero-description">
                            Your banking journey starts here.
                            Complete your profile to get started
                            with your VISHNU BANK account.
                        </p>

                        <Link
                            to="/customer/profile"
                            className="new-customer-primary-btn"
                        >
                            <UserRound />

                            <span>Complete My Profile</span>

                            <ArrowRight />
                        </Link>
                    </div>

                    <div className="new-customer-hero-icon">
                        <div className="hero-bank-symbol">
                            V
                        </div>
                    </div>
                </section>

                <section className="dashboard-section">
                    <div className="section-heading">
                        <div>
                            <p className="section-eyebrow">
                                GET STARTED
                            </p>

                            <h2>Start Your Banking Journey</h2>

                            <p className="section-description">
                                Complete these steps to start
                                using your banking services.
                            </p>
                        </div>
                    </div>

                    <div className="onboarding-grid">
                        {/* Step 1 */}
                        <div className="onboarding-card active">
                            <div className="onboarding-card-top">
                                <div className="onboarding-step-number">
                                    01
                                </div>

                                <div className="onboarding-status">
                                    <span className="onboarding-status-dot" />
                                    Start Here
                                </div>
                            </div>

                            <div className="onboarding-icon">
                                <UserRound />
                            </div>

                            <h3>Complete Your Profile</h3>

                            <p>
                                Add your personal information
                                to complete your customer profile.
                            </p>

                            <Link
                                to="/customer/profile"
                                className="onboarding-link"
                            >
                                Complete Profile
                                <ArrowRight />
                            </Link>
                        </div>

                        <div className="onboarding-card locked">
                            <div className="onboarding-card-top">
                                <div className="onboarding-step-number">
                                    02
                                </div>

                                <div className="onboarding-status locked-status">
                                    <LockKeyhole />
                                    Locked
                                </div>
                            </div>

                            <div className="onboarding-icon">
                                <WalletCards />
                            </div>

                            <h3>Open Your Account</h3>

                            <p>
                                Choose your account type and
                                preferred branch to open an account.
                            </p>

                            <span className="onboarding-disabled-link">
                                Complete profile first
                                <LockKeyhole />
                            </span>
                        </div>
                    </div>
                </section>

                <section className="dashboard-section">
                    <div className="section-heading">
                        <div>
                            <p className="section-eyebrow">
                                VISHNU BANK
                            </p>

                            <h2>Banking Services</h2>

                            <p className="section-description">
                                Everything you need for your
                                everyday banking.
                            </p>
                        </div>
                    </div>

                    <div className="new-customer-services">
                        <div className="service-info-card">
                            <div className="service-info-icon">
                                <WalletCards />
                            </div>

                            <div>
                                <h3>Bank Accounts</h3>

                                <p>
                                    Open and manage your
                                    savings or current account.
                                </p>
                            </div>
                        </div>

                        <div className="service-info-card">
                            <div className="service-info-icon">
                                <ArrowLeftRight />
                            </div>

                            <div>
                                <h3>Money Transfers</h3>

                                <p>
                                    Transfer money securely
                                    to your beneficiaries.
                                </p>
                            </div>
                        </div>

                        <div className="service-info-card">
                            <div className="service-info-icon">
                                <UsersRound />
                            </div>

                            <div>
                                <h3>Beneficiaries</h3>

                                <p>
                                    Manage the people and
                                    accounts you transfer money to.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }


    if (error) {
        return (
            <div className="customer-dashboard">
                <div className="dashboard-error">
                    <h3>Unable to load dashboard</h3>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    const totalBalance = getTotalBalance();

    return (
        <div className="customer-dashboard">
            <section className="dashboard-welcome">
                <div>
                    <p className="dashboard-eyebrow">
                        CUSTOMER DASHBOARD
                    </p>

                    <h1>Welcome back, {getFirstName()}!</h1>

                    <p>
                        Here's an overview of your banking
                        activity.
                    </p>
                </div>
            </section>

            <section className="balance-overview">
                <div className="balance-header">
                    <div>
                        <p className="balance-label">
                            Total Balance
                        </p>

                        <h2>
                            {showBalance
                                ? `₹ ${formatCurrency(totalBalance)}`
                                : "₹ ••••••••"}
                        </h2>
                    </div>

                    <button
                        type="button"
                        className="balance-toggle"
                        onClick={() =>
                            setShowBalance((previous) => !previous)
                        }
                        aria-label={
                            showBalance
                                ? "Hide total balance"
                                : "View total balance"
                        }
                        title={
                            showBalance
                                ? "Hide balance"
                                : "View balance"
                        }
                    >
                        {showBalance ? (
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

                <p className="balance-description">
                    Combined balance across all your
                    active accounts.
                </p>
            </section>

            <section className="dashboard-section">
                <div className="section-heading">
                    <div>
                        <p className="section-eyebrow">
                            ACCOUNTS
                        </p>

                        <h2>My Accounts</h2>
                    </div>
                </div>

                {accounts.length === 0 ? (
                    <div className="dashboard-empty">
                        <h3>No accounts yet</h3>

                        <p>
                            You currently don't have
                            any bank accounts.
                        </p>

                        <Link
                            to="/customer/accounts/create"
                            className="dashboard-empty-link"
                        >
                            Open New Account
                            <ArrowRight />
                        </Link>
                    </div>
                ) : (
                    <div className="dashboard-account-grid">
                        {accounts.map((account) => (
                            <div
                                className="dashboard-account-card"
                                key={account.accountNumber}
                            >
                                <div className="account-card-top">
                                    <div>
                                        <p className="account-type">
                                            {account.accountType}
                                        </p>

                                        <p className="account-number">
                                            {account.accountNumber}
                                        </p>
                                    </div>

                                    <span
                                        className={`account-status ${account.status.toLowerCase()}`}
                                    >
                                        {account.status}
                                    </span>
                                </div>

                                <div className="account-card-bottom">
                                    <div>
                                        <p className="account-balance-label">
                                            Available Balance
                                        </p>

                                        <p className="account-balance">
                                            {showBalance
                                                ? `₹ ${formatCurrency(
                                                    balances[account.accountNumber] || 0
                                                )}`
                                                : "₹ ••••••"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section className="dashboard-section">
                <div className="section-heading">
                    <div>
                        <p className="section-eyebrow">
                            SHORTCUTS
                        </p>

                        <h2>Quick Actions</h2>

                        <p className="section-description">
                            Access your most frequently
                            used banking services.
                        </p>
                    </div>
                </div>

                <div className="quick-actions-grid">
                    <Link
                        to="/customer/transactions/transfer"
                        className="quick-action-card"
                    >
                        <div className="quick-action-icon">
                            <ArrowLeftRight />
                        </div>

                        <div>
                            <h3>Transfer Money</h3>

                            <p>
                                Send money to a beneficiary.
                            </p>
                        </div>
                    </Link>

                    <Link
                        to="/customer/transactions/withdraw"
                        className="quick-action-card"
                    >
                        <div className="quick-action-icon">
                            ↓
                        </div>

                        <div>
                            <h3>Withdraw Money</h3>

                            <p>
                                Withdraw money from your
                                account.
                            </p>
                        </div>
                    </Link>

                    <Link
                        to="/customer/accounts"
                        className="quick-action-card"
                    >
                        <div className="quick-action-icon">
                            <WalletCards />
                        </div>

                        <div>
                            <h3>My Accounts</h3>

                            <p>
                                Manage your bank accounts.
                            </p>
                        </div>
                    </Link>

                    <Link
                        to="/customer/beneficiaries"
                        className="quick-action-card"
                    >
                        <div className="quick-action-icon">
                            <UsersRound />
                        </div>

                        <div>
                            <h3>Beneficiaries</h3>

                            <p>
                                Manage your saved
                                beneficiaries.
                            </p>
                        </div>
                    </Link>
                </div>
            </section>

            <section className="dashboard-section">
                <div className="section-heading activity-heading">
                    <div>
                        <p className="section-eyebrow">
                            TODAY
                        </p>

                        <h2>Today's Activity</h2>

                        <p className="section-description">
                            Your latest banking activity
                            for today.
                        </p>
                    </div>

                    <Link
                        to="/customer/transactions"
                        className="activity-view-all"
                    >
                        View All →
                    </Link>
                </div>

                {todayTransactions.length === 0 ? (
                    <div className="dashboard-empty">
                        <h3>No activity today</h3>

                        <p>
                            You haven't made any
                            transactions today.
                        </p>
                    </div>
                ) : (
                    <div className="activity-card">
                        {todayTransactions.map((transaction) => (
                            <Link
                                key={transaction.transactionReference}
                                to={`/customer/transactions/${transaction.transactionReference}`}
                                className="activity-item"
                            >
                                <div
                                    className={`activity-icon ${
                                        transaction.direction === "DEBIT"
                                            ? "debit"
                                            : "credit"
                                    }`}
                                >
                                    {transaction.direction === "DEBIT"
                                        ? "↓"
                                        : "↑"}
                                </div>

                                <div className="activity-main">
                                    <h3>
                                        {getTransactionTitle(transaction)}
                                    </h3>

                                    <p>
                                        {getTransactionAccountText(transaction)}
                                    </p>
                                </div>

                                <div className="activity-right">
                                    <strong
                                        className={
                                            transaction.direction === "DEBIT"
                                                ? "activity-debit"
                                                : "activity-credit"
                                        }
                                    >
                                        {formatTransactionAmount(transaction)}
                                    </strong>

                                    <span>
                                        {formatTransactionTime(
                                            transaction.createdAt
                                        )}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default CustomerDashboard;
