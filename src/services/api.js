import axios from "axios";

const API = axios.create({
  baseURL: "https://14b0-2402-a00-408-758c-4147-ff9a-1245-5a20.ngrok-free.app",
  // baseURL: "http://localhost:7001", // Uncomment if using localhost
});

API.interceptors.request.use((req) => {
  req.headers["ngrok-skip-browser-warning"] = 1; // Corrected line
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
