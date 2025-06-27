import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchInvoiceById, clearInvoice, deleteInvoice } from '../redux/invoiceSlice';
import { FiArrowLeft, FiDelete, FiDownload, FiEdit2 } from 'react-icons/fi';
import API from '../services/api';
import { showToast } from '../modules/utils';

const InvoiceDetailsPage = () => {
  const { uuid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { invoice, loading, error } = useSelector((state) => state.invoice);
  useEffect(() => {
    dispatch(fetchInvoiceById(uuid));
    return () => { dispatch(clearInvoice()); };
  }, [dispatch, uuid]);

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>;
  if (error) return <div className="bg-red-50 border-l-4 border-red-400 p-4">{error}</div>;
  if (!invoice) return <div className="text-center py-12">Invoice not found</div>;

  const handleDelete = (id) => {
    dispatch(deleteInvoice(id));
    navigate('/invoices');
  };

  const handleDownload = async (uuid, refNo) => {
    try {
      const response = await API.get(`/api/invoices/${uuid}/download`, {
        responseType: "blob", // CRUCIAL: tells Axios to handle binary response
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Invoice_${refNo}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showToast("Invoice downloaded successfully!", 1);
    } catch (error) {
      console.error("Error downloading invoice:", error);
      showToast("Failed to download invoice.", 2);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate('/invoices')} className="p-2 rounded-full hover:bg-gray-100"><FiArrowLeft className="h-6 w-6 text-gray-600" /></button>
        <h1 className="text-2xl font-bold text-gray-900">Invoice #{invoice.invoice_number}</h1>
        
        <div>
        <button onClick={() => navigate(`/invoices/${invoice.id}/edit`)} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"><FiEdit2 className="mr-2" /> Edit</button>
        <button onClick={() => handleDelete(invoice.id)} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"><FiDelete className="mr-2" /> Delete</button>
        <button onClick={() => handleDownload(invoice.id, invoice.invoice_number)} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"><FiDownload className="mr-2" /> Download</button>
        </div>
      </div>
      <div className="bg-white shadow rounded-xl border border-gray-200 p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Customer Info</h2>
            <div className="mb-2"><strong>Name:</strong> {invoice.customer?.name}</div>
            <div className="mb-2"><strong>Email:</strong> {invoice.customer?.email}</div>
            <div className="mb-2"><strong>Phone:</strong> {invoice.customer?.phone}</div>
            <div className="mb-2"><strong>Address:</strong> {invoice.customer?.address}</div>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-4">Invoice Info</h2>
            <div className="mb-2"><strong>Invoice #:</strong> {invoice.invoice_number}</div>
            <div className="mb-2"><strong>Status:</strong> {invoice.status}</div>
            <div className="mb-2"><strong>Date:</strong> {invoice.date}</div>
            {/* <div className="mb-2"><strong>Due Date:</strong> {invoice.dueDate}</div> */}
            <div className="mb-2"><strong>PO Ref:</strong> {invoice?.purchase_order?.po_number}</div>
            {/* <div className="mb-2"><strong>Item Name:</strong> {invoice.itemName}</div> */}
            {/* <div className="mb-2"><strong>Container:</strong> {invoice.container}</div> */}
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Items</h2>
          <div className="overflow-x-auto w-full">
  <table className="min-w-full bg-white rounded-xl shadow border border-gray-200">
    <thead>
      <tr className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 sticky top-0 z-10">
        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Item Name</th>
        <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider">Gross</th>
        <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider">Tare</th>
        <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider">Net</th>
        <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider">Weigh Loss</th>
        <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider">Clean</th>
        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Container</th>
        <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider">Price</th>
        <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider">Labor</th>
        <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider">Deduction</th>
        <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider">Air Loss</th>
        <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider">Net Deduction</th>
        <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider">Total</th>
        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Description</th>
        <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider">Qty</th>
        <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider">Unit Price</th>
        <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider">Amount</th>
      </tr>
    </thead>
    <tbody>
      {invoice.items && invoice.items.length > 0 ? (
        invoice.items.map((item, idx) => (
          <tr
            key={item.id}
            className={
              `transition hover:bg-blue-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`
            }
          >
            <td className="px-4 py-3 font-semibold text-gray-700 whitespace-nowrap">{item.item_name}</td>
            <td className="px-4 py-3 text-right text-gray-600">{item.gross_weight}</td>
            <td className="px-4 py-3 text-right text-gray-600">{item.tare_weight}</td>
            <td className="px-4 py-3 text-right text-gray-600">{item.net_weight}</td>
            <td className="px-4 py-3 text-right text-gray-600">{item.weighing_loss}</td>
            <td className="px-4 py-3 text-right text-gray-600">{item.clean_weight}</td>
            <td className="px-4 py-3 text-left text-gray-600">{item.container}</td>
            <td className="px-4 py-3 text-right text-blue-800 font-semibold">₹{item.price}</td>
            <td className="px-4 py-3 text-right text-blue-800 font-semibold">₹{item.labor_charges}</td>
            <td className="px-4 py-3 text-right text-yellow-700">₹{item.deduction}</td>
            <td className="px-4 py-3 text-right text-purple-700">{item.air_loss}</td>
            <td className="px-4 py-3 text-right text-pink-700">₹{item.net_deduction}</td>
            <td className="px-4 py-3 text-right text-green-700 font-bold">₹{item.total_amount}</td>
            <td className="px-4 py-3 text-left text-xs text-gray-500 italic max-w-xs truncate">{item.description}</td>
            <td className="px-4 py-3 text-right text-gray-700 font-semibold">{item.quantity || '-'}</td>
            <td className="px-4 py-3 text-right text-gray-700">₹{item.unitPrice?.toFixed(2) || '-'}</td>
            <td className="px-4 py-3 text-right text-gray-700">₹{item.total_amount || '-'}</td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="17" className="text-center py-8 text-gray-400 bg-gray-50 rounded-lg">No items found.</td>
        </tr>
      )}
    </tbody>
  </table>
</div>
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Additional Info</h2>
            <div className="mb-2"><strong>Status:</strong> {invoice.status}</div>
            <div className="mb-2"><strong>Notes:</strong> {invoice.notes}</div>
            <div className="mb-2"><strong>Terms:</strong> {invoice.terms_conditions}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailsPage;
