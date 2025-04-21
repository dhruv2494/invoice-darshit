import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:7001",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  console.log(token,"tokentoken");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
