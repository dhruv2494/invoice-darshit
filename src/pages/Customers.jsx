import { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import DashboardLayout from "../components/DashboardLayout";
import {
  addEditCustomer,
  deleteCustomer,
  getCustomers,
} from "../redux/customerSlice";
import { useDispatch, useSelector } from "react-redux";
import ConfirmModal from "../components/ConfirmModal";
import { toast } from "react-toastify";

// Validation schema using Yup
const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  mobile: Yup.string()
    .required("Mobile is required")
    .matches(/^\d+$/, "Mobile must be a valid number"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
});

const Customers = () => {
  const customers = useSelector((state) => state?.customer?.customers);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [deletePopup, setDeletePopup] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCustomers());
  }, [dispatch]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.mobile.includes(searchQuery)
  );

  const handleFormSubmit = (values, { resetForm }) => {
    dispatch(addEditCustomer(values));
    setEditingCustomer(null);
    resetForm();
    setShowForm(false);
  };

  const handleEditClick = (customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleAddClick = () => {
    setEditingCustomer(null);
    setShowForm(true);
  };

  const handleDeleteClick = (customer) => {
    setCustomerToDelete(customer);
    setDeletePopup(true);
  };

  const confirmDelete = () => {
    if (customerToDelete) {
      dispatch(deleteCustomer(customerToDelete.uuid));
      setDeletePopup(false);
      setCustomerToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeletePopup(false);
    setCustomerToDelete(null);
  };

  return (
    <DashboardLayout>
      <div className="px-6 py-4">
        <h2 className="text-3xl font-semibold mb-6">Customer Management</h2>

        {/* Add Customer Button */}
        <button
          onClick={handleAddClick}
          className="mb-6 px-5 py-2.5 bg-green-600 text-white font-medium rounded-xl hover:bg-emerald-700 shadow-md transition cursor-pointer"
        >
          Add Customer
        </button>

        {/* Add or Edit Customer Form */}
        {showForm && (
          <div className="bg-white shadow-lg rounded-xl p-6 mb-8 border border-gray-100">
            <h3 className="text-xl font-medium mb-4 text-indigo-600">
              {editingCustomer ? "Edit Customer" : "Add New Customer"}
            </h3>
            <Formik
              initialValues={{
                name: editingCustomer ? editingCustomer.name : "",
                mobile: editingCustomer ? editingCustomer.mobile : "",
                email: editingCustomer ? editingCustomer.email : "",
                uuid: editingCustomer ? editingCustomer.uuid : "",
              }}
              validationSchema={validationSchema}
              onSubmit={handleFormSubmit}
              enableReinitialize={true}
            >
              <Form>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <Field
                      type="text"
                      name="name"
                      className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                      placeholder="Enter name"
                    />
                    <ErrorMessage
                      name="name"
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
                      className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                      placeholder="Enter mobile number"
                    />
                    <ErrorMessage
                      name="mobile"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <Field
                      type="email"
                      name="email"
                      className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                      placeholder="Enter email"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <button
                    type="submit"
                    className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 shadow-md transition cursor-pointer"
                  >
                    {editingCustomer ? "Update Customer" : "Add Customer"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="w-full mt-2 py-2 px-4 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 shadow-sm transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </Form>
            </Formik>
          </div>
        )}

        {/* Search Input */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name, email, or mobile..."
            className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        {/* Customers Table */}
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
          <h3 className="text-xl font-medium mb-4 text-indigo-600">
            Customer List
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left text-sm text-gray-700 font-semibold">
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Mobile</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers?.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <tr
                      key={customer.uuid}
                      className="border-b hover:bg-indigo-50 transition"
                    >
                      <td className="px-4 py-2 text-sm text-gray-700">
                        {customer.name}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700">
                        {customer.mobile}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700">
                        {customer.email}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700 flex gap-4 cursor-pointer">
                        <button
                          onClick={() => handleEditClick(customer)}
                          className="text-indigo-600 hover:text-indigo-800 font-medium transition cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(customer)}
                          className="text-rose-600 hover:text-rose-800 font-medium transition cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-2 text-sm text-center text-gray-500"
                    >
                      No customers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Confirm Modal for Deletion */}
      <ConfirmModal
        isOpen={deletePopup}
        title="Confirm Deletion"
        message={`Are you sure you want to delete "${customerToDelete?.name}"?`}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
      />
    </DashboardLayout>
  );
};

export default Customers;
