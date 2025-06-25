import { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiCalendar,
  FiCreditCard,
  FiDollarSign,
  FiEdit2,
  FiFileText,
  FiMail,
  FiMapPin,
  FiPhone,
  FiPlus,
  FiShoppingBag
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getCustomerById } from "../redux/customerSlice";

const CustomerDetails = () => {
  const [activeTab, setActiveTab] = useState('purchase-orders');
  const {uuid } = useParams();
  const dispatch = useDispatch();
const customer = useSelector((state) => state.customer.selectedCustomer);
console.log(customer,"hhjgvhvg");
  useEffect(() => {
    if(uuid){
      dispatch(getCustomerById(uuid));
    }
  }, [uuid]);
    // Mock data
  const customerData =customer ||{
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    mobile: '+1 (555) 123-4567',
    gstNumber: '22AAAAA0000A1Z5',
    address: '123 Business St, Suite 100, New York, NY 10001',
    createdAt: '2023-01-15T00:00:00.000Z',
    purchaseOrders: [
      {
        id: 'PO-1001',
        date: '2023-06-15',
        total: 1500.00,
        status: 'Completed',
        items: 3
      },
      {
        id: 'PO-1002',
        date: '2023-05-20',
        total: 2500.50,
        status: 'Processing',
        items: 5
      }
    ],
    invoices: [
      {
        id: 'INV-2001',
        date: '2023-06-20',
        dueDate: '2023-07-20',
        total: 1650.00,
        status: 'Paid',
        poRef: 'PO-1001'
      },
      {
        id: 'INV-2002',
        date: '2023-05-25',
        dueDate: '2023-06-25',
        total: 2625.53,
        status: 'Pending',
        poRef: 'PO-1002'
      }
    ]
  };

  const { purchaseOrders, invoices, ...selectedCustomer } = customerData;

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

  // Event handlers
  const handleViewPO = (poId) => {
    console.log('View PO:', poId);
  };

  const handleViewInvoice = (invoiceId) => {
    console.log('View Invoice:', invoiceId);
  };

  const handleDownload = (id, refNo) => {
    console.log('Download invoice:', id, refNo);
  };

  const handleViewClick = (invoice) => {
    console.log('View invoice details:', invoice);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Using the customer data from our mock data

  const renderCustomerInfo = () => (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Customer Information</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Details and information about the customer
        </p>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <FiDollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Spent</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(4175.53)}
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <FiShoppingBag className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="text-lg font-semibold text-gray-900">
                {purchaseOrders.length}
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
              <FiFileText className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Invoices</p>
              <p className="text-lg font-semibold text-gray-900">
                {invoices.length}
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <FiCalendar className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Member Since</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatDate(selectedCustomer.createdAt)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h4 className="text-sm font-medium text-gray-500 mb-4">Contact Information</h4>
          <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 text-gray-400">
                <FiPhone className="h-5 w-5" />
              </div>
              <div className="ml-3 text-sm">
                <p className="text-gray-500">Phone</p>
                <p className="mt-1 font-medium text-gray-900">
                  {selectedCustomer.mobile || 'N/A'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 text-gray-400">
                <FiMapPin className="h-5 w-5" />
              </div>
              <div className="ml-3 text-sm">
                <p className="text-gray-500">Address</p>
                <p className="mt-1 font-medium text-gray-900">
                  {selectedCustomer.address || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPurchaseOrders = () => (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Purchase Orders</h3>
        <Link
          to="/purchase-orders/new"
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FiPlus className="-ml-1 mr-1 h-4 w-4" />
          New PO
        </Link>
      </div>

      {purchaseOrders.length > 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PO Number
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {purchaseOrders.map((po) => (
                  <tr key={po.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      <Link to={`/purchase-orders/${po.id}`} className="hover:underline">
                        {po.po_number || `PO-${po.id?.slice(0, 8)}`}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(po.orderDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        po.status === 'completed' ? 'bg-green-100 text-green-800' :
                        po.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {po.status || 'draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(po.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link 
                        to={`/purchase-orders/${po.id}`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white shadow sm:rounded-lg">
          <FiShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No purchase orders</h3>
          <p className="mt-1 text-sm text-gray-500">
            This customer doesn't have any purchase orders yet.
          </p>
          <div className="mt-6">
            <Link
              to="/purchase-orders/new"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiPlus className="-ml-1 mr-2 h-5 w-5" />
              Create Purchase Order
            </Link>
          </div>
        </div>
      )}
    </div>
  );

  const renderInvoices = () => (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Invoices</h3>
        <Link
          to="/invoices/new"
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FiPlus className="-ml-1 mr-1 h-4 w-4" />
          New Invoice
        </Link>
      </div>

      {invoices.length > 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      <Link to={`/invoices/${invoice.id}`} className="hover:underline">
                        {invoice.invoice_number || `INV-${invoice.id?.slice(0, 8)}`}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(invoice.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(invoice.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                        invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {invoice.status || 'draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(invoice.total_amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link 
                        to={`/invoices/${invoice.id}`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white shadow sm:rounded-lg">
          <FiFileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No invoices</h3>
          <p className="mt-1 text-sm text-gray-500">
            This customer doesn't have any invoices yet.
          </p>
          <div className="mt-6">
            <Link
              to="/invoices/new"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiPlus className="-ml-1 mr-2 h-5 w-5" />
              Create Invoice
            </Link>
          </div>
        </div>
      )}
    </div>
  );

  // Tabs component
  const renderTabs = () => (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8">
        <button
          onClick={() => setActiveTab('purchase-orders')}
          className={`${
            activeTab === 'purchase-orders'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          aria-current={activeTab === 'purchase-orders' ? 'page' : undefined}
        >
          Purchase Orders
          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {purchaseOrders.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('invoices')}
          className={`${
            activeTab === 'invoices'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          aria-current={activeTab === 'invoices' ? 'page' : undefined}
        >
          Invoices
          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {invoices.length}
          </span>
        </button>
      </nav>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <Link
              to="/customers"
              className="mr-4 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              {selectedCustomer.name}
            </h2>
          </div>
          <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:space-x-6">
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <FiMail className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
              {selectedCustomer.email}
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <FiPhone className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
              {selectedCustomer.mobile}
            </div>
            {selectedCustomer.gstNumber && (
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <FiCreditCard className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                GST: {selectedCustomer.gstNumber}
              </div>
            )}
          </div>
        </div>
        <div className="mt-4 flex space-x-3 md:mt-0 md:ml-4">
          <Link
            to={`/customers/edit/${selectedCustomer.id}`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiEdit2 className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
            Edit
          </Link>
          <Link
            to={`/invoices/new?customerId=${selectedCustomer.id}`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiPlus className="-ml-1 mr-2 h-5 w-5" />
            New Invoice
          </Link>
        </div>
      </div>

      <>
        {renderCustomerInfo()}
        {renderTabs()}
        {activeTab === 'purchase-orders' ? renderPurchaseOrders() : renderInvoices()}
      </>
    </div>
  );
};

export default CustomerDetails;
