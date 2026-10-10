import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import authApi from "../../api/authApi";
import "../../css/auth/Register.css";

function Register() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [fieldErrors, setFieldErrors] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [formError, setFormError] = useState("");
    const [success, setSuccess] = useState("");

    const [loading, setLoading] = useState(false);


    const validateForm = () => {

        const errors = {
            email: "",
            password: "",
            confirmPassword: ""
        };


        const trimmedEmail = email.trim();

        if (!trimmedEmail) {

            errors.email =
                "Email address is required.";

        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                trimmedEmail
            )
        ) {

            errors.email =
                "Enter a valid email address.";

        }


        if (!password) {

            errors.password =
                "Password is required.";

        } else if (
            password.length < 8 ||
            password.length > 20
        ) {

            errors.password =
                "Password must be between 8 and 20 characters.";

        }

        if (!confirmPassword) {

            errors.confirmPassword =
                "Please confirm your password.";

        } else if (
            password !== confirmPassword
        ) {

            errors.confirmPassword =
                "Passwords do not match.";

        }


        setFieldErrors(errors);

        return (
            !errors.email &&
            !errors.password &&
            !errors.confirmPassword
        );

    };


    const getBackendFieldErrors = (responseData) => {

        if (!responseData) {
            return null;
        }


        const errors =
            responseData.fieldErrors;


        if (
            !errors ||
            typeof errors !== "object" ||
            Array.isArray(errors)
        ) {

            return null;

        }


        const backendErrors = {
            email: "",
            password: "",
            confirmPassword: ""
        };


        if (
            typeof errors.email === "string"
        ) {

            backendErrors.email =
                errors.email;

        }


        if (
            typeof errors.password === "string"
        ) {

            backendErrors.password =
                errors.password;

        }


        if (
            typeof errors.confirmPassword === "string"
        ) {

            backendErrors.confirmPassword =
                errors.confirmPassword;

        }


        if (
            backendErrors.email ||
            backendErrors.password ||
            backendErrors.confirmPassword
        ) {

            return backendErrors;

        }


        return null;

    };


    const handleSubmit = async (event) => {

        event.preventDefault();

        setFormError("");
        setSuccess("");

        setFieldErrors({
            email: "",
            password: "",
            confirmPassword: ""
        });


        const isValid =
            validateForm();


        if (!isValid) {

            return;

        }


        try {

            setLoading(true);


            await authApi.register({
                email: email.trim(),
                password
            });


            setSuccess(
                "Your account has been created successfully."
            );


            setEmail("");
            setPassword("");
            setConfirmPassword("");


        } catch (error) {

            console.error(error);


            const status =
                error.response?.status;

            const responseData =
                error.response?.data;


            if (status === 400) {

                const backendFieldErrors =
                    getBackendFieldErrors(
                        responseData
                    );


                if (backendFieldErrors) {

                    setFieldErrors(
                        backendFieldErrors
                    );

                } else {

                    setFormError(
                        responseData?.message ||
                        "Please check the entered information."
                    );

                }

                return;

            }

            setFormError(
                responseData?.message ||
                "Unable to create your account."
            );

        } finally {

            setLoading(false);

        }

    };


    const handleEmailChange = (event) => {

        setEmail(event.target.value);

        setSuccess("");

        if (fieldErrors.email) {

            setFieldErrors(
                (previous) => ({
                    ...previous,
                    email: ""
                })
            );

        }

        if (formError) {

            setFormError("");

        }

    };


    const handlePasswordChange = (event) => {

        setPassword(event.target.value);

        setSuccess("");

        if (
            fieldErrors.password ||
            fieldErrors.confirmPassword
        ) {

            setFieldErrors(
                (previous) => ({
                    ...previous,
                    password: "",
                    confirmPassword: ""
                })
            );

        }

        if (formError) {

            setFormError("");

        }

    };


    const handleConfirmPasswordChange = (event) => {

        setConfirmPassword(
            event.target.value
        );

        setSuccess("");

        if (fieldErrors.confirmPassword) {

            setFieldErrors(
                (previous) => ({
                    ...previous,
                    confirmPassword: ""
                })
            );

        }

        if (formError) {

            setFormError("");

        }

    };


    return (

        <div className="register-page">

            <div className="register-container">

                <div className="register-brand">

                    <div className="register-brand-icon">
                        V
                    </div>

                    <div>

                        <h1>
                            VISHNU BANK
                        </h1>

                        <p>
                            Secure Digital Banking
                        </p>

                    </div>

                </div>

                <div className="register-card">


                    <div className="register-card-header">

                        <p className="register-eyebrow">
                            GET STARTED
                        </p>

                        <h2>
                            Create your account
                        </h2>

                        <p>
                            Register for secure access to
                            VISHNU BANK digital banking.
                        </p>

                    </div>

                    {formError && (

                        <div
                            className="register-message register-error"
                            role="alert"
                        >
                            {formError}
                        </div>

                    )}

                    {success && (

                        <div
                            className="register-message register-success"
                            role="status"
                        >
                            {success}
                        </div>

                    )}


                    <form
                        onSubmit={handleSubmit}
                        noValidate
                    >

                        <div
                            className={`register-field ${
                                fieldErrors.email
                                    ? "has-error"
                                    : ""
                            }`}
                        >

                            <label htmlFor="email">
                                Email Address
                            </label>


                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={
                                    handleEmailChange
                                }
                                placeholder="Enter your email"
                                autoComplete="email"
                                disabled={loading}
                                aria-invalid={
                                    Boolean(
                                        fieldErrors.email
                                    )
                                }
                                aria-describedby={
                                    fieldErrors.email
                                        ? "register-email-error"
                                        : undefined
                                }
                            />


                            {fieldErrors.email && (

                                <p
                                    id="register-email-error"
                                    className="register-field-error"
                                >
                                    {fieldErrors.email}
                                </p>

                            )}

                        </div>


                        <div
                            className={`register-field ${
                                fieldErrors.password
                                    ? "has-error"
                                    : ""
                            }`}
                        >

                            <label htmlFor="password">
                                Password
                            </label>


                             <div className="register-password-input-wrapper">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={handlePasswordChange}
                                    placeholder="Create a password"
                                    autoComplete="new-password"
                                    disabled={loading}
                                    aria-invalid={Boolean(fieldErrors.password)}
                                    aria-describedby={
                                        fieldErrors.password
                                            ? "register-password-error"
                                            : "password-hint"
                                    }
                                />

                                <button
                                    type="button"
                                    className="register-password-toggle"
                                    onClick={() =>
                                        setShowPassword((previous) => !previous)
                                    }
                                    disabled={loading}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    aria-pressed={showPassword}
                                >
                                    {showPassword ? (
                                        <EyeOff size={19} />
                                    ) : (
                                        <Eye size={19} />
                                    )}
                                </button>
                            </div>


                            {fieldErrors.password ? (

                                <p
                                    id="register-password-error"
                                    className="register-field-error"
                                >
                                    {fieldErrors.password}
                                </p>

                            ) : (

                                <small id="password-hint">
                                    Password must contain
                                    8–20 characters.
                                </small>

                            )}

                        </div>


                        <div
                            className={`register-field ${
                                fieldErrors.confirmPassword
                                    ? "has-error"
                                    : ""
                            }`}
                        >

                            <label htmlFor="confirmPassword">
                                Confirm Password
                            </label>


                             <div className="register-password-input-wrapper">
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                    placeholder="Re-enter your password"
                                    autoComplete="new-password"
                                    disabled={loading}
                                    aria-invalid={Boolean(fieldErrors.confirmPassword)}
                                    aria-describedby={
                                        fieldErrors.confirmPassword
                                            ? "register-confirm-password-error"
                                            : undefined
                                    }
                                />

                                <button
                                    type="button"
                                    className="register-password-toggle"
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


                            {fieldErrors.confirmPassword && (

                                <p
                                    id="register-confirm-password-error"
                                    className="register-field-error"
                                >
                                    {
                                        fieldErrors.confirmPassword
                                    }
                                </p>

                            )}

                        </div>


                        <button
                            type="submit"
                            className="register-button"
                            disabled={loading}
                        >

                            {loading
                                ? "Creating Account..."
                                : "Create Account"}

                        </button>

                    </form>


                    <div className="register-footer">

                        <span>
                            Already have an account?
                        </span>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/login")
                            }
                        >
                            Sign in
                        </button>

                    </div>

                </div>



                <p className="register-security-note">
                    Your information is securely protected.
                </p>


            </div>

        </div>

    );

}

export default Register;