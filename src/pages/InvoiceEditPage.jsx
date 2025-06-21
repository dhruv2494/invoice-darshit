import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getInvoiceById, 
  selectCurrentInvoice, 
  selectInvoiceLoading, 
  selectInvoiceError,
  resetCurrentInvoice,
  updateInvoice
} from '../redux/invoiceSlice';
import InvoiceForm from '../components/invoices/InvoiceForm';
import { showToast } from '../modules/utils';

const InvoiceEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const invoice = useSelector(selectCurrentInvoice);
  const loading = useSelector(selectInvoiceLoading);
  const error = useSelector(selectInvoiceError);

  // Load invoice data when component mounts
  useEffect(() => {
    if (id) {
      dispatch(getInvoiceById(id));
    }

    // Reset current invoice when component unmounts
    return () => {
      dispatch(resetCurrentInvoice());
    };
  }, [dispatch, id]);

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(updateInvoice({ id, ...values })).unwrap();
      showToast('Invoice updated successfully', 'success');
      navigate(`/invoices/${id}`);
    } catch (error) {
      console.error('Failed to update invoice:', error);
      showToast(error.message || 'Failed to update invoice', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate(`/invoices/${id}`);
  };

  if (loading === 'pending' && !invoice) {
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
          <button
            onClick={() => navigate('/invoices')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to Invoices
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Edit Invoice #{invoice.invoiceNumber}
          </h2>
        </div>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
        <InvoiceForm 
          initialValues={invoice} 
          onSubmit={handleSubmit} 
          onCancel={handleCancel} 
          isEditing={true} 
        />
      </div>
    </div>
  );
};

export default InvoiceEditPage;
