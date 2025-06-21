import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FiArrowLeft, 
  FiEdit2, 
  FiDownload, 
  FiPrinter,
  FiCalendar,
  FiUser,
  FiDollarSign
} from 'react-icons/fi';

// Mock data for demonstration
const mockInvoice = {
  id: '1',
  invoiceNumber: 'INV-2023-001',
  date: '2023-06-15',
  dueDate: '2023-07-15',
  status: 'paid',
  customer: {
    name: 'Acme Corp',
    email: 'billing@acmecorp.com',
    phone: '+1 (555) 123-4567',
    address: '123 Business St\nNew York, NY 10001\nUnited States',
  },
  items: [
    {
      id: '1',
      description: 'Web Design Services',
      quantity: 10,
      unitPrice: 100,
      taxRate: 10,
      amount: 1000
    },
    {
      id: '2',
      description: 'Hosting (Annual)',
      quantity: 1,
      unitPrice: 500,
      taxRate: 10,
      amount: 500
    }
  ],
  subtotal: 1500,
  tax: 150,
  total: 1650,
  notes: 'Thank you for your business!',
  terms: 'Payment due within 30 days of invoice date.'
};

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount || 0);
};

const InvoiceDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Simulate loading data
  useEffect(() => {
    const loadInvoice = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setInvoice(mockInvoice);
      } catch (err) {
        setError('Failed to load invoice');
        console.error('Error loading invoice:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadInvoice();
    
    return () => {
      // Cleanup if needed
    };
  }, [id]);

  // Handle download
  const handleDownload = () => {
    console.log('Downloading invoice:', invoice?.id);
    // Simulate download
    console.log('Invoice download started...');
  };

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // Render invoice summary
  const renderInvoiceSummary = () => (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Invoice Summary
        </h3>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Invoice Number</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {invoice.invoiceNumber}
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Date</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {formatDate(invoice.date)}
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Due Date</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {formatDate(invoice.dueDate)}
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Status</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
              </span>
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Total Amount</dt>
            <dd className="mt-1 text-sm font-bold text-gray-900 sm:mt-0 sm:col-span-2">
              {formatCurrency(invoice.total)}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );

  // Render customer info
  const renderCustomerInfo = () => (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Customer Information
        </h3>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Name</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {invoice.customer.name}
            </dd>
          </div>
          {invoice.customer.email && (
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {invoice.customer.email}
              </dd>
            </div>
          )}
          {invoice.customer.phone && (
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Phone</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {invoice.customer.phone}
              </dd>
            </div>
          )}
          {invoice.customer.address && (
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Address</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-line">
                {invoice.customer.address}
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );

  // Render invoice items
  const renderInvoiceItems = () => (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Items
        </h3>
      </div>
      <div className="border-t border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Qty
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unit Price
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tax Rate
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invoice.items && invoice.items.length > 0 ? (
              invoice.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {item.taxRate}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                    {formatCurrency(item.amount)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                  No items found.
                </td>
              </tr>
            )}
            {/* Totals */}
            <tr>
              <td colSpan="4" className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                Subtotal
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                {formatCurrency(invoice.subtotal)}
              </td>
            </tr>
            <tr>
              <td colSpan="4" className="px-6 py-4 text-right text-sm font-medium text-gray-500">
                Tax
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                {formatCurrency(invoice.tax)}
              </td>
            </tr>
            <tr className="bg-gray-50">
              <td colSpan="4" className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                Total
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                {formatCurrency(invoice.total)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  // Render notes and terms
  const renderNotesAndTerms = () => (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Additional Information
        </h3>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          {invoice.notes && (
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Notes</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-line">
                {invoice.notes}
              </dd>
            </div>
          )}
          {invoice.terms && (
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Terms & Conditions</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-line">
                {invoice.terms}
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show error state
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

  // Show not found state
  if (!invoice) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Invoice not found</h3>
        <p className="mt-2 text-sm text-gray-500">The invoice you're looking for doesn't exist or has been deleted.</p>
        <div className="mt-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiArrowLeft className="mr-2 h-4 w-4" />
            Back to Invoices
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Invoice #{invoice.invoiceNumber}
            </h2>
          </div>
          <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:space-x-6">
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <FiCalendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
              {formatDate(invoice.date)}
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <FiUser className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
              {invoice.customer.name}
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <FiDollarSign className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
              {formatCurrency(invoice.total)}
            </div>
          </div>
        </div>
        <div className="mt-4 flex space-x-3 md:mt-0 md:ml-4">
          <button
            type="button"
            onClick={() => navigate(`/invoices/${invoice.id}/edit`)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiEdit2 className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
            Edit
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiDownload className="-ml-1 mr-2 h-5 w-5" />
            Download
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FiPrinter className="-ml-1 mr-2 h-5 w-5" />
            Print
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="space-y-6">
        {renderInvoiceSummary()}
        {renderCustomerInfo()}
        {renderInvoiceItems()}
        {renderNotesAndTerms()}
      </div>
    </div>
  );
};

export default InvoiceDetailsPage;
