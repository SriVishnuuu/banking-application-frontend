import { Outlet } from "react-router-dom";
import CustomerNavbar from "../components/customer/CustomerNavbar";
import CustomerFooter from "../components/customer/CustomerFooter";

function CustomerLayout() {

    return (
        <div className="customer-layout">

            <CustomerNavbar />

            <main>
                <Outlet />
            </main>

            <CustomerFooter />

        </div>
    );
}

export default CustomerLayout;