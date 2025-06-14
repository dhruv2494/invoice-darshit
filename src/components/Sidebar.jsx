// Sidebar.jsx
import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaUsers,
  FaFileInvoice,
  FaTimes,
  FaUsersCog,
} from "react-icons/fa";
import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from "react-icons/md";

const Sidebar = ({ isOpen, toggleSidebar, isCollapsed, toggleCollapse }) => {
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
      {/* Overlay for Mobile */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
          isOpen ? "block" : "hidden"
        }`}
        style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
        onClick={toggleSidebar}
      ></div>

      {/* Sidebar */}
      <div
        className={`fixed z-50 md:static top-0 left-0  bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } ${isCollapsed ? "w-20" : "w-64"}`}
      >
        {/* Top Section */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
          {!isCollapsed ? (
            <h2 className="text-xl font-bold">Admin Panel</h2>
          ) : (
            <h2 className="text-xl font-bold">A</h2>
          )}
          <button
            className="text-white md:hidden"
            onClick={toggleSidebar}
          >
            <FaTimes />
          </button>
          <button
            onClick={toggleCollapse}
            className="hidden md:block text-gray-400 hover:text-white ml-2"
          >
            {isCollapsed ? (
              <MdKeyboardDoubleArrowRight size={20} />
            ) : (
              <MdKeyboardDoubleArrowLeft size={20} />
            )}
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex flex-col px-2 py-4 gap-2">
          {navItems.map(({ name, path, icon }) => (
            <Link
              key={path}
              to={path}
              onClick={toggleSidebar}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors duration-300 ${
                location.pathname === path
                  ? "bg-blue-600 text-white shadow-md"
                  : "hover:bg-gray-700 text-gray-300"
              }`}
            >
              <span className="text-xl">{icon}</span>
              {!isCollapsed && <span className="text-md">{name}</span>}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
