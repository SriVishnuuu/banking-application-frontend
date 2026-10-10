import { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
    House,
    WalletCards,
    UsersRound,
    ArrowLeftRight,
    UserRound,
    LogOut,
    Menu,
    X,
    ChevronDown
} from "lucide-react";

import { useAuth } from "../../context/useAuth";
import authApi from "../../api/authApi";
import customerApi from "../../api/customerApi";
import "../../css/CustomerNavbar.css";

function CustomerNavbar() {

    const { logout } = useAuth();
    const navigate = useNavigate();

    const [profileOpen, setProfileOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [avatar, setAvatar] = useState("");

    const handleLogout = async () => {

        try {

            await authApi.logout();

        } catch (error) {

            console.error("Logout failed:", error);

        } finally {

            logout();

            navigate("/login");

        }

    };


    useEffect(() => {

        const loadCustomerName = async () => {

            try {

                const response =
                    await customerApi.getProfile();

                const firstName =
                    response.data.firstName;

                setAvatar(
                    firstName
                        ? firstName.charAt(0).toUpperCase()
                        : "?"
                );

            } catch (error) {

                console.error(error);

            }

        };

        loadCustomerName();

    }, []);


    const navLinkClass = ({ isActive }) =>
        isActive
            ? "customer-nav-link active"
            : "customer-nav-link";


    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };


    const handleMobileLogout = async () => {

        closeMobileMenu();

        await handleLogout();

    };


    return (

        <header className="customer-navbar">

            <div className="customer-navbar-container">


                {/* ================= BRAND ================= */}

                <Link
                    to="/customer/dashboard"
                    className="customer-brand"
                    onClick={closeMobileMenu}
                >

                    <div className="customer-brand-mark">
                        V
                    </div>

                    <div className="customer-brand-name">
                        VISHNU <span>BANK</span>
                    </div>

                </Link>


                {/* ================= DESKTOP / TABLET NAVIGATION ================= */}

                <nav className="customer-navigation">

                    <NavLink
                        to="/customer/dashboard"
                        className={navLinkClass}
                        title="Dashboard"
                    >

                        <House className="nav-icon" />

                        <span className="nav-label">
                            Dashboard
                        </span>

                    </NavLink>


                    <NavLink
                        to="/customer/accounts"
                        className={navLinkClass}
                        title="Accounts"
                    >

                        <WalletCards className="nav-icon" />

                        <span className="nav-label">
                            Accounts
                        </span>

                    </NavLink>


                    <NavLink
                        to="/customer/beneficiaries"
                        className={navLinkClass}
                        title="Beneficiaries"
                    >

                        <UsersRound className="nav-icon" />

                        <span className="nav-label">
                            Beneficiaries
                        </span>

                    </NavLink>


                    <NavLink
                        to="/customer/transactions"
                        className={navLinkClass}
                        title="Transactions"
                    >

                        <ArrowLeftRight className="nav-icon" />

                        <span className="nav-label">
                            Transactions
                        </span>

                    </NavLink>

                </nav>


                {/* ================= PROFILE ================= */}

                <div className="profile-container">

                    <button
                        type="button"
                        className="profile-trigger"
                        onClick={() =>
                            setProfileOpen(
                                (previous) => !previous
                            )
                        }
                        aria-expanded={profileOpen}
                        aria-label="Open profile menu"
                    >

                        <span className="profile-avatar">
                            {avatar || "?"}
                        </span>

                        <span className="profile-label">
                            Profile
                        </span>

                        <ChevronDown
                            className={`profile-chevron ${
                                profileOpen
                                    ? "open"
                                    : ""
                            }`}
                        />

                    </button>


                    {profileOpen && (

                        <div className="profile-dropdown">

                            <Link
                                to="/customer/profile"
                                className="profile-dropdown-item"
                                onClick={() =>
                                    setProfileOpen(false)
                                }
                            >

                                <UserRound className="dropdown-icon" />

                                <span>
                                    Profile
                                </span>

                            </Link>


                            <div className="dropdown-divider" />


                            <button
                                type="button"
                                className="profile-dropdown-item logout-item"
                                onClick={handleLogout}
                            >

                                <LogOut className="dropdown-icon" />

                                <span>
                                    Logout
                                </span>

                            </button>

                        </div>

                    )}

                </div>


                {/* ================= MOBILE MENU BUTTON ================= */}

                <button
                    type="button"
                    className="mobile-menu-button"
                    onClick={() =>
                        setMobileMenuOpen(
                            (previous) => !previous
                        )
                    }
                    aria-label={
                        mobileMenuOpen
                            ? "Close navigation menu"
                            : "Open navigation menu"
                    }
                    aria-expanded={mobileMenuOpen}
                >

                    {mobileMenuOpen ? (
                        <X />
                    ) : (
                        <Menu />
                    )}

                </button>

            </div>


            {/* ================= MOBILE MENU ================= */}

            {mobileMenuOpen && (

                <div className="mobile-navigation">

                    <div className="mobile-navigation-header">

                        <div>
                            <p>
                                VISHNU BANK
                            </p>

                            <span>
                                Banking Menu
                            </span>
                        </div>

                        <button
                            type="button"
                            className="mobile-close-button"
                            onClick={closeMobileMenu}
                            aria-label="Close menu"
                        >
                            <X />
                        </button>

                    </div>


                    <nav className="mobile-navigation-links">


                        <NavLink
                            to="/customer/dashboard"
                            className={navLinkClass}
                            onClick={closeMobileMenu}
                        >

                            <House className="mobile-nav-icon" />

                            <span>
                                Dashboard
                            </span>

                        </NavLink>


                        <NavLink
                            to="/customer/accounts"
                            className={navLinkClass}
                            onClick={closeMobileMenu}
                        >

                            <WalletCards className="mobile-nav-icon" />

                            <span>
                                Accounts
                            </span>

                        </NavLink>


                        <NavLink
                            to="/customer/beneficiaries"
                            className={navLinkClass}
                            onClick={closeMobileMenu}
                        >

                            <UsersRound className="mobile-nav-icon" />

                            <span>
                                Beneficiaries
                            </span>

                        </NavLink>


                        <NavLink
                            to="/customer/transactions"
                            className={navLinkClass}
                            onClick={closeMobileMenu}
                        >

                            <ArrowLeftRight className="mobile-nav-icon" />

                            <span>
                                Transactions
                            </span>

                        </NavLink>


                        <NavLink
                            to="/customer/profile"
                            className={navLinkClass}
                            onClick={closeMobileMenu}
                        >

                            <UserRound className="mobile-nav-icon" />

                            <span>
                                Profile
                            </span>

                        </NavLink>

                    </nav>


                    <div className="mobile-menu-divider" />


                    <button
                        type="button"
                        className="mobile-logout-button"
                        onClick={handleMobileLogout}
                    >

                        <LogOut />

                        <span>
                            Logout
                        </span>

                    </button>

                </div>

            )}

        </header>

    );
}

export default CustomerNavbar;