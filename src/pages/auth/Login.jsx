import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { Eye, EyeOff } from "lucide-react";
import authApi from "../../api/authApi";
import "../../css/auth/Login.css";

function Login() {

    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");

    const [fieldErrors, setFieldErrors] = useState({
        email: "",
        password: ""
    });

    const [formError, setFormError] = useState("");

    const [loading, setLoading] = useState(false);


    const validateForm = () => {

        const errors = {
            email: "",
            password: ""
        };

        const trimmedEmail = email.trim();


        if (!trimmedEmail) {

            errors.email = "Email address is required.";

        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                trimmedEmail
            )
        ) {

            errors.email = "Enter a valid email address.";

        }


        if (!password) {

            errors.password = "Password is required.";

        }


        setFieldErrors(errors);

        return !errors.email && !errors.password;

    };


    const getBackendFieldErrors = (responseData) => {

        if (!responseData) {
            return null;
        }

        const errors = responseData.fieldErrors;

        if (
            !errors ||
            typeof errors !== "object" ||
            Array.isArray(errors)
        ) {
            return null;
        }

        const backendErrors = {
            email: "",
            password: ""
        };

        if (typeof errors.email === "string") {
            backendErrors.email = errors.email;
        }

        if (typeof errors.password === "string") {
            backendErrors.password = errors.password;
        }

        if (
            backendErrors.email ||
            backendErrors.password
        ) {
            return backendErrors;
        }

        return null;
    };


    const handleSubmit = async (event) => {

        event.preventDefault();

        setFormError("");

        setFieldErrors({
            email: "",
            password: ""
        });

        const isValid = validateForm();

        if (!isValid) {

            return;

        }


        try {

            setLoading(true);


            const response = await authApi.login({
                email: email.trim(),
                password
            });


            const { token, role } =
                response.data;


            login(token, role);


            if (role === "CUSTOMER") {

                navigate("/customer/dashboard");

            } else if (role === "ADMIN") {

                navigate("/admin/dashboard");

            }


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

            if (status === 401) {

                setFormError(
                    "Invalid email or password."
                );

                return;

            }

            setFormError(
                responseData?.message ||
                "Unable to sign in. Please try again."
            );

        } finally {

            setLoading(false);

        }

    };


    const handleEmailChange = (event) => {

        setEmail(event.target.value);

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

        if (fieldErrors.password) {

            setFieldErrors(
                (previous) => ({
                    ...previous,
                    password: ""
                })
            );

        }

        if (formError) {

            setFormError("");

        }

    };


    return (

        <div className="login-page">

            <div className="login-container">


                <div className="login-brand">

                    <div className="login-brand-icon">
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



                <div className="login-card">


                    <div className="login-card-header">

                        <p className="login-eyebrow">
                            WELCOME BACK
                        </p>

                        <h2>
                            Sign in to your account
                        </h2>

                        <p>
                            Access your accounts and manage
                            your banking securely.
                        </p>

                    </div>


                    {formError && (

                        <div
                            className="login-error"
                            role="alert"
                        >
                            {formError}
                        </div>

                    )}


                    <form onSubmit={handleSubmit} noValidate>

                        <div
                            className={`login-field ${
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
                                        ? "email-error"
                                        : undefined
                                }
                            />


                            {fieldErrors.email && (

                                <p
                                    id="email-error"
                                    className="login-field-error"
                                >
                                    {fieldErrors.email}
                                </p>

                            )}

                        </div>


                        <div
                            className={`login-field ${
                                fieldErrors.password
                                    ? "has-error"
                                    : ""
                            }`}
                        >

                            <label htmlFor="password">
                                Password
                            </label>


                             <div className="password-input-wrapper">

                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={handlePasswordChange}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    disabled={loading}
                                    aria-invalid={Boolean(fieldErrors.password)}
                                    aria-describedby={
                                        fieldErrors.password ? "password-error" : undefined
                                    }
                                />

                                <button
                                    type="button"
                                    className="password-visibility-toggle"
                                    onClick={() => setShowPassword((previous) => !previous)}
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


                            {fieldErrors.password && (

                                <p
                                    id="password-error"
                                    className="login-field-error"
                                >
                                    {fieldErrors.password}
                                </p>

                            )}

                        </div>


                        <div className="login-forgot-password">

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/forgot-password"
                                    )
                                }
                            >
                                Forgot password?
                            </button>

                        </div>


                        <button
                            type="submit"
                            className="login-button"
                            disabled={loading}
                        >

                            {loading
                                ? "Signing in..."
                                : "Sign In"}

                        </button>

                    </form>


                    <div className="login-footer">

                        <span>
                            Don't have an account?
                        </span>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/register")
                            }
                        >
                            Create an account
                        </button>

                    </div>

                </div>

                <p className="login-security-note">
                    Your connection is secure and protected.
                </p>


            </div>

        </div>

    );

}

export default Login;