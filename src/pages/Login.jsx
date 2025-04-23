import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { showToast } from "../modules/utils";

const Login = () => {
  const [username, setUsername] = useState("admin@gmail.com");
  const [password, setPassword] = useState("admin");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    try {
      const res =await API.post("/user/login", {
        sUserName:username,
        sPassword:password,
      });

      localStorage.setItem("token", res.data.token);
      showToast("login success",1);
      navigate("/dashboard");
    } catch (err) {
      showToast("Invalid credentials",2);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded w-80 shadow">
        <h2 className="text-xl font-bold mb-4 text-center">Admin Login</h2>
        <input
          className="w-full p-2 border mb-3"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="w-full p-2 border mb-3"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin} className="w-full bg-blue-600 text-white py-2 rounded">
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
