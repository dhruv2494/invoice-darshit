import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FiEdit2,
  FiPlus,
  FiArrowLeft,
  FiFileText,
  FiShoppingBag,
  FiPhone,
  FiMail,
  FiCreditCard,
  FiDollarSign,
  FiCalendar,
  FiMapPin,
  FiTruck,
  FiBox,
  FiCheckCircle,
  FiClock,
  FiXCircle
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { getPurchaseOrderById } from "../redux/purchaseOrderSlice";

const PurchaseOrderDetails = () => {
  const { uuid } = useParams();
  const dispatch = useDispatch();
  const { currentOrder } = useSelector((state) => state.purchaseOrder);
  useEffect(() => {
    dispatch(getPurchaseOrderById(uuid));
  }, [uuid]);
  const purchaseOrder = currentOrder ? { ...currentOrder, supplier: { ...(currentOrder.supplier[0] || {}) } } : {
    id: uuid || 'PO-1001',
    poNumber: 'PO-1001',
    orderDate: '2023-06-15',
    status: 'completed', // draft, sent, received, cancelled
    supplier: {
      id: 'SUP-001',
      name: 'Global Suppliers Inc.',
      contactPerson: 'John Smith',
      email: 'john@globalsuppliers.com',
      phone: '+1 (555) 123-4567',
      gst_number: '22AAAAA0000A1Z5',
      address: '123 Business St, Suite 100, New York, NY 10001',
    },
    expectedDeliveryDate: '2023-06-30',
    terms: 'Net 30',
    notes: 'Please ensure all items are properly packaged.',
    items: [
      {
        id: 'ITEM-001',
        productName: 'Premium Groundnut',
        description: 'High-quality groundnut for processing',
        quantity: 100,
        unit: 'kg',
        unit_price: 2.50,
        total: 250.00,
      },
      {
        id: 'ITEM-002',
        productName: 'Organic Peanuts',
        description: 'Premium organic peanuts',
        quantity: 50,
        unit: 'kg',
        unit_price: 3.20,
        total: 160.00,
      },
    ],
    subtotal: 410.00,
    tax: 73.80,
    shipping: 50.00,
    total: 533.80,
    createdAt: '2023-06-15T10:30:00.000Z',
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Get status badge style
  const getStatusBadge = (status) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'received':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'draft':
        return <FiFileText className="mr-2 h-5 w-5" />;
      case 'sent':
        return <FiClock className="mr-2 h-5 w-5" />;
      case 'received':
        return <FiCheckCircle className="mr-2 h-5 w-5" />;
      case 'cancelled':
        return <FiXCircle className="mr-2 h-5 w-5" />;
      default:
        return <FiFileText className="mr-2 h-5 w-5" />;
    }
  };

  // Render order summary
  const renderOrderSummary = () => (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Purchase Order #{purchaseOrder.poNumber}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Created on {formatDate(purchaseOrder.orderDate)}
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(purchaseOrder.status)}`}>
              {getStatusIcon(purchaseOrder.status)}
              {purchaseOrder.status.charAt(0).toUpperCase() + purchaseOrder.status.slice(1)}
            </span>
          </div>
        </div>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <FiDollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Amount</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(purchaseOrder.total)}
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <FiCalendar className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Order Date</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatDate(purchaseOrder.orderDate)}
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
              <FiTruck className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Delivery Date</p>
              <p className="text-lg font-semibold text-gray-900">
                {purchaseOrder.expectedDeliveryDate ? formatDate(purchaseOrder.expectedDeliveryDate) : 'N/A'}
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <FiCreditCard className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Payment Terms</p>
              <p className="text-lg font-semibold text-gray-900">
                {purchaseOrder.terms || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render supplier information
  const renderSupplierInfo = () => (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Supplier Information</h3>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Supplier</h4>
            <p className="mt-1 text-sm text-gray-900 font-medium">
              {purchaseOrder.supplier.name}
            </p>
            <p className="text-sm text-gray-500">
              {purchaseOrder.supplier.contactPerson}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Contact Information</h4>
            <p className="mt-1 text-sm text-gray-900">
              <FiMail className="inline mr-2 h-4 w-4 text-gray-400" />
              {purchaseOrder.supplier.email}
            </p>
            <p className="mt-1 text-sm text-gray-900">
              <FiPhone className="inline mr-2 h-4 w-4 text-gray-400" />
              {purchaseOrder.supplier.phone}
            </p>
            {purchaseOrder.supplier.gst_number && (
              <p className="mt-1 text-sm text-gray-900">
                <FiCreditCard className="inline mr-2 h-4 w-4 text-gray-400" />
                GST: {purchaseOrder.supplier.gst_number}
              </p>
            )}
          </div>
          <div className="sm:col-span-2">
            <h4 className="text-sm font-medium text-gray-500">Address</h4>
            <p className="mt-1 text-sm text-gray-900">
              <FiMapPin className="inline mr-2 h-4 w-4 text-gray-400" />
              {purchaseOrder.supplier.address}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Render order items
  const renderOrderItems = () => (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Order Items</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unit Price
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {purchaseOrder.items.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{item.productName}</div>
                  {item.description && (
                    <div className="text-sm text-gray-500">{item.description}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                  {item.quantity} {item.unit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                  {formatCurrency(item.unit_price)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                  {formatCurrency(item.total||item.unit_price*item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td colSpan="3" className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                Subtotal
              </td>
              <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                {formatCurrency(purchaseOrder.subtotal)}
              </td>
            </tr>
            <tr>
              <td colSpan="3" className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                Tax
              </td>
              <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                {formatCurrency(purchaseOrder.tax)}
              </td>
            </tr>
            {/* <tr>
              <td colSpan="3" className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                Shipping
              </td>
              <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                {formatCurrency(purchaseOrder.shipping)}
              </td>
            </tr> */}
            <tr>
              <td colSpan="3" className="px-6 py-3 text-right text-sm font-bold text-gray-900">
                Total
              </td>
              <td className="px-6 py-3 text-right text-sm font-bold text-gray-900">
                {formatCurrency(purchaseOrder.total)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );

  // Render notes
  const renderNotes = () => (
    purchaseOrder.notes && (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Notes</h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <p className="text-sm text-gray-700 whitespace-pre-line">
            {purchaseOrder.notes}
          </p>
        </div>
      </div>
    )
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="md:flex md:items-center md:justify-between mb-6">
        {/* <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <Link
              to="/purchase-orders"
              className="mr-4 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Purchase Order #{purchaseOrder.poNumber}
            </h2>
          </div>
          <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:space-x-6">
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <FiCalendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
              {formatDate(purchaseOrder.orderDate)}
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <FiShoppingBag className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
              {purchaseOrder.supplier.name}
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <FiDollarSign className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
              {formatCurrency(purchaseOrder.total)}
            </div>
          </div>
        </div> */}
        <div className="mt-4 flex space-x-3 md:mt-0 md:ml-4">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Link to={`/purchase-orders/${uuid}/edit`} className="flex">
              <FiEdit2 className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
              Edit</Link>
          </button>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiFileText className="-ml-1 mr-2 h-5 w-5" />
            Print
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="space-y-6">
        {renderOrderSummary()}
        {renderSupplierInfo()}
        {renderOrderItems()}
        {renderNotes()}
      </div>
    </div>
  );
};

export default PurchaseOrderDetails;
