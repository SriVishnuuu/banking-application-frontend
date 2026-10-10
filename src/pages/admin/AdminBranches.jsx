import { useCallback, useEffect, useState } from "react";
import { Eye, Plus, Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import adminApi from "../../api/adminApi";
import "../../css/admin/AdminBranches.css";
import LoadingScreen from "../../components/common/LoadingScreen";

function AdminBranches() {
    const [branches, setBranches] = useState([]);
    const [search, setSearch] = useState("");
    const [appliedSearch, setAppliedSearch] = useState("");
    const [page, setPage] = useState(0);

    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const [loading, setLoading] = useState(true);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState("");

    const loadBranches = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await adminApi.getBranches(
                page,
                appliedSearch
            );

            setBranches(response.data.content || []);
            setTotalPages(response.data.totalPages || 0);
            setTotalElements(response.data.totalElements || 0);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load branches. Please try again."
            );
        } finally {
            setLoading(false);
            setInitialLoading(false);
        }
    }, [page, appliedSearch]);

    useEffect(() => {
        let isMounted = true;

        const fetchBranches = async () => {
            if (!isMounted) {
                return;
            }

            await loadBranches();
        };

        fetchBranches();

        return () => {
            isMounted = false;
        };
    }, [loadBranches]);

    const handleSearch = (event) => {
        event.preventDefault();

        const trimmedSearch = search.trim();

        setAppliedSearch(trimmedSearch);
        setPage(0);
    };

    const handleClearSearch = () => {
        setSearch("");
        setAppliedSearch("");
        setPage(0);
    };

    const handleSearchKeyDown = (event) => {
        if (event.key === "Enter") {
            handleSearch(event);
        }
    };

    const formatStatus = (status) => {
        if (!status) {
            return "Unknown";
        }

        return status.charAt(0) + status.slice(1).toLowerCase();
    };

    const getStatusClass = (status) => {
        if (!status) {
            return "";
        }

        return status.toLowerCase();
    };

    const handlePreviousPage = () => {
        if (page > 0) {
            setPage((currentPage) => currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (page < totalPages - 1) {
            setPage((currentPage) => currentPage + 1);
        }
    };

    if (initialLoading && loading) {
        return <LoadingScreen message="Loading branches..." />;
    }

    return (
        <section className="admin-branches">
            <div className="admin-branches-search-panel">
                <form
                    className="admin-branches-search-form"
                    onSubmit={handleSearch}
                >
                    <div className="admin-branches-search-input-wrapper">
                        <Search
                            size={19}
                            className="admin-branches-search-icon"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            onKeyDown={handleSearchKeyDown}
                            placeholder="Search by branch code, name or IFSC..."
                            aria-label="Search branches"
                        />

                        {search && (
                            <button
                                type="button"
                                className="admin-branches-search-clear"
                                onClick={() => setSearch("")}
                                aria-label="Clear search input"
                            >
                                <X size={17} />
                            </button>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="admin-branches-search-button"
                    >
                        <Search size={17} />
                        Search
                    </button>

                    {appliedSearch && (
                        <button
                            type="button"
                            className="admin-branches-clear-button"
                            onClick={handleClearSearch}
                        >
                            Clear
                        </button>
                    )}
                </form>

                {appliedSearch && (
                    <p className="admin-branches-search-result">
                        Showing results for{" "}
                        <strong>&ldquo;{appliedSearch}&rdquo;</strong>
                    </p>
                )}
            </div>

            <div className="admin-branches-header">
                <div>
                    <p className="admin-branches-eyebrow">
                        Branch Management
                    </p>

                    <h1>Branches</h1>

                    <p>
                        View and manage all bank branches and their current
                        status.
                    </p>
                </div>

                <Link
                    to="/admin/branches/create"
                    className="admin-branches-create-button"
                >
                    <Plus size={17} />
                    Create Branch
                </Link>
            </div>

            <div className="admin-branches-table-card">
                <div className="admin-branches-table-header">
                    <div>
                        <h2>All Branches</h2>

                        {!loading && (
                            <span>
                                {totalElements}{" "}
                                {totalElements === 1
                                    ? "branch"
                                    : "branches"}
                            </span>
                        )}
                    </div>
                </div>

                {loading ? (
                    <div className="admin-branches-state">
                        <div className="admin-branches-spinner"></div>
                        <p>Loading branches...</p>
                    </div>
                ) : error ? (
                    <div className="admin-branches-state admin-branches-error-state">
                        <div className="admin-branches-state-icon">!</div>

                        <h3>Unable to load branches</h3>

                        <p>{error}</p>

                        <button
                            type="button"
                            onClick={loadBranches}
                            className="admin-branches-retry-button"
                        >
                            Try Again
                        </button>
                    </div>
                ) : branches.length === 0 ? (
                    <div className="admin-branches-state">
                        <div className="admin-branches-state-icon">
                            <Search size={21} />
                        </div>

                        <h3>
                            {appliedSearch
                                ? "No branches found"
                                : "No branches available"}
                        </h3>

                        <p>
                            {appliedSearch
                                ? "Try a different branch code, branch name or IFSC code."
                                : "There are no branches to display."}
                        </p>

                        {appliedSearch && (
                            <button
                                type="button"
                                onClick={handleClearSearch}
                                className="admin-branches-retry-button"
                            >
                                Clear Search
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="admin-branches-table-wrapper">
                            <table className="admin-branches-table">
                                <thead>
                                    <tr>
                                        <th>Branch Code</th>
                                        <th>Branch Name</th>
                                        <th>IFSC Code</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {branches.map((branch) => (
                                        <tr key={branch.id}>
                                            <td>
                                                <span className="admin-branches-code">
                                                    {branch.branchCode}
                                                </span>
                                            </td>

                                            <td>
                                                <span className="admin-branches-name">
                                                    {branch.branchName}
                                                </span>
                                            </td>

                                            <td>
                                                <span className="admin-branches-ifsc">
                                                    {branch.ifscCode}
                                                </span>
                                            </td>

                                            <td>
                                                <span
                                                    className={`admin-branches-status ${getStatusClass(
                                                        branch.status
                                                    )}`}
                                                >
                                                    <span className="admin-branches-status-dot"></span>
                                                    {formatStatus(
                                                        branch.status
                                                    )}
                                                </span>
                                            </td>

                                            <td>
                                                <Link
                                                    to={`/admin/branches/${branch.id}`}
                                                    className="admin-branches-view-button"
                                                >
                                                    <Eye size={16} />
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {totalPages > 1 && (
                            <div className="admin-branches-pagination">
                                <button
                                    type="button"
                                    onClick={handlePreviousPage}
                                    disabled={page === 0}
                                >
                                    Previous
                                </button>

                                <span>
                                    Page <strong>{page + 1}</strong> of{" "}
                                    <strong>{totalPages}</strong>
                                </span>

                                <button
                                    type="button"
                                    onClick={handleNextPage}
                                    disabled={page >= totalPages - 1}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}

export default AdminBranches;