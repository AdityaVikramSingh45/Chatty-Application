//Creating the insatnce of axios to use anywhere
import axios from "axios"

export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:4000/api" : "/api",
    withCredentials: true,
});

// withCredentials: true: Ensures that cookies (like session cookies or JWTs stored in cookies) are sent with each request — required for authenticated requests to a backend using sessions or HTTP-only cookies.