import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import authApi from "../../api/authApi";
import "../../css/auth/ResetPassword.css";

function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const token = searchParams.get("token");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [newPasswordError, setNewPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const validateForm = () => {
        let isValid = true;

        setNewPasswordError("");
        setConfirmPasswordError("");

        if (!newPassword) {
            setNewPasswordError("New password is required.");
            isValid = false;
        } else if (
            newPassword.length < 8 ||
            newPassword.length > 20
        ) {
            setNewPasswordError(
                "Password must be between 8 and 20 characters."
            );
            isValid = false;
        }

        if (!confirmPassword) {
            setConfirmPasswordError(
                "Please confirm your new password."
            );
            isValid = false;
        } else if (newPassword !== confirmPassword) {
            setConfirmPasswordError(
                "Passwords do not match."
            );
            isValid = false;
        }

        return isValid;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!token) {
            setError(
                "This password reset link is invalid or incomplete."
            );
            return;
        }

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);

            await authApi.resetPassword({
                token,
                newPassword
            });

            setSuccess(
                "Your password has been reset successfully."
            );

            setNewPassword("");
            setConfirmPassword("");

            setNewPasswordError("");
            setConfirmPasswordError("");

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Unable to reset your password. The link may be invalid or expired."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-password-page">

            <div className="reset-password-container">

                <div className="reset-password-brand">
                    <div className="reset-password-brand-icon">
                        V
                    </div>

                    <div>
                        <h1>VISHNU BANK</h1>
                        <p>Secure Digital Banking</p>
                    </div>
                </div>

                <div className="reset-password-card">

                    <div className="reset-password-header">
                        <p className="reset-password-eyebrow">
                            ACCOUNT RECOVERY
                        </p>

                        <h2>Reset your password</h2>

                        <p>
                            Create a new password for your
                            VISHNU BANK account.
                        </p>
                    </div>

                    {error && (
                        <div className="reset-password-message error">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="reset-password-message success">
                            {success}
                        </div>
                    )}

                    {!success && (
                        <form
                            onSubmit={handleSubmit}
                            noValidate
                        >

                            <div className="reset-password-field">
                                <label htmlFor="new-password">
                                    New Password
                                </label>

                                <div className="reset-password-input-wrapper">
                                    <input
                                        id="new-password"
                                        type={showNewPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(event) => {
                                            setNewPassword(event.target.value);
                                            setNewPasswordError("");
                                            setConfirmPasswordError("");
                                        }}
                                        placeholder="Enter your new password"
                                        autoComplete="new-password"
                                        minLength={8}
                                        maxLength={20}
                                        required
                                        disabled={loading}
                                        aria-invalid={!!newPasswordError}
                                        aria-describedby={
                                            newPasswordError
                                                ? "new-password-error"
                                                : "password-hint"
                                        }
                                        className={newPasswordError ? "input-error" : ""}
                                    />

                                    <button
                                        type="button"
                                        className="reset-password-visibility-toggle"
                                        onClick={() =>
                                            setShowNewPassword((previous) => !previous)
                                        }
                                        disabled={loading}
                                        aria-label={
                                            showNewPassword ? "Hide new password" : "Show new password"
                                        }
                                        aria-pressed={showNewPassword}
                                    >
                                        {showNewPassword ? (
                                            <EyeOff size={19} />
                                        ) : (
                                            <Eye size={19} />
                                        )}
                                    </button>
                                </div>

                                {newPasswordError && (
                                    <p
                                        id="new-password-error"
                                        className="field-error"
                                        role="alert"
                                    >
                                        {newPasswordError}
                                    </p>
                                )}

                                <small id="password-hint">
                                    Password must contain 8–20
                                    characters.
                                </small>
                            </div>

                            <div className="reset-password-field">
                                <label htmlFor="confirm-password">
                                    Confirm New Password
                                </label>

                                <div className="reset-password-input-wrapper">
                                    <input
                                        id="confirm-password"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(event) => {
                                            setConfirmPassword(event.target.value);
                                            setConfirmPasswordError("");
                                        }}
                                        placeholder="Re-enter your new password"
                                        autoComplete="new-password"
                                        minLength={8}
                                        maxLength={20}
                                        required
                                        disabled={loading}
                                        aria-invalid={!!confirmPasswordError}
                                        aria-describedby={
                                            confirmPasswordError
                                                ? "confirm-password-error"
                                                : undefined
                                        }
                                        className={confirmPasswordError ? "input-error" : ""}
                                    />

                                    <button
                                        type="button"
                                        className="reset-password-visibility-toggle"
                                        onClick={() =>
                                            setShowConfirmPassword((previous) => !previous)
                                        }
                                        disabled={loading}
                                        aria-label={
                                            showConfirmPassword
                                                ? "Hide confirm password"
                                                : "Show confirm password"
                                        }
                                        aria-pressed={showConfirmPassword}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff size={19} />
                                        ) : (
                                            <Eye size={19} />
                                        )}
                                    </button>
                                </div>

                                {confirmPasswordError && (
                                    <p
                                        id="confirm-password-error"
                                        className="field-error"
                                        role="alert"
                                    >
                                        {confirmPasswordError}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="reset-password-button"
                                disabled={loading}
                            >
                                {loading
                                    ? "Resetting Password..."
                                    : "Reset Password"}
                            </button>

                        </form>
                    )}

                    <div className="reset-password-footer">

                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                        >
                            {success
                                ? "Continue to Login"
                                : "← Back to Login"}
                        </button>

                    </div>

                </div>

                <p className="reset-password-security-note">
                    Your password is securely protected.
                </p>

            </div>

        </div>
    );
}

export default ResetPassword;