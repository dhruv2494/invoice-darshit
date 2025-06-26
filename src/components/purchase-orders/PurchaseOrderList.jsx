import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  getPurchaseOrders, 
  deletePurchaseOrder,
  setFilters,
  selectAllPurchaseOrders,
  selectLoadingList,
  selectError,
  selectStatuses,
  selectFilters,
  selectLastFetched
} from '../../redux/purchaseOrderSlice';
import { FiEdit2, FiTrash2, FiEye, FiFilter, FiX, FiPlus, FiRefreshCw, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { format } from 'date-fns';
import { showToast } from '../../modules/utils';
import ConfirmModal from '../common/ConfirmModal';

const PurchaseOrderList = () => {
  const dispatch = useDispatch();
  const purchaseOrders = useSelector(selectAllPurchaseOrders);
  const loading = useSelector(selectLoadingList);
  const error = useSelector(selectError);
  const statuses = useSelector(selectStatuses);
  const filters = useSelector(selectFilters);
  const lastFetched = useSelector(selectLastFetched);
  
  const [showFilters, setShowFilters] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    status: filters.status || '',
    search: filters.search || '',
    dateRange: {
      from: filters.dateRange?.from || '',
      to: filters.dateRange?.to || ''
    }
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Load purchase orders on component mount, with caching to prevent re-fetching on quick navigation
  useEffect(() => {
    const now = new Date();
    const lastFetch = lastFetched ? new Date(lastFetched) : null;
    const secondsSinceLastFetch = lastFetch ? (now - lastFetch) / 1000 : Infinity;

    // Only fetch if data is older than 30 seconds or not present
    if (secondsSinceLastFetch > 30) {
      dispatch(getPurchaseOrders()).unwrap().catch(error => {
        console.error('Failed to fetch purchase orders:', error);
        showToast(error.message || 'Failed to load purchase orders', 'error');
      });
    }
  }, [dispatch]); // This stable dependency array prevents infinite loops.

  // Initialize local filters from Redux store on mount
  useEffect(() => {
    setLocalFilters({
      status: filters.status || '',
      search: filters.search || '',
      dateRange: {
        from: filters.dateRange?.from || '',
        to: filters.dateRange?.to || ''
      }
    });
  }, [filters]);

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
    dispatch(setFilters({
      ...localFilters,
      dateRange: {
        from: localFilters.dateRange.from,
        to: localFilters.dateRange.to
      }
    }));
    setShowFilters(false);
  };

  // Reset filters
  const resetFilters = () => {
    const resetValues = {
      status: '',
      search: '',
      dateRange: { from: '', to: '' }
    };
    setLocalFilters(resetValues);
    dispatch(setFilters(resetValues));
  };

  // Handle delete confirmation
  const handleDeleteClick = (order) => {
    setOrderToDelete(order);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (orderToDelete) {
      dispatch(deletePurchaseOrder(orderToDelete.id))
        .unwrap()
        .then(() => {
          showToast('Purchase order deleted successfully', 'success');
        })
        .catch((error) => {
          showToast(error || 'Failed to delete purchase order', 'error');
        });
    }
    setShowDeleteModal(false);
    setOrderToDelete(null);
  };

  // Manually refresh data
  const handleRefresh = () => {
    dispatch(getPurchaseOrders()).unwrap().catch(error => {
      console.error('Failed to manually refresh purchase orders:', error);
      showToast(error.message || 'Failed to refresh purchase orders', 'error');
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter purchase orders based on current filters
  const filteredOrders = useMemo(() => {
    return purchaseOrders.filter((order) => {
      const matchesSearch = !localFilters.search || 
        order.poNumber?.toLowerCase().includes(localFilters.search.toLowerCase()) ||
        order.supplierName?.toLowerCase().includes(localFilters.search.toLowerCase());
      
      const matchesStatus = !localFilters.status || 
        order.status?.toLowerCase() === localFilters.status.toLowerCase();
      
      const orderDate = new Date(order.orderDate);
      const fromDate = localFilters.dateRange.from ? new Date(localFilters.dateRange.from) : null;
      const toDate = localFilters.dateRange.to ? new Date(localFilters.dateRange.to) : null;
      
      const matchesDateRange = 
        (!fromDate || orderDate >= fromDate) && 
        (!toDate || orderDate <= new Date(toDate.getTime() + 24 * 60 * 60 * 1000));
      
      return matchesSearch && matchesStatus && matchesDateRange;
    });
  }, [purchaseOrders, localFilters]);
  
  // Calculate pagination
  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + pageSize);
  
  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };
  
  // Handle page size change
  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing page size
  };
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [localFilters]);

  if (loading && purchaseOrders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">Loading purchase orders...</p>
      </div>
    );
  }

  if (error) {
    return (
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
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Purchase Orders</h1>
          <p className="text-sm text-gray-600">Manage your purchase orders</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="w-full sm:w-auto">
            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              className="rounded-md border-gray-300 py-2 pl-3 pr-8 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  Show {size} per page
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className={`px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium ${
              loading ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            <div className="flex items-center">
              <FiRefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </div>
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <div className="flex items-center">
              <FiFilter className="mr-2 h-4 w-4" />
              Filters
            </div>
          </button>
          <Link
            to="/purchase-orders/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiPlus className="mr-2 h-4 w-4" />
            New Order
          </Link>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-gray-50 px-4 py-5 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700">Search</label>
              <input
                type="text"
                name="search"
                id="search"
                value={localFilters.search}
                onChange={handleFilterChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search by PO # or supplier"
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
              <select
                id="status"
                name="status"
                value={localFilters.status}
                onChange={handleFilterChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">All Statuses</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700">From Date</label>
              <input
                type="date"
                name="fromDate"
                id="fromDate"
                value={localFilters.dateRange.from}
                onChange={(e) => setLocalFilters(prev => ({
                  ...prev,
                  dateRange: { ...prev.dateRange, from: e.target.value }
                }))}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="toDate" className="block text-sm font-medium text-gray-700">To Date</label>
              <input
                type="date"
                name="toDate"
                id="toDate"
                value={localFilters.dateRange.to}
                onChange={(e) => setLocalFilters(prev => ({
                  ...prev,
                  dateRange: { ...prev.dateRange, to: e.target.value }
                }))}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiX className="mr-2 h-4 w-4" />
              Reset
            </button>
            <button
              type="button"
              onClick={applyFilters}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Purchase Orders Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                PO Number
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Supplier
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expected Delivery
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedOrders.length > 0 ? (
              paginatedOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <Link to={`/purchase-orders/${order.id}`} className="text-blue-600 hover:text-blue-900">
                      {order.po_number}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.supplier_name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.order_date ? format(new Date(order.order_date), 'MMM dd, yyyy') : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.expected_delivery_date ? format(new Date(order.expected_delivery_date), 'MMM dd, yyyy') : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(order.total || 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.status)}`}>
                      {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link
                        to={`/purchase-orders/${order.id}`}
                        className="text-blue-600 hover:text-blue-900"
                        title="View"
                      >
                        <FiEye className="h-4 w-4" />
                      </Link>
                      <Link
                        to={`/purchase-orders/${order.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Edit"
                      >
                        <FiEdit2 className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(order)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                  No purchase orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{Math.min(startIndex + 1, totalItems)}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(startIndex + pageSize, totalItems)}
                  </span>{' '}
                  of <span className="font-medium">{totalItems}</span> orders
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <FiChevronLeft className="h-5 w-5" />
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNum
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <FiChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Purchase Order"
        message="Are you sure you want to delete this purchase order? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
      />
    </div>
  );
};

export default PurchaseOrderList;
