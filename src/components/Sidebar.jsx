import { Link, useLocation } from "react-router-dom";
import { 
  FiHome, 
  FiShoppingBag, 
  FiUsers, 
  FiUser, 
  FiFileText,
  FiChevronLeft,
  FiChevronRight,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX
} from "react-icons/fi";
import { useState } from "react";

const Sidebar = ({ isOpen, toggleSidebar, isCollapsed, toggleCollapse }) => {
  const location = useLocation();
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const navItems = [
    { 
      name: "Dashboard", 
      path: "/dashboard", 
      icon: <FiHome className="w-5 h-5" /> 
    },
    { 
      name: "Purchase Orders", 
      path: "/purchase-orders", 
      icon: <FiShoppingBag className="w-5 h-5" />,
    },
    { 
      name: "Customers", 
      path: "/customers", 
      icon: <FiUsers className="w-5 h-5" />,
    },
    { 
      name: "Customer Details", 
      path: "/customer-details", 
      icon: <FiUser className="w-5 h-5" />,
    },
    { 
      name: "Invoices", 
      path: "/invoices", 
      icon: <FiFileText className="w-5 h-5" />,
    },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleSidebar}
      />

      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-30 h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${isOpen ? 'left-0' : '-left-full md:left-0'}`}
      >
        {/* Logo & Toggle */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          {!isCollapsed && (
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-800">InvoicePro</h1>
            </div>
          )}
          {isCollapsed && (
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
              <span className="text-blue-600 font-bold text-sm">IP</span>
            </div>
          )}
          <button
            onClick={toggleCollapse}
            className="hidden md:flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition-colors"
          >
            {isCollapsed ? (
              <FiChevronRight className="w-5 h-5" />
            ) : (
              <FiChevronLeft className="w-5 h-5" />
            )}
          </button>
          <button 
            onClick={toggleSidebar}
            className="md:hidden text-gray-500 hover:text-gray-700"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 768) toggleSidebar();
                }}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className={`${isActive(item.path) ? 'text-blue-600' : 'text-gray-500'}`}>
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <span className="ml-3 text-sm">{item.name}</span>
                )}
              </Link>
            ))}
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-medium text-sm">AD</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-800">Admin</p>
                  <p className="text-xs text-gray-500">admin@example.com</p>
                </div>
              </div>
            )}
            {isCollapsed && (
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
                <span className="text-blue-600 font-medium text-sm">AD</span>
              </div>
            )}
          </div>
          
          {!isCollapsed && (
            <div className="mt-4 flex space-x-2">
              <button className="flex-1 flex items-center justify-center p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                <FiSettings className="w-5 h-5" />
              </button>
              <button className="flex-1 flex items-center justify-center p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                <FiLogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
