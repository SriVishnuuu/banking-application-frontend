import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Users,
    Eye,
    ChevronLeft,
    ChevronRight,
    LoaderCircle,
    Search,
    X
} from "lucide-react";

import adminApi from "../../api/adminApi";
import "../../css/admin/AdminCustomers.css";
import LoadingScreen from "../../components/common/LoadingScreen";

function AdminCustomers() {

    const [customers, setCustomers] = useState([]);
    const [totalCustomers, setTotalCustomers] = useState(0);

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [search, setSearch] = useState("");
    const [appliedSearch, setAppliedSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState("");

    const loadCustomers = async (
        pageNumber = 0,
        searchValue = appliedSearch
    ) => {
        setLoading(true);
        setError("");

        try {
            const response = await adminApi.getCustomers(
                pageNumber,
                searchValue
            );

            const data = response.data;

            setCustomers(data.content || []);
            setTotalCustomers(data.totalElements ?? 0);
            setPage(data.number ?? pageNumber);
            setTotalPages(data.totalPages ?? 0);
        } catch (error) {
            console.error("Failed to load customers:", error);

            setError(
                error.response?.data?.message ||
                "Unable to load customers. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let isMounted = true;

        const fetchCustomers = async () => {
            try {
                const response = await adminApi.getCustomers(0, "");

                const data = response.data;

                if (!isMounted) {
                    return;
                }

                setCustomers(data.content || []);
                setTotalCustomers(data.totalElements ?? 0);
                setPage(data.number ?? 0);
                setTotalPages(data.totalPages ?? 0);
            } catch (error) {
                console.error("Failed to load customers:", error);

                if (!isMounted) {
                    return;
                }

                setError(
                    error.response?.data?.message ||
                    "Unable to load customers. Please try again."
                );
            } finally {
                if (isMounted) {
                    setLoading(false);
                    setInitialLoading(false);
                }
            }
        };

        fetchCustomers();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleSearch = () => {
        const trimmedSearch = search.trim();

        setAppliedSearch(trimmedSearch);
        loadCustomers(0, trimmedSearch);
    };

    const handleClearSearch = () => {
        setSearch("");
        setAppliedSearch("");
        loadCustomers(0, "");
    };

    const handleSearchKeyDown = (event) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    };

    const handlePreviousPage = () => {
        if (page > 0) {
            loadCustomers(page - 1, appliedSearch);
        }
    };

    const handleNextPage = () => {
        if (page < totalPages - 1) {
            loadCustomers(page + 1, appliedSearch);
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "ACTIVE":
                return "admin-customer-status active";

            case "SUSPENDED":
                return "admin-customer-status suspended";

            case "BLOCKED":
                return "admin-customer-status blocked";

            default:
                return "admin-customer-status";
        }
    };

    if (initialLoading && loading) {
        return <LoadingScreen message="Loading customers..." />;
    }

    return (
        <div className="admin-customers">

            <section className="admin-customers-search-panel">

                <div className="admin-customers-search-header">

                    <div className="admin-customers-search-title">

                        <div className="admin-customers-search-title-icon">
                            <Search size={16} strokeWidth={2} />
                        </div>

                        <div>
                            <h3>Find a customer</h3>

                            <p>
                                Search by name, email or phone number.
                            </p>
                        </div>

                    </div>

                    {appliedSearch && (
                        <button
                            type="button"
                            className="admin-customers-clear-search"
                            onClick={handleClearSearch}
                        >
                            <X size={14} strokeWidth={2} />
                            <span>Clear search</span>
                        </button>
                    )}

                </div>

                <div className="admin-customers-search-form">

                    <div className="admin-customers-search-input">

                        <Search
                            size={18}
                            strokeWidth={1.8}
                            className="admin-customers-search-input-icon"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            onKeyDown={handleSearchKeyDown}
                            placeholder="Search customers..."
                            aria-label="Search customers"
                        />

                        {search && (
                            <button
                                type="button"
                                className="admin-customers-input-clear"
                                onClick={() => setSearch("")}
                                aria-label="Clear search input"
                            >
                                <X size={15} strokeWidth={2} />
                            </button>
                        )}

                    </div>

                    <button
                        type="button"
                        className="admin-customers-search-button"
                        onClick={handleSearch}
                        disabled={loading}
                    >
                        <Search size={15} strokeWidth={2} />
                        <span>Search</span>
                    </button>

                </div>

                {appliedSearch && (
                    <div className="admin-customers-search-status">

                        <span>
                            Showing results for{" "}
                            <strong>"{appliedSearch}"</strong>
                        </span>

                        <span>
                            {totalCustomers}{" "}
                            {totalCustomers === 1
                                ? "customer"
                                : "customers"}
                        </span>

                    </div>
                )}

            </section>


            <section className="admin-customers-intro">

                <div>
                    <p className="admin-customers-eyebrow">
                        CUSTOMER MANAGEMENT
                    </p>

                    <h2>Customers</h2>

                    <p>
                        View customers and manage their status.
                    </p>
                </div>

                <div className="admin-customers-count">

                    <Users size={17} strokeWidth={1.9} />

                    <span>
                        {loading
                            ? "Loading..."
                            : `${totalCustomers} total customers`}
                    </span>

                </div>

            </section>


            <section className="admin-customers-table-card">

                {error && (
                    <div className="admin-customers-error">
                        {error}
                    </div>
                )}

                {loading ? (

                    <div className="admin-customers-loading">

                        <LoaderCircle
                            size={25}
                            strokeWidth={1.8}
                            className="admin-loading-icon"
                        />

                        <span>
                            Loading customers...
                        </span>

                    </div>

                ) : customers.length === 0 ? (

                    <div className="admin-customers-empty">

                        <div className="admin-customers-empty-icon">
                            <Users size={24} strokeWidth={1.7} />
                        </div>

                        <h3>
                            {appliedSearch
                                ? "No customers found"
                                : "No customers available"}
                        </h3>

                        <p>
                            {appliedSearch
                                ? "Try searching with a different name, email or phone number."
                                : "There are currently no customers to display."}
                        </p>

                    </div>

                ) : (

                    <div className="admin-customers-table-wrapper">

                        <table className="admin-customers-table">

                            <thead>
                                <tr>
                                    <th>Customer</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>

                                {customers.map((customer) => (

                                    <tr key={customer.id}>

                                        <td>

                                            <div className="admin-customer-name">

                                                <div className="admin-customer-avatar">
                                                    {customer.firstName
                                                        ?.charAt(0)
                                                        ?.toUpperCase() || "C"}
                                                </div>

                                                <div>

                                                    <strong>
                                                        {customer.firstName}{" "}
                                                        {customer.lastName || ""}
                                                    </strong>

                                                    <span>
                                                        Customer #{customer.id}
                                                    </span>

                                                </div>

                                            </div>

                                        </td>

                                        <td>

                                            <span className="admin-customer-email">
                                                {customer.email || "—"}
                                            </span>

                                        </td>

                                        <td>

                                            <span
                                                className={getStatusClass(
                                                    customer.status
                                                )}
                                            >
                                                <span className="admin-status-dot" />

                                                {customer.status}
                                            </span>

                                        </td>

                                        <td>

                                            <Link
                                                to={`/admin/customers/${customer.id}`}
                                                className="admin-customer-view-button"
                                            >
                                                <Eye
                                                    size={15}
                                                    strokeWidth={1.9}
                                                />

                                                <span>
                                                    View
                                                </span>
                                            </Link>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

                {!loading &&
                    customers.length > 0 &&
                    totalPages > 0 && (

                        <div className="admin-customers-pagination">

                            <span className="admin-pagination-info">
                                Page {page + 1} of {totalPages}
                            </span>

                            <div className="admin-pagination-controls">

                                <button
                                    type="button"
                                    onClick={handlePreviousPage}
                                    disabled={page === 0}
                                    aria-label="Previous page"
                                >
                                    <ChevronLeft
                                        size={17}
                                        strokeWidth={1.9}
                                    />
                                </button>

                                <span className="admin-pagination-current">
                                    {page + 1}
                                </span>

                                <button
                                    type="button"
                                    onClick={handleNextPage}
                                    disabled={page >= totalPages - 1}
                                    aria-label="Next page"
                                >
                                    <ChevronRight
                                        size={17}
                                        strokeWidth={1.9}
                                    />
                                </button>

                            </div>

                        </div>

                    )}

            </section>

        </div>
    );
}

export default AdminCustomers;