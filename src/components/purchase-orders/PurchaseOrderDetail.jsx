import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getPurchaseOrderById, selectCurrentOrder, selectLoading, selectError } from '../../redux/purchaseOrderSlice';
import { format } from 'date-fns';
import { FiPrinter, FiArrowLeft, FiEdit } from 'react-icons/fi';

const PurchaseOrderDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const purchaseOrder = useSelector(selectCurrentOrder);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  useEffect(() => {
    if (id) {
      dispatch(getPurchaseOrderById(id));
    }
  }, [dispatch, id]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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

  if (!purchaseOrder) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Purchase Order not found</h3>
        <p className="mt-2 text-sm text-gray-500">The purchase order you're looking for doesn't exist or has been deleted.</p>
        <div className="mt-6">
          <Link
            to="/purchase-orders"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiArrowLeft className="mr-2 h-4 w-4" />
            Back to Purchase Orders
          </Link>
        </div>
      </div>
    );
  }

  const {
    poNumber,
    orderDate,
    expectedDeliveryDate,
    status,
    supplierName,
    supplierAddress,
    supplierPhone,
    supplierEmail,
    notes,
    terms,
    items = [],
    subtotal = 0,
    tax = 0,
    total = 0,
  } = purchaseOrder;

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      {/* Header */}
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
        <div>
          <div className="flex items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Purchase Order: {poNumber}
            </h3>
            <span className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(status)}`}>
              {status?.charAt(0).toUpperCase() + status?.slice(1) || 'N/A'}
            </span>
          </div>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Created on {orderDate ? format(new Date(orderDate), 'MMMM d, yyyy') : 'N/A'}
          </p>
        </div>
        <div className="flex space-x-3">
          <Link
            to={`/purchase-orders/${id}/edit`}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiEdit className="mr-2 h-4 w-4" />
            Edit
          </Link>
          <button
            type="button"
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiPrinter className="mr-2 h-4 w-4" />
            Print
          </button>
        </div>
      </div>

      {/* Order Info */}
      <div className="px-4 py-5 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Supplier Info */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Supplier</h4>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-900">{supplierName || 'N/A'}</p>
              {supplierAddress && (
                <p className="text-sm text-gray-500">{supplierAddress}</p>
              )}
              {supplierPhone && (
                <p className="text-sm text-gray-500">{supplierPhone}</p>
              )}
              {supplierEmail && (
                <p className="text-sm text-blue-600">{supplierEmail}</p>
              )}
            </div>
          </div>

          {/* Order Dates */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Order Dates</h4>
            <div className="space-y-1">
              <div>
                <p className="text-xs text-gray-500">Order Date</p>
                <p className="text-sm text-gray-900">
                  {orderDate ? format(new Date(orderDate), 'MMMM d, yyyy') : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Expected Delivery</p>
                <p className="text-sm text-gray-900">
                  {expectedDeliveryDate ? format(new Date(expectedDeliveryDate), 'MMMM d, yyyy') : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Order Summary</h4>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Subtotal:</span>
                <span className="text-sm font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Tax ({tax}%):</span>
                <span className="text-sm font-medium">
                  {formatCurrency((subtotal * tax) / 100)}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="text-base font-medium">Total:</span>
                <span className="text-base font-bold">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Items</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Qty
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit Price
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tax (%)
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-normal">
                    <div className="text-sm font-medium text-gray-900">{item.productName}</div>
                    {item.description && (
                      <div className="text-sm text-gray-500 mt-1">{item.description}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                    {item.taxRate}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {formatCurrency((item.quantity * item.unitPrice) * (1 + (item.taxRate || 0) / 100))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notes and Terms */}
      <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {notes && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Notes</h4>
              <p className="text-sm text-gray-700 whitespace-pre-line">{notes}</p>
            </div>
          )}
          {terms && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Terms & Conditions</h4>
              <p className="text-sm text-gray-700 whitespace-pre-line">{terms}</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-4 bg-gray-50 border-t border-gray-200 sm:px-6 flex justify-end">
        <Link
          to="/purchase-orders"
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FiArrowLeft className="mr-2 h-4 w-4" />
          Back to Purchase Orders
        </Link>
      </div>
    </div>
  );
};

export default PurchaseOrderDetail;
