import { ArrowLeft, ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../css/Unauthorized.css";

function Unauthorized() {
    const navigate = useNavigate();

    return (
        <main className="unauthorized-page">
            <div className="unauthorized-content">
                <div className="unauthorized-icon">
                    <ShieldAlert size={42} strokeWidth={1.4} />
                </div>

                <span className="unauthorized-code">403</span>

                <h1>Access Denied</h1>

                <p>
                    You do not have permission to access this page.
                    Please return to the previous page.
                </p>

                <button
                    type="button"
                    className="unauthorized-back-button"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft size={18} />
                    Go Back
                </button>

                <span className="unauthorized-brand">
                    VISHNU BANK
                </span>
            </div>
        </main>
    );
}

export default Unauthorized;