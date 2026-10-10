import { Link } from "react-router-dom";
import "../../css/CustomerFooter.css";

function CustomerFooter() {

    return (
        <footer className="customer-footer">

            <div className="customer-footer-container">

                {/* Brand */}

                <div className="footer-brand-section">

                    <Link
                        to="/customer/dashboard"
                        className="footer-brand"
                    >
                        <div className="footer-brand-mark">
                            V
                        </div>

                        <div>
                            <h2>
                                VISHNU <span>BANK</span>
                            </h2>

                            <p>
                                Secure Digital Banking
                            </p>
                        </div>
                    </Link>

                    <p className="footer-description">
                        Manage your banking securely with
                        simple and reliable digital banking.
                    </p>

                    <p className="footer-security">
                        🔒 Your banking information is protected.
                    </p>

                </div>


                {/* Quick Links */}

                <div className="footer-links-section">

                    <h3>
                        Quick Links
                    </h3>

                    <Link to="/customer/dashboard">
                        Dashboard
                    </Link>

                    <Link to="/customer/accounts">
                        Accounts
                    </Link>

                    <Link to="/customer/beneficiaries">
                        Beneficiaries
                    </Link>

                    <Link to="/customer/transactions">
                        Transactions
                    </Link>

                </div>


                {/* Support */}

                <div className="footer-links-section">

                    <h3>
                        Support
                    </h3>

                    <Link to="/customer/profile">
                        My Profile
                    </Link>

                    <span>
                        Help Center
                    </span>

                    <span>
                        Contact Us
                    </span>

                    <span>
                        Security
                    </span>

                </div>

            </div>


            {/* Bottom Bar */}

            <div className="customer-footer-bottom">

                <div className="customer-footer-bottom-container">

                    <p>
                        © 2026 VISHNU BANK. All rights reserved.
                    </p>

                    <div className="footer-legal-links">

                        <span>
                            Privacy Policy
                        </span>

                        <span className="footer-dot">
                            •
                        </span>

                        <span>
                            Terms of Service
                        </span>

                        <span className="footer-dot">
                            •
                        </span>

                        <span>
                            Security
                        </span>

                    </div>

                </div>

            </div>

        </footer>
    );
}

export default CustomerFooter;