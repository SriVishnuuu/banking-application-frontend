
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../../api/authApi";
import "../../css/auth/ForgotPassword.css";

function ForgotPassword() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [emailError, setEmailError] = useState("");
    const [error, setError] = useState("");

    const validateForm = () => {
        const trimmedEmail = email.trim();

        if (!trimmedEmail) {
            setEmailError("Email address is required.");
            return false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
            setEmailError("Enter a valid email address.");
            return false;
        }

        setEmailError("");
        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setMessage("");
        setError("");

        const isValid = validateForm();

        if (!isValid) {
            return;
        }

        try {
            setLoading(true);

            await authApi.forgotPassword({
                email: email.trim(),
            });

            setMessage(
                "If an account exists for this email, password reset instructions have been sent."
            );
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to process your request. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password-page">

            <div className="forgot-password-container">

                <div className="forgot-password-brand">
                    <div className="forgot-password-brand-icon">
                        V
                    </div>

                    <div>
                        <h1>VISHNU BANK</h1>
                        <p>Secure Digital Banking</p>
                    </div>
                </div>

                <div className="forgot-password-card">

                    <div className="forgot-password-header">
                        <p className="forgot-password-eyebrow">
                            ACCOUNT RECOVERY
                        </p>

                        <h2>Forgot your password?</h2>

                        <p>
                            Enter your registered email address and
                            we'll send you instructions to reset your
                            password.
                        </p>
                    </div>

                    {message && (
                        <div className="forgot-password-message success">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="forgot-password-message error">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>

                        <div className="forgot-password-field">
                            <label htmlFor="forgot-email">
                                Email Address
                            </label>

                            <input
                                id="forgot-email"
                                type="email"
                                value={email}
                                onChange={(event) => {
                                    setEmail(event.target.value);
                                    setEmailError("");
                                }}
                                onBlur={validateForm}
                                placeholder="Enter your email"
                                autoComplete="email"
                                required
                                disabled={loading}
                                className={emailError ? "input-error" : ""}
                            />

                            {emailError && (
                                <p className="field-error">
                                    {emailError}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="forgot-password-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Sending..."
                                : "Send Reset Instructions"}
                        </button>

                    </form>

                    <div className="forgot-password-footer">
                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                        >
                            ← Back to Login
                        </button>
                    </div>

                </div>

                <p className="forgot-password-security-note">
                    Your account information is securely protected.
                </p>

            </div>

        </div>
    );
}

export default ForgotPassword;