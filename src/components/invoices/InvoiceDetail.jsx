import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { FiPrinter, FiArrowLeft, FiEdit, FiDownload } from 'react-icons/fi';

// Mock data for demonstration
const mockInvoice = {
  id: '1',
  invoiceNumber: 'INV-2023-001',
  invoiceDate: '2023-06-15',
  dueDate: '2023-07-15',
  status: 'paid',
  customerName: 'Acme Corp',
  customerAddress: '123 Business St\nNew York, NY 10001\nUnited States',
  customerEmail: 'billing@acmecorp.com',
  customerPhone: '+1 (555) 123-4567',
  purchaseOrderNumber: 'PO-2023-045',
  items: [
    {
      id: '1',
      description: 'Web Design Services',
      quantity: 10,
      unitPrice: 100,
      taxRate: 10
    },
    {
      id: '2',
      description: 'Hosting (Annual)',
      quantity: 1,
      unitPrice: 500,
      taxRate: 10
    },
    {
      id: '3',
      description: 'Domain Registration',
      quantity: 1,
      unitPrice: 15,
      taxRate: 10
    }
  ],
  subtotal: 1515,
  tax: 151.5,
  total: 1666.5,
  notes: 'Thank you for your business!',
  terms: 'Payment due within 30 days of invoice date.'
};

const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };
  
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

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // Handle download
  const handleDownload = () => {
    console.log('Downloading invoice:', invoice?.id);
    // Simulate download
    console.log('Invoice download started...');
  };

  if (loading && !invoice) {
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

  if (!invoice) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Invoice not found</h3>
        <p className="mt-2 text-sm text-gray-500">The invoice you're looking for doesn't exist or has been deleted.</p>
        <div className="mt-6">
          <Link
            to="/invoices"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiArrowLeft className="mr-2 h-4 w-4" />
            Back to Invoices
          </Link>
        </div>
      </div>
    );
  }

  const {
    invoiceNumber,
    invoiceDate,
    dueDate,
    status,
    customerName,
    customerAddress,
    customerEmail,
    customerPhone,
    purchaseOrderNumber,
    items = [],
    subtotal = 0,
    tax = 0,
    total = 0,
    notes,
    terms,
  } = invoice;

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      {/* Header */}
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Invoice #{invoiceNumber}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Details and items for this invoice
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiPrinter className="-ml-0.5 mr-2 h-4 w-4" />
              Print
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiDownload className="-ml-0.5 mr-2 h-4 w-4" />
              Download
            </button>
            <Link
              to={`/invoices/${id}/edit`}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiEdit className="-ml-0.5 mr-2 h-4 w-4" />
              Edit
            </Link>
          </div>
        </div>
      </div>
      
      {/* Invoice Info */}
      <div className="px-4 py-5 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h4 className="text-sm font-medium text-gray-500">Bill To</h4>
          <div className="mt-1 text-sm text-gray-900">
            <p className="font-medium">{customerName}</p>
            {customerAddress && <p className="whitespace-pre-line">{customerAddress}</p>}
            {customerEmail && <p>{customerEmail}</p>}
            {customerPhone && <p>{customerPhone}</p>}
          </div>
          
          <h4 className="mt-6 text-sm font-medium text-gray-500">Status</h4>
          <div className="mt-1">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(status)}`}>
              {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'N/A'}
            </span>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-500">Invoice Details</h4>
          <dl className="mt-1 text-sm text-gray-900">
            <div className="grid grid-cols-2 gap-2">
              <dt className="text-gray-500">Invoice #</dt>
              <dd>{invoiceNumber || 'N/A'}</dd>
              
              <dt className="text-gray-500">Date</dt>
              <dd>{invoiceDate ? format(new Date(invoiceDate), 'MMM dd, yyyy') : 'N/A'}</dd>
              
              <dt className="text-gray-500">Due Date</dt>
              <dd>{dueDate ? format(new Date(dueDate), 'MMM dd, yyyy') : 'N/A'}</dd>
              
              {purchaseOrderNumber && (
                <>
                  <dt className="text-gray-500">PO Number</dt>
                  <dd>{purchaseOrderNumber}</dd>
                </>
              )}
            </div>
          </dl>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-500">Amount</h4>
          <dl className="mt-1 space-y-1">
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Subtotal</dt>
              <dd className="text-sm font-medium">{formatCurrency(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Tax</dt>
              <dd className="text-sm font-medium">{formatCurrency(tax)}</dd>
            </div>
            <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between">
              <dt className="text-base font-medium">Total</dt>
              <dd className="text-base font-bold">{formatCurrency(total)}</dd>
            </div>
          </dl>
        </div>
      </div>
      
      {/* Invoice Items */}
      <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-500 mb-4">Items</h4>
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
                  Tax Rate
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items && items.length > 0 ? (
                items.map((item, index) => {
                  const itemTotal = (item.quantity * item.unitPrice) * (1 + (item.taxRate / 100));
                  return (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.description || 'No description'}
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
                        {formatCurrency(itemTotal)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    No items found for this invoice.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Notes & Terms */}
      {(notes || terms) && (
        <div className="px-4 py-5 sm:px-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-8">
          {notes && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">Notes</h4>
              <div className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                {notes}
              </div>
            </div>
          )}
          {terms && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">Terms & Conditions</h4>
              <div className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                {terms}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Footer */}
      <div className="px-4 py-4 bg-gray-50 sm:px-6 flex justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FiArrowLeft className="-ml-1 mr-2 h-4 w-4" />
          Back to Invoices
        </button>
        <div className="space-x-3">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiPrinter className="-ml-1 mr-2 h-4 w-4" />
            Print
          </button>
          <Link
            to={`/invoices/${id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiEdit className="-ml-1 mr-2 h-4 w-4" />
            Edit Invoice
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;
