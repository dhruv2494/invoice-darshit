import axios from "axios";

const API = axios.create({
  baseURL: "https://1cc9-2402-a00-408-758c-907b-ce58-1891-714e.ngrok-free.app",
  // baseURL: "http://localhost:7001", // Uncomment if using localhost
});

API.interceptors.request.use((req) => {
  req.headers["ngrok-skip-browser-warning"] = 1; // Corrected line
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
