import { useLocation } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import "../../css/admin/AdminHeader.css";

function AdminHeader() {

    const location = useLocation();

    const getPageInfo = () => {

        if (location.pathname.includes("/customers")) {
            return {
                title: "Customers",
                description: "Manage customer accounts and status"
            };
        }

        if (location.pathname.includes("/accounts")) {
            return {
                title: "Accounts",
                description: "Manage customer bank accounts"
            };
        }

        if (location.pathname.includes("/branches")) {
            return {
                title: "Branches",
                description: "Manage bank branches and branch status"
            };
        }

        if (location.pathname.includes("/transactions")) {
            return {
                title: "Transactions",
                description: "View and monitor banking transactions"
            };
        }

        if (location.pathname.includes("/audit-logs")) {
            return {
                title: "Audit Logs",
                description: "Review administrative activity"
            };
        }

        return {
            title: "Dashboard",
            description: "Overview of banking operations"
        };
    };

    const pageInfo = getPageInfo();

    return (
        <header className="admin-header">

            <div className="admin-header-content">

                <div className="admin-header-title">

                    <p className="admin-header-eyebrow">
                        ADMIN PORTAL
                    </p>

                    <h1>
                        {pageInfo.title}
                    </h1>

                    <p className="admin-header-description">
                        {pageInfo.description}
                    </p>

                </div>

                <div className="admin-header-profile">

                    <div className="admin-header-avatar">
                        <ShieldCheck
                            size={18}
                            strokeWidth={1.9}
                        />
                    </div>

                    <div className="admin-header-user">

                        <span className="admin-header-user-name">
                            Administrator
                        </span>

                        <span className="admin-header-user-role">
                            System Administrator
                        </span>

                    </div>

                </div>

            </div>

        </header>
    );
}

export default AdminHeader;