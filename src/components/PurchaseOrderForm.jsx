import { useState, useEffect } from "react";
import axios from "axios";

const PurchaseOrderForm = ({ onOrderCreated }) => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    userId: "",
    phone: "",
    email: "",
    price: "",
    quantity: "",
    deliveryDate: "",
    itemName: "Groundnut",
    referenceNumber: "",
  });

  useEffect(() => {
    axios.get("/api/users").then((res) => {
      setUsers(res.data);
    });

    // Generate random 7-digit reference number
    const ref = Math.floor(1000000 + Math.random() * 9000000).toString();
    setForm((prev) => ({ ...prev, referenceNumber: ref }));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("/api/purchase-orders", form);
    onOrderCreated(); // refresh list
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow rounded p-6 mb-6 space-y-4"
    >
      <h2 className="text-xl font-bold mb-2">New Purchase Order</h2>

      {/* <select
        name="userId"
        value={form.userId}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
      >
        <option value="">Select Existing User</option>
        {users.map((u) => (
          <option key={u._id} value={u._id}>
            {u.name}
          </option>
        ))}
      </select> */}

      <input
        name="phone"
        value={form.phone}
        onChange={handleChange}
        placeholder="Phone"
        className="w-full border px-3 py-2 rounded"
      />
      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        className="w-full border px-3 py-2 rounded"
      />
      <input
        name="price"
        value={form.price}
        onChange={handleChange}
        placeholder="Price"
        type="number"
        className="w-full border px-3 py-2 rounded"
      />
      <input
        name="quantity"
        value={form.quantity}
        onChange={handleChange}
        placeholder="Estimated Quantity"
        type="number"
        className="w-full border px-3 py-2 rounded"
      />
      <input
        name="deliveryDate"
        type="date"
        value={form.deliveryDate}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
      />

      <input
        name="itemName"
        value={form.itemName}
        onChange={handleChange}
        placeholder="Item Name"
        className="w-full border px-3 py-2 rounded"
      />

      <p className="text-gray-500">Ref: {form.referenceNumber}</p>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Create Order
      </button>
    </form>
  );
};

export default PurchaseOrderForm;
