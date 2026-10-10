import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthProvider.jsx";
import ScrollToTop from "./utils/ScrollToTop";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <ScrollToTop />

            <AuthProvider>
                <App />
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>
);