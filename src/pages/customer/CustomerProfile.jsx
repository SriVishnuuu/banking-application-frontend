import { useEffect, useState } from "react";
import customerApi from "../../api/customerApi";
import "../../css/CustomerProfile.css";
import LoadingScreen from "../../components/common/LoadingScreen";

function CustomerProfile() {

    const [profile, setProfile] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        address: "",
        phoneNumber: ""
    });

    const [editFormData, setEditFormData] = useState({
        firstName: "",
        lastName: "",
        address: "",
        phoneNumber: ""
    });

    const [updateError, setUpdateError] = useState("");
    const [updateSuccess, setUpdateSuccess] = useState("");
    const [updating, setUpdating] = useState(false);

    const [submitting, setSubmitting] = useState(false);

    const [formError, setFormError] = useState("");
    const [success, setSuccess] = useState("");

    const [createFieldErrors, setCreateFieldErrors] = useState({});
    const [updateFieldErrors, setUpdateFieldErrors] = useState({});


    useEffect(() => {

        const fetchProfile = async () => {

            try {

                const response =
                    await customerApi.getProfile();

                setProfile(response.data);
                setIsCreating(false);

            } catch (error) {

                console.error(error);

                if (error.response?.status === 404) {

                    setIsCreating(true);

                } else {

                    setError(
                        error.response?.data?.message ||
                        "Unable to load profile."
                    );

                }

            } finally {

                setLoading(false);

            }

        };

        fetchProfile();

    }, []);


    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

        setCreateFieldErrors((previous) => {

            if (!previous[name]) {
                return previous;
            }

            const updatedErrors = {
                ...previous
            };

            delete updatedErrors[name];

            return updatedErrors;

        });

        setFormError("");

    };

    const handleEditChange = (event) => {

        const { name, value } = event.target;

        setEditFormData((previous) => ({
            ...previous,
            [name]: value
        }));

        setUpdateFieldErrors((previous) => {

            if (!previous[name]) {
                return previous;
            }

            const updatedErrors = {
                ...previous
            };

            delete updatedErrors[name];

            return updatedErrors;

        });

        setUpdateError("");

    };


    const handleUpdateProfile = async (event) => {

        event.preventDefault();

        setUpdateError("");
        setUpdateSuccess("");
        setUpdateFieldErrors({});

        try {

            setUpdating(true);

            const response =
                await customerApi.updateProfile(
                    editFormData
                );

            setProfile(response.data);

            setUpdateSuccess(
                "Profile updated successfully."
            );

            setIsEditing(false);

        } catch (error) {

            console.error(error);

            const responseData =
                error.response?.data;

            if (responseData?.fieldErrors) {

                setUpdateFieldErrors(
                    responseData.fieldErrors
                );

                setUpdateError("");

            } else {

                setUpdateFieldErrors({});

                setUpdateError(
                    responseData?.message ||
                    "Unable to update profile."
                );

            }

        } finally {

            setUpdating(false);

        }

    };


    const handleCreateProfile = async (event) => {

        event.preventDefault();

        setFormError("");
        setSuccess("");
        setCreateFieldErrors({});

        try {

            setSubmitting(true);

            const response =
                await customerApi.createProfile(
                    formData
                );

            setProfile(response.data);
            setIsCreating(false);

            setSuccess(
                "Profile created successfully."
            );

        } catch (error) {

            console.error(error);

            const responseData =
                error.response?.data;

            if (responseData?.fieldErrors) {

                setCreateFieldErrors(
                    responseData.fieldErrors
                );

                setFormError("");

            } else {

                setCreateFieldErrors({});

                setFormError(
                    responseData?.message ||
                    "Unable to create profile."
                );

            }

        } finally {

            setSubmitting(false);

        }

    };


    const getInitials = () => {

        if (!profile) {
            return "U";
        }

        const first =
            profile.firstName?.charAt(0) || "";

        const last =
            profile.lastName?.charAt(0) || "";

        return `${first}${last}`.toUpperCase();

    };


    const formatDate = (date) => {

        if (!date) {
            return "—";
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );

    };


    if (loading) {
        return (
            <LoadingScreen message="Loading your Profile..." />
        );
    }


    if (error) {

        return (

            <div className="profile-page">

                <div className="profile-error">

                    <h3>
                        Unable to load profile
                    </h3>

                    <p>
                        {error}
                    </p>

                </div>

            </div>

        );

    }

    if (isCreating) {

        return (

            <div className="profile-page">

                <div className="profile-container">

                    <div className="profile-page-header">

                        <div>

                            <p className="profile-eyebrow">
                                VISHNU BANK
                            </p>

                            <h1>
                                Create Your Profile
                            </h1>

                            <p>
                                Complete your personal information
                                to start using your banking account.
                            </p>

                        </div>

                    </div>


                    <div className="profile-card">

                        <div className="profile-card-header">

                            <div className="profile-section-icon">
                                👤
                            </div>

                            <div>

                                <h2>
                                    Personal Information
                                </h2>

                                <p>
                                    Enter your basic personal details.
                                </p>

                            </div>

                        </div>


                        {formError && (

                            <div className="profile-alert error">
                                {formError}
                            </div>

                        )}


                        <form
                            className="profile-form"
                            onSubmit={handleCreateProfile}
                        >

                            <div className="profile-form-grid">


                                <div className="profile-field">

                                    <label htmlFor="firstName">
                                        First Name
                                    </label>

                                    <input
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        placeholder="Enter first name"
                                        disabled={submitting}
                                        className={
                                            createFieldErrors.firstName
                                                ? "field-invalid"
                                                : ""
                                        }
                                    />

                                    {createFieldErrors.firstName && (

                                        <p className="field-error">
                                            {
                                                createFieldErrors.firstName
                                            }
                                        </p>

                                    )}

                                </div>


                                <div className="profile-field">

                                    <label htmlFor="lastName">
                                        Last Name
                                    </label>

                                    <input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        placeholder="Enter last name"
                                        disabled={submitting}
                                        className={
                                            createFieldErrors.lastName
                                                ? "field-invalid"
                                                : ""
                                        }
                                    />

                                    {createFieldErrors.lastName && (

                                        <p className="field-error">
                                            {
                                                createFieldErrors.lastName
                                            }
                                        </p>

                                    )}

                                </div>

                                <div className="profile-field">

                                    <label htmlFor="dateOfBirth">
                                        Date of Birth
                                    </label>

                                    <input
                                        id="dateOfBirth"
                                        name="dateOfBirth"
                                        type="date"
                                        value={formData.dateOfBirth}
                                        onChange={handleChange}
                                        disabled={submitting}
                                        className={
                                            createFieldErrors.dateOfBirth
                                                ? "field-invalid"
                                                : ""
                                        }
                                    />

                                    {createFieldErrors.dateOfBirth && (

                                        <p className="field-error">
                                            {
                                                createFieldErrors.dateOfBirth
                                            }
                                        </p>

                                    )}

                                </div>


                                <div className="profile-field">

                                    <label htmlFor="phoneNumber">
                                        Phone Number
                                    </label>

                                    <input
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        type="tel"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        placeholder="Enter phone number"
                                        disabled={submitting}
                                        className={
                                            createFieldErrors.phoneNumber
                                                ? "field-invalid"
                                                : ""
                                        }
                                    />

                                    {createFieldErrors.phoneNumber && (

                                        <p className="field-error">
                                            {
                                                createFieldErrors.phoneNumber
                                            }
                                        </p>

                                    )}

                                </div>

                                <div className="profile-field full-width">

                                    <label htmlFor="address">
                                        Address
                                    </label>

                                    <textarea
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Enter your address"
                                        rows="4"
                                        disabled={submitting}
                                        className={
                                            createFieldErrors.address
                                                ? "field-invalid"
                                                : ""
                                        }
                                    />

                                    {createFieldErrors.address && (

                                        <p className="field-error">
                                            {
                                                createFieldErrors.address
                                            }
                                        </p>

                                    )}

                                </div>

                            </div>


                            <div className="profile-form-actions">

                                <button
                                    type="submit"
                                    className="profile-primary-btn"
                                    disabled={submitting}
                                >

                                    {submitting
                                        ? "Creating..."
                                        : "Create Profile"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            </div>

        );

    }


    if (isEditing) {

        return (

            <div className="profile-page">

                <div className="profile-container">

                    <div className="profile-page-header">

                        <div>

                            <p className="profile-eyebrow">
                                ACCOUNT SETTINGS
                            </p>

                            <h1>
                                Edit Profile
                            </h1>

                            <p>
                                Update your personal and contact
                                information.
                            </p>

                        </div>

                    </div>


                    <div className="profile-card">


                        {updateError && (

                            <div className="profile-alert error">
                                {updateError}
                            </div>

                        )}


                        <form
                            className="profile-form"
                            onSubmit={handleUpdateProfile}
                        >

                            <div className="profile-form-grid">


                                <div className="profile-field">

                                    <label htmlFor="editFirstName">
                                        First Name
                                    </label>

                                    <input
                                        id="editFirstName"
                                        name="firstName"
                                        type="text"
                                        value={editFormData.firstName}
                                        onChange={handleEditChange}
                                        disabled={updating}
                                        className={
                                            updateFieldErrors.firstName
                                                ? "field-invalid"
                                                : ""
                                        }
                                    />

                                    {updateFieldErrors.firstName && (

                                        <p className="field-error">
                                            {
                                                updateFieldErrors.firstName
                                            }
                                        </p>

                                    )}

                                </div>


                                <div className="profile-field">

                                    <label htmlFor="editLastName">
                                        Last Name
                                    </label>

                                    <input
                                        id="editLastName"
                                        name="lastName"
                                        type="text"
                                        value={editFormData.lastName}
                                        onChange={handleEditChange}
                                        disabled={updating}
                                        className={
                                            updateFieldErrors.lastName
                                                ? "field-invalid"
                                                : ""
                                        }
                                    />

                                    {updateFieldErrors.lastName && (

                                        <p className="field-error">
                                            {
                                                updateFieldErrors.lastName
                                            }
                                        </p>

                                    )}

                                </div>

                                <div className="profile-field">

                                    <label htmlFor="editPhoneNumber">
                                        Phone Number
                                    </label>

                                    <input
                                        id="editPhoneNumber"
                                        name="phoneNumber"
                                        type="tel"
                                        value={editFormData.phoneNumber}
                                        onChange={handleEditChange}
                                        disabled={updating}
                                        className={
                                            updateFieldErrors.phoneNumber
                                                ? "field-invalid"
                                                : ""
                                        }
                                    />

                                    {updateFieldErrors.phoneNumber && (

                                        <p className="field-error">
                                            {
                                                updateFieldErrors.phoneNumber
                                            }
                                        </p>

                                    )}

                                </div>


                                <div className="profile-field">

                                    <label htmlFor="profileEmail">
                                        Email
                                    </label>

                                    <input
                                        id="profileEmail"
                                        type="email"
                                        value={profile.email}
                                        disabled
                                    />

                                    <small>
                                        Email is linked to your login
                                        account and cannot be changed here.
                                    </small>

                                </div>

                                <div className="profile-field full-width">

                                    <label htmlFor="editAddress">
                                        Address
                                    </label>

                                    <textarea
                                        id="editAddress"
                                        name="address"
                                        value={editFormData.address}
                                        onChange={handleEditChange}
                                        rows="4"
                                        disabled={updating}
                                        className={
                                            updateFieldErrors.address
                                                ? "field-invalid"
                                                : ""
                                        }
                                    />

                                    {updateFieldErrors.address && (

                                        <p className="field-error">
                                            {
                                                updateFieldErrors.address
                                            }
                                        </p>

                                    )}

                                </div>

                            </div>


                            <div className="profile-form-actions">

                                <button
                                    type="button"
                                    className="profile-secondary-btn"
                                    onClick={() => {

                                        setUpdateError("");
                                        setUpdateSuccess("");
                                        setUpdateFieldErrors({});
                                        setIsEditing(false);

                                    }}
                                    disabled={updating}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="profile-primary-btn"
                                    disabled={updating}
                                >

                                    {updating
                                        ? "Saving..."
                                        : "Save Changes"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            </div>

        );

    }



    return (

        <div className="profile-page">

            <div className="profile-page-container">


                <div className="profile-page-header">

                    <div>

                        <p className="profile-eyebrow">
                            ACCOUNT SETTINGS
                        </p>

                        <h1>
                            My Profile
                        </h1>

                        <p>
                            Manage your personal information and
                            account details.
                        </p>

                    </div>


                    <button
                        type="button"
                        className="profile-primary-btn"
                        onClick={() => {

                            setEditFormData({
                                firstName: profile.firstName,
                                lastName: profile.lastName,
                                address: profile.address,
                                phoneNumber: profile.phoneNumber
                            });

                            setUpdateError("");
                            setUpdateSuccess("");
                            setUpdateFieldErrors({});
                            setIsEditing(true);

                        }}
                    >
                        Edit Profile
                    </button>

                </div>


                {success && (

                    <div className="profile-alert success">
                        {success}
                    </div>

                )}


                {updateSuccess && (

                    <div className="profile-alert success">
                        {updateSuccess}
                    </div>

                )}


                <section className="profile-hero-card">

                    <div className="profile-avatar">
                        {getInitials()}
                    </div>

                    <div className="profile-hero-info">

                        <h2>
                            {profile.firstName}{" "}
                            {profile.lastName}
                        </h2>

                        <p>
                            {profile.email}
                        </p>

                        <span className="profile-active-badge">
                            Active Customer
                        </span>

                    </div>

                </section>

                <section className="profile-card">

                    <div className="profile-card-header">

                        <div className="profile-section-icon">
                            👤
                        </div>

                        <div>

                            <h2>
                                Personal Information
                            </h2>

                            <p>
                                Your basic personal details
                            </p>

                        </div>

                    </div>


                    <div className="profile-info-grid">

                        <div className="profile-info-item">

                            <span>
                                First Name
                            </span>

                            <strong>
                                {profile.firstName || "—"}
                            </strong>

                        </div>


                        <div className="profile-info-item">

                            <span>
                                Last Name
                            </span>

                            <strong>
                                {profile.lastName || "—"}
                            </strong>

                        </div>


                        <div className="profile-info-item">

                            <span>
                                Date of Birth
                            </span>

                            <strong>
                                {formatDate(
                                    profile.dateOfBirth
                                )}
                            </strong>

                        </div>


                        <div className="profile-info-item">

                            <span>
                                Phone Number
                            </span>

                            <strong>
                                {profile.phoneNumber || "—"}
                            </strong>

                        </div>

                    </div>

                </section>

                <section className="profile-card">

                    <div className="profile-card-header">

                        <div className="profile-section-icon">
                            📍
                        </div>

                        <div>

                            <h2>
                                Contact Information
                            </h2>

                            <p>
                                Your registered contact details
                            </p>

                        </div>

                    </div>


                    <div className="profile-info-grid">

                        <div className="profile-info-item full-width">

                            <span>
                                Email Address
                            </span>

                            <strong>
                                {profile.email}
                            </strong>

                        </div>


                        <div className="profile-info-item full-width">

                            <span>
                                Address
                            </span>

                            <strong>
                                {profile.address || "—"}
                            </strong>

                        </div>

                    </div>

                </section>

            </div>

        </div>

    );

}

export default CustomerProfile;