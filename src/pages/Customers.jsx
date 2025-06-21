import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiEye, FiX } from "react-icons/fi";
import DashboardLayout from "../components/DashboardLayout";
import ConfirmModal from "../components/common/ConfirmModal";
import { deleteCustomer, getCustomers } from "../redux/customerSlice";
import { showToast } from "../modules/utils";

const Customers = () => {
  const { customers, loading, error } = useSelector((state) => state.customer || {});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    dateFrom: "",
    dateTo: ""
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getCustomers());
  }, [dispatch]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: "",
      dateFrom: "",
      dateTo: ""
    });
    setSearchQuery("");
  };

  const filteredCustomers = (customers || []).filter(customer => {
    if (!customer) return false;
    
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      customer.name?.toLowerCase().includes(searchLower) ||
      customer.mobile?.includes(searchQuery) ||
      customer.email?.toLowerCase().includes(searchLower) ||
      (customer.gstNumber && customer.gstNumber.toLowerCase().includes(searchLower));
    
    // Apply status filter if set
    const matchesStatus = !filters.status || 
      (filters.status === 'active' && customer.isActive !== false) ||
      (filters.status === 'inactive' && customer.isActive === false);
    
    return matchesSearch && matchesStatus;
  });

  const handleEditCustomer = (customer) => {
    navigate(`/customers/${customer.sCustGUID}`);
  };

  const handleViewCustomer = (customer) => {
    navigate(`/customer-details/${customer.sCustGUID}`);
  };

  const handleAddClick = () => {
    navigate('/customers/new');
  };

  const handleDeleteClick = (customer) => {
    setCustomerToDelete(customer);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (customerToDelete) {
      dispatch(deleteCustomer(customerToDelete.uuid))
        .unwrap()
        .then(() => {
          showToast("Customer deleted successfully", "success");
          dispatch(getCustomers());
        })
        .catch((error) => {
          showToast(error.message || "Failed to delete customer", "error");
        });
    }
    setDeleteModalOpen(false);
    setCustomerToDelete(null);
  };
  return (
    // <DashboardLayout>
      <div className="p-4 sm:p-6">
        {/* Header with title and add button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your customers and their information
            </p>
          </div>
          <button
            onClick={handleAddClick}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiPlus className="mr-2 h-4 w-4" />
            Add Customer
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search customers..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            <div className="flex items-center space-x-2">
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiX className="h-4 w-4 mr-1" /> Clear
              </button>
            </div>
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Contact
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    GSTIN
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Address
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-4 text-center text-sm text-red-500"
                    >
                      Error loading customers: {error}
                    </td>
                  </tr>
                ) : filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.uuid} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-medium">
                              {customer.name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {customer.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {customer.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {customer.mobile}
                        </div>
                        <div className="text-sm text-gray-500">
                          {customer.phone || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.gstNumber || "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {customer.address?.split("\n")[0] || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {customer.city}{" "}
                          {customer.state && `, ${customer.state}`}{" "}
                          {customer.pincode && `- ${customer.pincode}`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleViewCustomer(customer)}
                            className="text-green-600 hover:text-green-900 mr-2"
                            title="View Details"
                          >
                            <FiEye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleEditCustomer(customer)}
                            className="text-blue-600 hover:text-blue-900 mr-2"
                            title="Edit"
                          >
                            <FiEdit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(customer)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No customers found. Try adjusting your search or add a new
                      customer.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>



        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          title="Delete Customer"
          message={customerToDelete ? `Are you sure you want to delete ${customerToDelete.name}? This action cannot be undone.` : "Delete this customer?"}
          confirmText="Delete"
          cancelText="Cancel"
          isDanger={true}
        />
      </div>
    // </DashboardLayout>
  );
};

export default Customers;
