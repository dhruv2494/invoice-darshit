import { useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="w-full bg-white shadow-md px-6 py-4 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {/* Sidebar toggle button on small screens */}
        {toggleSidebar && (
          <button className="md:hidden text-gray-700" onClick={toggleSidebar}>
            <FaBars className="text-2xl" />
          </button>
        )}
        <h1 className="text-xl font-bold text-gray-800 tracking-wide">Admin Dashboard</h1>
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded-md font-medium hover:bg-red-600 transition duration-200"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
