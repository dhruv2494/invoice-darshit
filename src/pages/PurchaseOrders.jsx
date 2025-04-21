import { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import DashboardLayout from "../components/DashboardLayout";
import {
  addEditPurchaseOrder,
  deletePurchaseOrder,
  getPurchaseOrders,
} from "../redux/purchaseOrderSlice";
import { useDispatch, useSelector } from "react-redux";
import ConfirmModal from "../components/ConfirmModal";
import { toast } from "react-toastify";
import { getCustomers } from "../redux/customerSlice";

// Validation schema using Yup
const validationSchema = Yup.object({
  customer: Yup.string().required("Customer is required"),
  mobile: Yup.string()
    .required("Mobile is required")
    .matches(/^\d+$/, "Mobile must be a valid number"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  price: Yup.number().required("Price is required").positive(),
  quantity: Yup.number().required("Quantity is required").positive(),
  itemName: Yup.string().required("Item name is required"),
  status: Yup.string().required("Status is required"),
});

const PurchaseOrders = () => {
  const dispatch = useDispatch();
  const { purchaseOrders, status } = useSelector(
    (state) => state.purchaseOrder
  );
  const customers = useSelector((state) => state.customer.customers);

  const [editingOrder, setEditingOrder] = useState(null);
  const [deletePopup, setDeletePopup] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(getCustomers());
    dispatch(getPurchaseOrders());
  }, [dispatch]);

  const handleFormSubmit = (values, { resetForm }) => {
    dispatch(addEditPurchaseOrder(values));
    setEditingOrder(null);
    resetForm();
    setShowForm(false);
    toast.success("Purchase Order successfully added/updated!");
  };

  const handleEditClick = (order) => {
    setEditingOrder(order);
    setShowForm(true);
  };

  const handleAddClick = () => {
    setEditingOrder(null);
    setShowForm(true);
  };

  const handleDeleteClick = (order) => {
    setOrderToDelete(order);
    setDeletePopup(true);
  };

  const confirmDelete = () => {
    if (orderToDelete) {
      dispatch(deletePurchaseOrder(orderToDelete.uuid));
      setDeletePopup(false);
      setOrderToDelete(null);
      toast.success("Purchase Order successfully deleted!");
    }
  };

  const cancelDelete = () => {
    setDeletePopup(false);
    setOrderToDelete(null);
  };

  // Filtered orders based on search
  const filteredOrders = purchaseOrders.filter((order) => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      order.customerName?.toLowerCase().includes(lowerSearch) ||
      order.mobile?.toLowerCase().includes(lowerSearch) ||
      order.email?.toLowerCase().includes(lowerSearch) ||
      order.itemName?.toLowerCase().includes(lowerSearch) ||
      String(order.price)?.toLowerCase().includes(lowerSearch) || // Convert price to string
      String(order.quantity)?.toLowerCase().includes(lowerSearch) || // Convert quantity to string
      order.status?.toLowerCase().includes(lowerSearch)
    );
  });
  

  return (
    <DashboardLayout>
      <div className="px-6 py-4">
        <h2 className="text-3xl font-semibold mb-6">Purchase Orders</h2>
        <button
          onClick={handleAddClick}
          className="mb-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Add Purchase Order
        </button>



        {/* Form */}
        {showForm && (
          <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
            <h3 className="text-xl font-medium mb-4">
              {editingOrder ? "Edit Purchase Order" : "Add New Purchase Order"}
            </h3>
            <Formik
              initialValues={{
                customer: editingOrder ? editingOrder.customer : "",
                mobile: editingOrder ? editingOrder.mobile : "",
                email: editingOrder ? editingOrder.email : "",
                price: editingOrder ? editingOrder.price : "",
                quantity: editingOrder ? editingOrder.quantity : "",
                itemName: editingOrder ? editingOrder.itemName : "",
                status: editingOrder ? editingOrder.status : "",
                uuid: editingOrder ? editingOrder.uuid : "",
              }}
              validationSchema={validationSchema}
              onSubmit={handleFormSubmit}
              enableReinitialize
            >
              {({ setFieldValue }) => (
                <Form>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Customer
                      </label>
                      <Field
                        as="select"
                        name="customer"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
                        onChange={(e) => {
                          const selectedId = e.target.value;
                          setFieldValue("customer", selectedId);
                          const selectedCustomer = customers.find(
                            (c) => c.uuid === selectedId
                          );
                          if (selectedCustomer) {
                            setFieldValue("mobile", selectedCustomer.mobile);
                            setFieldValue("email", selectedCustomer.email);
                          } else {
                            setFieldValue("mobile", "");
                            setFieldValue("email", "");
                          }
                        }}
                      >
                        <option value="">Select Customer</option>
                        {customers.map((c) => (
                          <option key={c.uuid} value={c.uuid}>
                            {c.name}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="customer"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    {/* Mobile, Email, Price, Quantity, Item Name, Status */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Mobile
                      </label>
                      <Field
                        type="text"
                        name="mobile"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <Field
                        type="email"
                        name="email"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Price
                      </label>
                      <Field
                        type="number"
                        name="price"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <ErrorMessage
                        name="price"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Quantity
                      </label>
                      <Field
                        type="number"
                        name="quantity"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <ErrorMessage
                        name="quantity"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Item Name
                      </label>
                      <Field
                        type="text"
                        name="itemName"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <ErrorMessage
                        name="itemName"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Status
                      </label>
                      <Field
                        as="select"
                        name="status"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="">Select Status</option>
                        {status.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="status"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      type="submit"
                      className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                    >
                      {editingOrder ? "Update Order" : "Add Order"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="w-full mt-2 py-2 px-4 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        )}
        {/* Search Input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by customer, email, item, etc..."
            className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {/* Table */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-xl font-medium mb-4">Purchase Orders List</h3>
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                {[
                  "Customer",
                  "Mobile",
                  "Email",
                  "Price",
                  "Quantity",
                  "Item",
                  "Status",
                  "Actions",
                ].map((th) => (
                  <th
                    key={th}
                    className="px-4 py-2 text-sm font-medium text-gray-700"
                  >
                    {th}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.uuid} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {order.customerName}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {order.mobile}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {order.email}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {order.price}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {order.quantity}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {order.itemName}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {order.status || "Pending"}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700 flex gap-4">
                      <button
                        onClick={() => handleEditClick(order)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(order)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-2 text-sm text-center text-gray-500"
                  >
                    No purchase orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Delete Confirmation Modal */}
        {deletePopup && (
          <ConfirmModal
            isOpen={deletePopup}
            message={`Are you sure you want to delete ?`}
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default PurchaseOrders;
