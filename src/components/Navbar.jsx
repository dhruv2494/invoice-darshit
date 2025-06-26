import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiUser, FiSettings, FiMail, FiFileText, FiChevronDown } from 'react-icons/fi';
import { FaBars } from 'react-icons/fa';

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // User data - replace with actual user data from your auth context
  const user = { 
    name: 'Admin',
    email: 'admin@example.com',
    avatar: null
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsProfileOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo and menu button */}
          <div className="flex items-center">
            {toggleSidebar && (
              <button
                type="button"
                className="md:hidden text-gray-500 hover:text-gray-600 focus:outline-none"
                onClick={toggleSidebar}
              >
                <FaBars className="h-6 w-6" />
              </button>
            )}
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Invoice Management</h1>
            </div>
          </div>

          {/* Right side - User profile */}
          <div className="flex items-center">
            <div className="nav-right p-0">
            <ul className="nav-menus flex items-center justify-end gap-4">
              {/* Profile Dropdown */}
              <li className="profile-nav relative">
                <div 
                  className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-100 rounded-md"
                  onClick={toggleProfile}
                >
                  <div className="flex items-center">
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt="" 
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-gray-700 m-0">{user.name}</p>
                    <p className="text-xs text-gray-500 m-0">{user.email}</p>
                  </div>
                  <FiChevronDown className={`ml-1 transition-transform duration-200 ${isProfileOpen ? 'transform rotate-180' : ''}`} />
                </div>
                
                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-700">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <ul className="py-1">
                      <li>
                        <button
                          onClick={() => handleNavigation('/profile')}
                          className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <FiUser className="mr-3 h-4 w-4" />
                          Profile
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleNavigation('/settings')}
                          className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <FiSettings className="mr-3 h-4 w-4" />
                          Settings
                        </button>
                      </li>
                      <li>
                        <a 
                          href="#" 
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <FiMail className="mr-3" />
                          Messages
                        </a>
                      </li>
                      <li>
                        <a 
                          href="#" 
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <FiFileText className="mr-3" />
                          Tasks
                        </a>
                      </li>
                    </ul>
                    <div className="border-t border-gray-100">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                      >
                        <FiLogOut className="mr-3" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </li>
            </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
