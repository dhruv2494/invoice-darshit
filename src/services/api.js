import axios from "axios";

const API = axios.create({
  baseURL: "https://76f1-2402-a00-408-758c-5061-7abb-a29f-4314.ngrok-free.app",
  // baseURL: "http://localhost:7001", // Uncomment if using localhost
});

API.interceptors.request.use((req) => {
  req.headers["ngrok-skip-browser-warning"] = 1; // Corrected line
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
