import { useNavigate } from "react-router-dom";
import "../css/NotFound.css";

function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="not-found-page">
            <div className="not-found-card">
                <div className="not-found-code">404</div>

                <div className="not-found-icon">
                    <span>!</span>
                </div>

                <h1>Page Not Found</h1>

                <p className="not-found-message">
                    Sorry, we couldn't find the page you're looking for.
                    It may have been moved, removed, or the URL may be incorrect.
                </p>

                <div className="not-found-actions">
                    <button
                        className="not-found-primary"
                        onClick={() => navigate("/login")}
                    >
                        Go to Login
                    </button>

                    <button
                        className="not-found-secondary"
                        onClick={() => navigate(-1)}
                    >
                        Go Back
                    </button>
                </div>

                <div className="not-found-footer">
                    VISHNU BANK · Secure Digital Banking
                </div>
            </div>
        </div>
    );
}

export default NotFound;