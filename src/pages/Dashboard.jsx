import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { FaUsers, FaShoppingCart, FaCheckCircle } from "react-icons/fa";
import { getCustomers } from "../redux/customerSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPurchaseOrders } from "../redux/purchaseOrderSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const customers = useSelector((state) => state?.customer?.customers);
  const { purchaseOrders } = useSelector((state) => state.purchaseOrder);

  useEffect(() => {
    dispatch(getCustomers());
    dispatch(getPurchaseOrders());
  }, [dispatch]);

  // Filter completed purchase orders count
  const completedOrders = purchaseOrders?.filter(
    (order) => order?.status === "completed"
  ).length;

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-6">Welcome to the Dashboard</h2>
      <p className="text-gray-700 mb-8">Choose an option from the sidebar.</p>

      {/* Widgets Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Customer Count Widget */}
        <Link
          key="/customers"
          to="/customers"
          className="bg-white shadow-lg rounded-lg p-6 flex items-center justify-between cursor-pointer"
        >
          <div className="flex flex-col">
            <h3 className="text-2xl font-bold text-gray-700">{customers?.length}</h3>
            <p className="text-sm text-gray-500">Total Customers</p>
          </div>
          <div className="bg-indigo-100 text-indigo-600 p-4 rounded-full">
            <FaUsers size={30} />
          </div>
        </Link>

        {/* Total Purchase Orders Widget */}
        <Link
          key="/purchase-orders"
          to="/purchase-orders"
          className="bg-white shadow-lg rounded-lg p-6 flex items-center justify-between cursor-pointer"
        >
          <div className="flex flex-col">
            <h3 className="text-2xl font-bold text-gray-700">{purchaseOrders?.length}</h3>
            <p className="text-sm text-gray-500">Total Purchase Orders</p>
          </div>
          <div className="bg-green-100 text-green-600 p-4 rounded-full">
            <FaShoppingCart size={30} />
          </div>
        </Link>

        {/* Completed Purchase Orders Widget */}
        <Link
          key="/invoices"
          to="/invoices"
          className="bg-white shadow-lg rounded-lg p-6 flex items-center justify-between cursor-pointer"
        >
          <div className="flex flex-col">
            <h3 className="text-2xl font-bold text-gray-700">{completedOrders}</h3>
            <p className="text-sm text-gray-500">Completed Purchase Orders</p>
          </div>
          <div className="bg-blue-100 text-blue-600 p-4 rounded-full">
            <FaCheckCircle size={30} />
          </div>
        </Link>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
