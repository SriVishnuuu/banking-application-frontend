import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import "../css/admin/AdminLayout.css";
import AdminFooter from "../components/admin/AdminFooter";

function AdminLayout() {
    return (
        <div className="admin-layout">

            <AdminSidebar />

            <div className="admin-main">

                <AdminHeader />

                <main className="admin-content">
                    <Outlet />
                </main>

                <AdminFooter />

            </div>

        </div>
    );
}

export default AdminLayout;