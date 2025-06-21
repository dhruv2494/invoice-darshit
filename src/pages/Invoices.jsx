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
      <div className="p-4 sm:p-6">
    

        <InvoiceList />
      </div>
  );
};

export default Invoices;
