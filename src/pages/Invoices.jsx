import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import { getInvoices } from '../redux/invoiceSlice';
import InvoiceList from '../components/invoices/InvoiceList';
import DashboardLayout from '../components/DashboardLayout';

const Invoices = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Load invoices on component mount
  useEffect(() => {
    dispatch(getInvoices());
  }, [dispatch]);

  const handleAddClick = () => {
    navigate('/invoices/new');
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage and track all your invoices
            </p>
          </div>
          <button
            onClick={handleAddClick}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiPlus className="-ml-1 mr-2 h-5 w-5" />
            New Invoice
          </button>
        </div>

        <InvoiceList />
      </div>
    </DashboardLayout>
  );
};

export default Invoices;
