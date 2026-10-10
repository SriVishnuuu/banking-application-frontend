import { NavLink, Link } from "react-router-dom";
import { useState } from "react";
import {
    LayoutDashboard,
    Users,
    WalletCards,
    Building2,
    ArrowLeftRight,
    ClipboardList,
    LogOut,
    Menu,
    X,
    ShieldCheck
} from "lucide-react";

import { useAuth } from "../../context/useAuth";
import authApi from "../../api/authApi";
import "../../css/admin/AdminSidebar.css";

function AdminSidebar() {

    const { logout } = useAuth();

    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await authApi.logout();
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            logout();
            window.location.href = "/login";
        }
    };

    const closeMobileMenu = () => {
        setMobileOpen(false);
    };

    const navLinkClass = ({ isActive }) =>
        isActive
            ? "admin-nav-link active"
            : "admin-nav-link";

    return (
        <>
            {/* Mobile menu button */}
            <button
                className="admin-mobile-menu-button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open admin menu"
            >
                <Menu size={21} strokeWidth={2} />
            </button>

            {/* Overlay */}
            {mobileOpen && (
                <div
                    className="admin-sidebar-overlay"
                    onClick={closeMobileMenu}
                />
            )}

            <aside
                className={`admin-sidebar ${
                    mobileOpen ? "mobile-open" : ""
                }`}
            >

                {/* Brand */}
                <div className="admin-sidebar-brand">

                    <Link
                        to="/admin/dashboard"
                        className="admin-brand"
                        onClick={closeMobileMenu}
                    >
                        <div className="admin-brand-mark">
                            V
                        </div>

                        <div className="admin-brand-text">
                            <div className="admin-brand-name">
                                VISHNU <span>BANK</span>
                            </div>

                            <div className="admin-brand-subtitle">
                                ADMIN PORTAL
                            </div>
                        </div>
                    </Link>

                    {/* Mobile close */}
                    <button
                        className="admin-sidebar-close"
                        onClick={closeMobileMenu}
                        aria-label="Close admin menu"
                    >
                        <X size={19} strokeWidth={2} />
                    </button>

                </div>


                {/* Navigation */}
                <nav className="admin-navigation">

                    <NavLink
                        to="/admin/dashboard"
                        className={navLinkClass}
                        onClick={closeMobileMenu}
                    >
                        <LayoutDashboard
                            className="admin-nav-icon"
                            size={18}
                            strokeWidth={1.9}
                        />
                        <span>Dashboard</span>
                    </NavLink>


                    <NavLink
                        to="/admin/customers"
                        className={navLinkClass}
                        onClick={closeMobileMenu}
                    >
                        <Users
                            className="admin-nav-icon"
                            size={18}
                            strokeWidth={1.9}
                        />
                        <span>Customers</span>
                    </NavLink>


                    <NavLink
                        to="/admin/accounts"
                        className={navLinkClass}
                        onClick={closeMobileMenu}
                    >
                        <WalletCards
                            className="admin-nav-icon"
                            size={18}
                            strokeWidth={1.9}
                        />
                        <span>Accounts</span>
                    </NavLink>


                    <NavLink
                        to="/admin/branches"
                        className={navLinkClass}
                        onClick={closeMobileMenu}
                    >
                        <Building2
                            className="admin-nav-icon"
                            size={18}
                            strokeWidth={1.9}
                        />
                        <span>Branches</span>
                    </NavLink>


                    <NavLink
                        to="/admin/transactions"
                        className={navLinkClass}
                        onClick={closeMobileMenu}
                    >
                        <ArrowLeftRight
                            className="admin-nav-icon"
                            size={18}
                            strokeWidth={1.9}
                        />
                        <span>Transactions</span>
                    </NavLink>


                    <NavLink
                        to="/admin/audit-logs"
                        className={navLinkClass}
                        onClick={closeMobileMenu}
                    >
                        <ClipboardList
                            className="admin-nav-icon"
                            size={18}
                            strokeWidth={1.9}
                        />
                        <span>Audit Logs</span>
                    </NavLink>

                </nav>


                {/* Bottom section */}
                <div className="admin-sidebar-bottom">

                    <div className="admin-user-info">

                        <div className="admin-user-avatar">
                            <ShieldCheck
                                size={17}
                                strokeWidth={1.9}
                            />
                        </div>

                        <div className="admin-user-details">

                            <span className="admin-user-name">
                                Administrator
                            </span>

                            <span className="admin-user-role">
                                System Administrator
                            </span>

                        </div>

                    </div>


                    <button
                        className="admin-logout-button"
                        onClick={handleLogout}
                    >
                        <LogOut
                            className="admin-nav-icon"
                            size={17}
                            strokeWidth={1.9}
                        />

                        <span>Logout</span>
                    </button>

                </div>

            </aside>
        </>
    );
}

export default AdminSidebar;