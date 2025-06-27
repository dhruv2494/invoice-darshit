import { useEffect } from "react";
import {
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiEdit,
  FiInfo,
  FiPlusCircle,
  FiShoppingCart,
  FiTrash,
  FiTrendingUp,
  FiUsers,
  FiXCircle
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { getCustomers } from "../redux/customerSlice";
import { getDashboardData } from "../redux/profileSlice";
import { getPurchaseOrders } from "../redux/purchaseOrderSlice";
import { timeAgo } from "../utils/utils";

// Chart Components (Using mock data for now)
const SalesChart = () => (
  <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4">
    <div className="h-full flex items-center justify-center text-gray-400">
      Sales Chart - Integration with Chart.js or similar can be added here
    </div>
  </div>
);
const getActivityIcon = (status) => {
  switch (status) {
    case 'New':
      return <FiPlusCircle className="text-blue-500" />;
    case 'Completed':
      return <FiCheckCircle className="text-green-500" />;
    case 'Updated':
      return <FiEdit className="text-yellow-500" />;
    case 'Deleted':
      return <FiTrash className="text-red-500" />;
    case 'Failed':
      return <FiXCircle className="text-red-500" />;
    default:
      return <FiInfo className="text-gray-500" />;
  }
};


const RecentActivity = ({ activities }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
    <div className="p-4 border-b border-gray-100">
      <h3 className="font-medium text-gray-800">Recent Activities</h3>
    </div>
    <div className="divide-y divide-gray-100">
      {activities?.length > 0 ? activities.map((activity, index) => (
        <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
          <div className="flex items-start">
            <div className={`p-2 rounded-full ${activity.iconBg} mr-3`}>
              {getActivityIcon(activity.status)}
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-800">{activity.title}</p>
              <p className="text-xs text-gray-500 mt-1">{activity.created_at && timeAgo(activity.created_at)}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${activity?.statusBg || 'bg-green-50 text-green-700'}`}>
              {activity.status}
            </span>
          </div>
        </div>
      )) : (
        <div className="p-4 text-center text-sm text-gray-500">
          No activities found
        </div>
      )}
    </div>
  </div>
);

const StatCard = ({ title, value, change, icon, iconBg, changeType = 'increase' }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-semibold text-gray-900 mt-1">{value}</h3>
        <div className={`flex items-center mt-2 text-sm ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
          {changeType === 'increase' ? (
            <FiTrendingUp className="mr-1" />
          ) : (
            <FiTrendingUp className="mr-1 transform rotate-180" />
          )}
          {change}
        </div>
      </div>
      <div className={`p-3 rounded-lg ${iconBg} text-white`}>
        {icon}
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const customers = useSelector((state) => state?.customer?.customers) || [];
  const { purchaseOrders = [] } = useSelector((state) => state.purchaseOrder) || {};
  const dashboardData = useSelector((state) => state.profile.dashboardData) || {};
  useEffect(() => {
    dispatch(getCustomers());
    dispatch(getPurchaseOrders());
    dispatch(getDashboardData());
  }, [dispatch]);

  // Calculate metrics
  const totalCustomers = customers.length;
  const totalOrders = purchaseOrders.length;
  const completedOrders = purchaseOrders.filter(order => order?.status === "completed").length;
  const pendingOrders = purchaseOrders.filter(order => order?.status === "pending").length;
  const revenue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(purchaseOrders.reduce((sum, order) => sum + (order.total || 0), 0));

  // Mock recent activities
  const recentActivities = (dashboardData?.recentActivities||[]) 
  // || [
  //   {
  //     title: 'New order #1234 received',
  //     time: '2 min ago',
  //     icon: <FiShoppingCart className="text-blue-500" />,
  //     iconBg: 'bg-blue-100',
  //     status: 'New',
  //     statusBg: 'bg-blue-50 text-blue-700'
  //   },
  //   {
  //     title: 'Payment of $1,234 received',
  //     time: '1 hour ago',
  //     icon: <FiDollarSign className="text-green-500" />,
  //     iconBg: 'bg-green-100',
  //     status: 'Completed',
  //     statusBg: 'bg-green-50 text-green-700'
  //   },
  //   {
  //     title: 'Order #1232 failed to process',
  //     time: '3 hours ago',
  //     icon: <FiAlertCircle className="text-red-500" />,
  //     iconBg: 'bg-red-100',
  //     status: 'Failed',
  //     statusBg: 'bg-red-50 text-red-700'
  //   },
  //   {
  //     title: 'New customer registered',
  //     time: '5 hours ago',
  //     icon: <FiUsers className="text-purple-500" />,
  //     iconBg: 'bg-purple-100',
  //     status: 'New',
  //     statusBg: 'bg-blue-50 text-blue-700'
  //   },
  // ];

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500">Welcome back! Here's what's happening with your store.</p>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              Export
            </button>
            <button className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
              Generate Report
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            title="Total Revenue"
            value={dashboardData?.total_revenue}
            change="+12.5% from last month"
            icon={<FiDollarSign size={24} />}
            iconBg="bg-blue-500"
          />
          <StatCard
            title="Total Customers"
            value={totalCustomers}
            change="+8.2% from last month"
            icon={<FiUsers size={24} />}
            iconBg="bg-green-500"
          />
          <StatCard
            title="Total Orders"
            value={totalOrders}
            change="+5.7% from last month"
            icon={<FiShoppingCart size={24} />}
            iconBg="bg-yellow-500"
          />
          <StatCard
            title="Pending Orders"
            value={pendingOrders}
            change="+2.3% from last month"
            icon={<FiClock size={24} />}
            iconBg="bg-red-500"
            changeType={pendingOrders > 0 ? 'decrease' : 'increase'}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Sales Overview</h3>
              <select className="text-sm border-gray-200 rounded-md focus:ring-blue-500 focus:border-blue-500">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>This year</option>
              </select>
            </div>
            <SalesChart />
          </div>

          <div className="lg:col-span-1">
            <RecentActivity activities={recentActivities} />
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
            <Link to="/purchase-orders" className="text-sm font-medium text-blue-600 hover:text-blue-800">
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(purchaseOrders || []).slice(0, 5).map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      <Link to={`/purchase-orders/${order._id}`}>
                        #{order.orderNumber || 'N/A'}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.supplier_name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                        }`}>
                        {order.status || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      ${order?.total || '0.00'}
                    </td>
                  </tr>
                ))}
                {(purchaseOrders || []).length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
