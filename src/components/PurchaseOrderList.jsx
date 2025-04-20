import { useEffect, useState } from "react";
import axios from "axios";

const PurchaseOrderList = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await axios.get("/api/purchase-orders");
    setOrders(res.data);
  };

  return (
    <div className="bg-white p-6 shadow rounded">
      <h2 className="text-xl font-bold mb-4">All Purchase Orders</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Ref No</th>
              <th className="border p-2">User</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Delivery</th>
              <th className="border p-2">Item</th>
            </tr>
          </thead>
          <tbody>
            {/* {orders.map((order) => (
              <tr key={order._id}>
                <td className="border p-2">{order.referenceNumber}</td>
                <td className="border p-2">{order.user?.name || "N/A"}</td>
                <td className="border p-2">{order.phone}</td>
                <td className="border p-2">{order.email}</td>
                <td className="border p-2">{order.price}</td>
                <td className="border p-2">{order.quantity}</td>
                <td className="border p-2">{order.deliveryDate}</td>
                <td className="border p-2">{order.itemName}</td>
              </tr>
            ))} */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchaseOrderList;
