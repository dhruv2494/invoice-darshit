import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiEye, FiFilter, FiX, FiPlus, FiRefreshCw, FiDownload } from 'react-icons/fi';
import { format } from 'date-fns';
import ConfirmModal from '../common/ConfirmModal';

// Mock data for UI demonstration
const mockInvoices = [
  {
    uuid: '1',
    invoiceNumber: 'INV-2023-001',
    customerName: 'Acme Corp',
    invoiceDate: '2023-06-15',
    dueDate: '2023-07-15',
    totalAmount: 1250.75,
    status: 'paid'
  },
  {
    uuid: '2',
    invoiceNumber: 'INV-2023-002',
    customerName: 'Globex Inc',
    invoiceDate: '2023-06-20',
    dueDate: '2023-07-20',
    totalAmount: 845.50,
    status: 'sent'
  },
  {
    uuid: '3',
    invoiceNumber: 'INV-2023-003',
    customerName: 'Soylent Corp',
    invoiceDate: '2023-06-25',
    dueDate: '2023-07-25',
    totalAmount: 2300.00,
    status: 'draft'
  },
  {
    uuid: '4',
    invoiceNumber: 'INV-2023-004',
    customerName: 'Initech',
    invoiceDate: '2023-05-10',
    dueDate: '2023-06-10',
    totalAmount: 3420.25,
    status: 'overdue'
  },
  {
    uuid: '5',
    invoiceNumber: 'INV-2023-005',
    customerName: 'Umbrella Corp',
    invoiceDate: '2023-06-30',
    dueDate: '2023-07-30',
    totalAmount: 1750.00,
    status: 'paid'
  }
];

const InvoiceList = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    status: '',
    search: '',
    dateRange: {
      from: '',
      to: ''
    }
  });
  
  // For UI demo, use mock data
  const [invoices, setInvoices] = useState(mockInvoices);
  const loading = false; // No loading state needed for mock data
  const error = null; // No error state needed for mock data

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Apply filters
  const applyFilters = () => {
    // In a real app, we would dispatch the filters to Redux
    // For UI demo, we'll just close the filter panel
    setShowFilters(false);
  };

  // Reset filters
  const resetFilters = () => {
    setLocalFilters({
      status: '',
      search: '',
      dateRange: {
        from: '',
        to: ''
      }
    });
  };

  // Handle date range change
  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [name]: value
      }
    }));
  };

  // Handle delete click
  const handleDeleteClick = (invoice) => {
    setInvoiceToDelete(invoice);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (!invoiceToDelete) return;
    
    // Remove the invoice from the local state
    const updatedInvoices = invoices.filter(inv => inv.uuid !== invoiceToDelete.uuid);
    setInvoices(updatedInvoices);
    
    // Show success message (in a real app, you might use a toast notification)
    console.log(`Invoice ${invoiceToDelete.invoiceNumber} deleted`);
    
    // Close the modal
    setShowDeleteModal(false);
    setInvoiceToDelete(null);
  };

  // Cancel delete
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setInvoiceToDelete(null);
  };

  // Handle download invoice
  const handleDownload = (invoiceId, invoiceNumber) => {
    // Simulate download functionality
    console.log(`Downloading invoice ${invoiceNumber} (${invoiceId})`);
    
    // In a real app, this would trigger a file download
    // For now, we'll just log to console
    console.log('Invoice download started...');
    
    // Simulate download completion
    setTimeout(() => {
      console.log(`Invoice ${invoiceNumber} downloaded successfully`);
    }, 1000);
  };

  // Filter invoices based on current filters
  const filteredInvoices = invoices.filter(invoice => {
    // Status filter
    if (localFilters.status && invoice.status !== localFilters.status) return false;
    
    // Date range filter
    if (localFilters.dateRange.from || localFilters.dateRange.to) {
      const invoiceDate = new Date(invoice.invoiceDate);
      
      if (localFilters.dateRange.from) {
        const fromDate = new Date(localFilters.dateRange.from);
        fromDate.setHours(0, 0, 0, 0);
        if (invoiceDate < fromDate) return false;
      }
      
      if (localFilters.dateRange.to) {
        const toDate = new Date(localFilters.dateRange.to);
        toDate.setHours(23, 59, 59, 999);
        if (invoiceDate > toDate) return false;
      }
    }
    
    // Search filter
    if (localFilters.search) {
      const searchTerm = localFilters.search.toLowerCase();
      return (
        (invoice.invoiceNumber && invoice.invoiceNumber.toLowerCase().includes(searchTerm)) ||
        (invoice.customerName && invoice.customerName.toLowerCase().includes(searchTerm)) ||
        (invoice.status && invoice.status.toLowerCase().includes(searchTerm)) ||
        (invoice.totalAmount && invoice.totalAmount.toString().includes(localFilters.search))
      );
    }
    
    return true;
  });

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-gray-200 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  // Status options for filter
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'draft', label: 'Draft' },
    { value: 'sent', label: 'Sent' },
    { value: 'paid', label: 'Paid' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Invoices</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all invoices including their details and status.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/invoices/new"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          >
            <FiPlus className="-ml-1 mr-2 h-5 w-5" />
            New Invoice
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6">
        <div className="flex justify-between items-center">
          <div className="relative w-full max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              name="search"
              value={localFilters.search}
              onChange={handleFilterChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search invoices..."
            />
          </div>
          
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiFilter className="-ml-0.5 mr-2 h-4 w-4" />
              Filter
            </button>
            
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiRefreshCw className="-ml-0.5 mr-2 h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="mt-4 bg-white shadow rounded-lg p-4 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status-filter"
                  name="status"
                  value={localFilters.status}
                  onChange={handleFilterChange}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="date-from" className="block text-sm font-medium text-gray-700 mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  id="date-from"
                  name="from"
                  value={localFilters.dateRange.from}
                  onChange={handleDateRangeChange}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                />
              </div>
              
              <div>
                <label htmlFor="date-to" className="block text-sm font-medium text-gray-700 mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  id="date-to"
                  name="to"
                  value={localFilters.dateRange.to}
                  onChange={handleDateRangeChange}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                />
              </div>
            </div>
            
            <div className="mt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiX className="-ml-0.5 mr-2 h-4 w-4" />
                Clear Filters
              </button>
              
              <button
                type="button"
                onClick={applyFilters}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Invoices Table */}
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              {loading === 'pending' && !invoices.length ? (
                <div className="flex justify-center items-center p-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : error ? (
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">
                        {error}
                      </p>
                    </div>
                  </div>
                </div>
              ) : filteredInvoices.length === 0 ? (
                <div className="text-center py-12">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      vectorEffect="non-scaling-stroke"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No invoices</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by creating a new invoice.
                  </p>
                  <div className="mt-6">
                    <Link
                      to="/invoices/new"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                      New Invoice
                    </Link>
                  </div>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Invoice #
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Customer
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Date
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Due Date
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Amount
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredInvoices.map((invoice) => (
                      <tr key={invoice.uuid} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-blue-600 sm:pl-6">
                          <Link to={`/invoices/${invoice.uuid}`} className="hover:underline">
                            {invoice.invoiceNumber}
                          </Link>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {invoice.customerName}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {invoice.invoiceDate ? format(new Date(invoice.invoiceDate), 'MMM dd, yyyy') : 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {invoice.dueDate ? format(new Date(invoice.dueDate), 'MMM dd, yyyy') : 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 font-medium">
                          {formatCurrency(invoice.totalAmount)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4">
                          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(invoice.status)}`}>
                            {invoice.status ? invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1) : 'N/A'}
                          </span>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleDownload(invoice.uuid, invoice.invoiceNumber)}
                              className="text-gray-400 hover:text-gray-500"
                              title="Download"
                            >
                              <FiDownload className="h-4 w-4" />
                            </button>
                            <Link
                              to={`/invoices/${invoice.uuid}`}
                              className="text-blue-600 hover:text-blue-900"
                              title="View"
                            >
                              <FiEye className="h-4 w-4" />
                            </Link>
                            <Link
                              to={`/invoices/${invoice.uuid}/edit`}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="Edit"
                            >
                              <FiEdit2 className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => handleDeleteClick(invoice)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete"
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Delete Invoice
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete invoice {invoiceToDelete?.invoiceNumber}? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={cancelDelete}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceList;
