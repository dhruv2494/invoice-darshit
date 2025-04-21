import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import { FaUsers, FaShoppingCart, FaCheckCircle } from "react-icons/fa";
const Dashboard = () => {

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-6">Welcome to the Dashboard</h2>
      <p className="text-gray-700 mb-8">Choose an option from the sidebar.</p>

      {/* Widgets Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Customer Count Widget */}
        <div className="bg-white shadow-lg rounded-lg p-6 flex items-center justify-between">
          <div className="flex flex-col">
            <h3 className="text-2xl font-bold text-gray-700">{70}</h3>
            <p className="text-sm text-gray-500">Total Customers</p>
          </div>
          <div className="bg-indigo-100 text-indigo-600 p-4 rounded-full">
            <FaUsers size={30} />
          </div>
        </div>

        {/* Total Purchase Orders Widget */}
        <div className="bg-white shadow-lg rounded-lg p-6 flex items-center justify-between">
          <div className="flex flex-col">
            <h3 className="text-2xl font-bold text-gray-700">{30}</h3>
            <p className="text-sm text-gray-500">Total Purchase Orders</p>
          </div>
          <div className="bg-green-100 text-green-600 p-4 rounded-full">
            <FaShoppingCart size={30} />
          </div>
        </div>

        {/* Completed Purchase Orders Widget */}
        <div className="bg-white shadow-lg rounded-lg p-6 flex items-center justify-between">
          <div className="flex flex-col">
            <h3 className="text-2xl font-bold text-gray-700">{38}</h3>
            <p className="text-sm text-gray-500">Completed Purchase Orders</p>
          </div>
          <div className="bg-blue-100 text-blue-600 p-4 rounded-full">
            <FaCheckCircle size={30} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
