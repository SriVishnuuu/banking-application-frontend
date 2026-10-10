import axios from "axios";

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
    headers: {
        "Content-Type": "application/json"
    }
});

const PUBLIC_AUTH_URLS = [
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/auth/reset-password"
];

const isPublicAuthUrl = (url = "") =>
    PUBLIC_AUTH_URLS.some((path) => url.includes(path));

axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token && !isPublicAuthUrl(config.url)) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const url = error.config?.url || "";

        if (status === 401 && !isPublicAuthUrl(url)) {
            localStorage.removeItem("token");
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default axiosClient;