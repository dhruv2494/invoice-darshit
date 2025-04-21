import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white flex flex-col p-4">
      <h2 className="text-2xl font-bold mb-6">Admin</h2>
      <Link to="/dashboard" className="mb-3 hover:text-blue-400">Dashboard</Link>
      <Link to="/purchase-orders" className="mb-3 hover:text-blue-400">Purchase Orders</Link>
      <Link to="/Customers" className="mb-3 hover:text-blue-400">Customers</Link>
      <Link to="/invoices" className="hover:text-blue-400">Invoices</Link>
    </div>
  );
};

export default Sidebar;
