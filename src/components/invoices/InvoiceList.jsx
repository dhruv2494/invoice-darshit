import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteInvoice, fetchInvoices } from '../../redux/invoiceSlice';
import { FiPlus, FiFileText, FiUser, FiCalendar, FiDollarSign, FiInfo, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';

const InvoiceList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { invoices, loading, error } = useSelector((state) => state.invoice);
console.log(invoices);
  useEffect(() => {
    dispatch(fetchInvoices());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteInvoice(id));
    navigate('/invoices');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <FiFileText className="mr-2 text-blue-600" /> Invoices
        </h1>
        <button
          onClick={() => navigate('/invoices/new')}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FiPlus className="mr-2" /> Add Invoice
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"><FiFileText className="inline mr-1 text-gray-400" /> Invoice #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"><FiUser className="inline mr-1 text-gray-400" /> Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"><FiCalendar className="inline mr-1 text-gray-400" /> Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"><FiDollarSign className="inline mr-1 text-gray-400" /> Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"><FiInfo className="inline mr-1 text-gray-400" /> Status</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(invoices) && invoices.length > 0 ? (
                invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-blue-700 cursor-pointer" onClick={() => navigate(`/invoices/${invoice.id}`)}>
                      {invoice.invoice_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{invoice.customer_name || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(invoice.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${invoice.total_amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize">{invoice.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                      <button
                        onClick={() => navigate(`/invoices/${invoice.id}`)}
                        className="inline-flex items-center px-2 py-1 border border-gray-300 rounded-md text-xs text-gray-700 hover:bg-gray-100"
                      >
                        <FiEye className="mr-1" /> View
                      </button>
                      <button
                        onClick={() => navigate(`/invoices/${invoice.id}/edit`)}
                        className="inline-flex items-center px-2 py-1 border border-gray-300 rounded-md text-xs text-gray-700 hover:bg-gray-100"
                      >
                        <FiEdit2 className="mr-1" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(invoice.id)}
                        className="inline-flex items-center px-2 py-1 border border-red-300 rounded-md text-xs text-red-700 hover:bg-red-50"
                      >
                        <FiTrash2 className="mr-1" /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-400">No invoices found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InvoiceList;

