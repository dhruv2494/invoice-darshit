import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProfile } from "../redux/profileSlice";
import { useDispatch, useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const {profile, loading, error} = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const getProfile = () => dispatch(fetchProfile());
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
    if (!profile) {
      getProfile();
    }
  }, [token, profile]);
  return <>{children}</>;
};

export default ProtectedRoute;
