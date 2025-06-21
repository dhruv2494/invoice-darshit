import React, { useState } from 'react';
import { FiBell, FiLock, FiCreditCard, FiGlobe, FiMoon, FiSun, FiUser } from 'react-icons/fi';
import DashboardLayout from '../components/DashboardLayout';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('security');
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    weeklyReport: true,
    paymentReminder: true,
  });

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotifications(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Here you would typically update the theme in your app
    document.documentElement.classList.toggle('dark', !darkMode);
  };

  const tabs = [
    { id: 'security', name: 'Security', icon: <FiLock className="mr-2 h-5 w-5" /> },
    { id: 'preferences', name: 'Preferences', icon: <FiSun className="mr-2 h-5 w-5" /> },
  ];

  return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="divide-y divide-gray-200 lg:grid lg:grid-cols-12 lg:divide-y-0 lg:divide-x">
            {/* Sidebar navigation */}
            <aside className="py-6 lg:col-span-3">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`${
                      activeTab === tab.id
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-700'
                        : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } group border-l-4 px-3 py-2 flex items-center text-sm font-medium w-full text-left`}
                  >
                    {tab.icon}
                    <span className="truncate">{tab.name}</span>
                  </button>
                ))}
              </nav>
            </aside>

            {/* Main content */}
            <div className="divide-y divide-gray-200 lg:col-span-9">
              <div className="py-6 px-4 sm:p-6 lg:pb-8">
                <div className="space-y-6">


                  {activeTab === 'security' && (
                    <div>
                      <h2 className="text-lg font-medium text-gray-900">Security</h2>
                      <p className="mt-1 text-sm text-gray-500">
                        Update your password and secure your account.
                      </p>
                      <div className="mt-6 space-y-6">
                        <div>
                          <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                            Current password
                          </label>
                          <div className="mt-1">
                            <input
                              id="current-password"
                              name="current-password"
                              type="password"
                              autoComplete="current-password"
                              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                            New password
                          </label>
                          <div className="mt-1">
                            <input
                              id="new-password"
                              name="new-password"
                              type="password"
                              autoComplete="new-password"
                              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                            Confirm new password
                          </label>
                          <div className="mt-1">
                            <input
                              id="confirm-password"
                              name="confirm-password"
                              type="password"
                              autoComplete="new-password"
                              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>
                        </div>

                        <div className="pt-5">
                          <div className="flex justify-end">
                            <button
                              type="button"
                              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              Update Password
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}



                  {activeTab === 'preferences' && (
                    <div>
                      <h2 className="text-lg font-medium text-gray-900">Preferences</h2>
                      <p className="mt-1 text-sm text-gray-500">
                        Customize your application preferences.
                      </p>
                      <div className="mt-6 space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">Dark Mode</h3>
                            <p className="text-sm text-gray-500">Switch between light and dark theme</p>
                          </div>
                          <button
                            type="button"
                            onClick={toggleDarkMode}
                            className={`${
                              darkMode ? 'bg-indigo-600' : 'bg-gray-200'
                            } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                            role="switch"
                            aria-checked={darkMode}
                          >
                            <span className="sr-only">Dark mode</span>
                            <span
                              className={`${
                                darkMode ? 'translate-x-5' : 'translate-x-0'
                              } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                            >
                              <span
                                className={`${
                                  darkMode ? 'opacity-0 ease-out duration-100' : 'opacity-100 ease-in duration-200'
                                } absolute inset-0 h-full w-full flex items-center justify-center transition-opacity`}
                                aria-hidden="true"
                              >
                                <FiSun className="h-3 w-3 text-gray-400" />
                              </span>
                              <span
                                className={`${
                                  darkMode ? 'opacity-100 ease-in duration-200' : 'opacity-0 ease-out duration-100'
                                } absolute inset-0 h-full w-full flex items-center justify-center transition-opacity`}
                                aria-hidden="true"
                              >
                                <FiMoon className="h-3 w-3 text-indigo-600" />
                              </span>
                            </span>
                          </button>
                        </div>

                        <div className="pt-5">
                          <div className="flex justify-end">
                            <button
                              type="button"
                              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              Save Preferences
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Settings;
