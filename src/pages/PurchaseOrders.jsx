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
import { getCustomersFromDetails } from "../redux/customerDetailsSlice";
import Select from "react-select/base";

// Utility function to generate a 7-digit reference number
const generateRefNo = () => {
  return Math.floor(1000000 + Math.random() * 9000000).toString();
};

// Validation schema using Yup
const validationSchema = Yup.object({
  customerName: Yup.string().required("Customer is required"),
  refNo: Yup.string().required("Reference number is required"),
  mobile: Yup.string()
    .required("Mobile is required")
    .matches(/^\d+$/, "Mobile must be a valid number"),
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
  const { customers } = useSelector((state) => state?.customerDetails);
  const [editingOrder, setEditingOrder] = useState(null);
  const [deletePopup, setDeletePopup] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  // const [selectedCustomer, setSelectedCustomer] = useState({value:"",label:""});
  const options = customers.map((customer) => ({
    label: `${customer.name}-${customer.mobile}`,
    value: customer.uuid,
  }));

  useEffect(() => {
    dispatch(getCustomers());
    dispatch(getPurchaseOrders());
    dispatch(getCustomersFromDetails());
  }, [dispatch]);

  const handleFormSubmit = (values, { resetForm }) => {
    dispatch(addEditPurchaseOrder(values));
    setEditingOrder(null);
    resetForm();
    setShowForm(false);
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
    }
  };

  const cancelDelete = () => {
    setDeletePopup(false);
    setOrderToDelete(null);
  };

  const filteredOrders = purchaseOrders?.filter((order) => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      order.customerName?.toLowerCase().includes(lowerSearch) ||
      order.mobile?.toLowerCase().includes(lowerSearch) ||
      order.address?.toLowerCase().includes(lowerSearch) ||
      order.itemName?.toLowerCase().includes(lowerSearch) ||
      String(order.price)?.toLowerCase().includes(lowerSearch) ||
      String(order.quantity)?.toLowerCase().includes(lowerSearch) ||
      String(order.refNo)?.toLowerCase().includes(lowerSearch) ||
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

        {showForm && (
          <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
            <h3 className="text-xl font-medium mb-4">
              {editingOrder ? "Edit Purchase Order" : "Add New Purchase Order"}
            </h3>
            <Formik
              initialValues={{
                customerName: editingOrder ? editingOrder.customerName : "",
                refNo: editingOrder ? editingOrder.refNo : generateRefNo(),
                mobile: editingOrder ? editingOrder.mobile : "",
                address: editingOrder ? editingOrder.address : "",
                price: editingOrder ? editingOrder.price : "",
                quantity: editingOrder ? editingOrder.quantity : "",
                itemName: editingOrder ? editingOrder.itemName : "groundnut",
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
                        Reference Number
                      </label>
                      <Field
                        type="text"
                        name="refNo"
                        disabled
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                      />
                      <ErrorMessage
                        name="refNo"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Customers
                      </label>
                      <Field
                        as="select"
                        name="customerSelect"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
                        onChange={(e) => {
                          const selectedCustomer = customers.find(c => c.uuid === e.target.value);
                          if (selectedCustomer) {
                            setFieldValue("customerName", selectedCustomer.name);
                            setFieldValue("mobile", selectedCustomer.mobile);
                            setFieldValue("address", selectedCustomer.address);
                          }
                        }}
                      >
                        <option value="">Select Customer</option>
                        {customers.map((s) => (
                          <option key={s.uuid} value={s.uuid}>
                            {s.name}-{s.mobile}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="customerSelect"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Customer Name
                      </label>
                      <Field
                        type="text"
                        name="customerName"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <ErrorMessage
                        name="customerName"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Mobile
                      </label>
                      <Field
                        type="text"
                        name="mobile"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <ErrorMessage
                        name="mobile"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Address
                      </label>
                      <Field
                        type="address"
                        name="address"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <ErrorMessage
                        name="address"
                        component="div"
                        className="text-red-500 text-sm"
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
                      className="w-half mr-4 py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                    >
                      {editingOrder ? "Update Order" : "Add Order"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="w-half  py-2 px-4 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        )}

        {/* List of orders */}
        <div className="rounded-xl shadow-lg border border-gray-200 mb-8">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search orders..."
            className="p-3 w-full border-b border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Ref. No
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Mobile
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Item Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.uuid}
                    className="hover:bg-sky-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {order.refNo}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {order.customerName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {order.mobile}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {order.itemName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {order.price}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {order.quantity}
                    </td>
                    <td className="px-6 py-4 text-sm text-indigo-600 font-medium">
                      {order.status}
                    </td>
                    <td className="px-6 py-4 w-fit flex">
                      <button
                        onClick={() => handleEditClick(order)}
                        className="text-sky-600 hover:text-sky-800 font-medium mr-4 cursor-pointer transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(order)}
                        className="text-rose-600 hover:text-rose-800 font-medium cursor-pointer transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {deletePopup && (
          <ConfirmModal
            isOpen={deletePopup}
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
            message="Are you sure you want to delete this purchase order?"
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default PurchaseOrders;
