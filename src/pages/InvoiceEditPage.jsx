import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchInvoiceById, clearInvoice } from '../redux/invoiceSlice';
import InvoiceForm from '../components/invoices/InvoiceForm';

const InvoiceEditPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { invoice, loading, error } = useSelector((state) => state.invoices);

  useEffect(() => {
    dispatch(fetchInvoiceById(id));
    return () => { dispatch(clearInvoice()); };
  }, [dispatch, id]);

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>;
  if (error) return <div className="bg-red-50 border-l-4 border-red-400 p-4">{error}</div>;
  if (!invoice) return <div className="text-center py-12">Invoice not found</div>;

  return (
    <InvoiceForm initialValues={invoice} isEdit={true} />
  );
};

export default InvoiceEditPage;
