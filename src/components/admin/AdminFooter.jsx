import "../../css/admin/AdminFooter.css";

function AdminFooter() {
    return (
        <footer className="admin-footer">
            <div className="admin-footer-left">
                <span className="admin-footer-brand">
                    VISHNU BANK
                </span>

                <span className="admin-footer-divider">
                    |
                </span>

                <span>
                    Admin Portal
                </span>
            </div>

            <div className="admin-footer-right">
                <span>
                    © 2026 VISHNU BANK
                </span>

                <span className="admin-footer-security">
                    Secure Banking Administration
                </span>
            </div>
        </footer>
    );
}

export default AdminFooter;