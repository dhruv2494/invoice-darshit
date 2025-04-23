import axios from "axios";

const API = axios.create({
  // baseURL: "https://b501-2402-a00-408-758c-579-2cae-7032-f755.ngrok-free.app",
  baseURL: import.meta.env.VITE_API_URL, // Uncomment if using localhost
});

API.interceptors.request.use((req) => {
  req.headers["ngrok-skip-browser-warning"] = 1; // Corrected line
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
