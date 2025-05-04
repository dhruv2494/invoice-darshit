import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaUsers,
  FaFileInvoice,
  FaTimes,
  FaUsersCog,
} from "react-icons/fa";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt /> },
    { name: "Purchase Orders", path: "/purchase-orders", icon: <FaBoxOpen /> },
    { name: "Customers", path: "/customers", icon: <FaUsers /> },
    { name: "Customer Details", path: "/customer-details", icon: <FaUsersCog /> },
    { name: "Invoices", path: "/invoices", icon: <FaFileInvoice /> },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
          isOpen ? "block" : "hidden"
        }`}
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.4)", // Fixed typo here
        }}
        onClick={toggleSidebar}
      ></div>

      {/* Sidebar */}
      <div
        className={`fixed z-50 md:static top-0 left-0 h-full w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 md:hidden">
          <h2 className="text-2xl font-bold">Admin</h2>
          <button onClick={toggleSidebar}>
            <FaTimes className="text-white text-lg" />
          </button>
        </div>
        <div className="px-6 py-4">
          <h2 className="hidden md:block text-3xl font-semibold mb-8 text-center tracking-wide">
            Admin Panel
          </h2>
          <nav className="flex flex-col gap-4">
            {navItems.map(({ name, path, icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors duration-300 ${
                  location.pathname === path
                    ? "bg-blue-600 text-white shadow-md"
                    : "hover:bg-gray-700 text-gray-300"
                }`}
                onClick={toggleSidebar}
              >
                {icon}
                <span className="text-md">{name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
