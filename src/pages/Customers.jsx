import { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import DashboardLayout from "../components/DashboardLayout";
import { addEditCustomer, deleteCustomer, getCustomers } from "../redux/customerSlice";
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

  // Handle search query change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter customers based on the search query
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
    toast.success("Customer successfully added/updated!");
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
      toast.success("Customer successfully deleted!");
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

        {/* Search Input */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name, email, or mobile..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        {/* Add Customer Button */}
        <button
          onClick={handleAddClick}
          className="mb-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Add Customer
        </button>

        {/* Add or Edit Customer Form */}
        {showForm && (
          <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
            <h3 className="text-xl font-medium mb-4">
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
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <Field
                      type="text"
                      name="name"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter name"
                    />
                    <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Mobile</label>
                    <Field
                      type="text"
                      name="mobile"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter mobile number"
                    />
                    <ErrorMessage name="mobile" component="div" className="text-red-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <Field
                      type="email"
                      name="email"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter email"
                    />
                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {editingCustomer ? "Update Customer" : "Add Customer"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="w-full mt-2 py-2 px-4 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </Form>
            </Formik>
          </div>
        )}

        {/* Customers Table */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-xl font-medium mb-4">Customer List</h3>
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-2 text-sm font-medium text-gray-700">Name</th>
                <th className="px-4 py-2 text-sm font-medium text-gray-700">Mobile</th>
                <th className="px-4 py-2 text-sm font-medium text-gray-700">Email</th>
                <th className="px-4 py-2 text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers?.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr key={customer.uuid} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-700">{customer.name}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{customer.mobile}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{customer.email}</td>
                    <td className="px-4 py-2 text-sm text-gray-700 flex gap-4">
                      <button
                        onClick={() => handleEditClick(customer)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(customer)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-2 text-sm text-center text-gray-500">
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
