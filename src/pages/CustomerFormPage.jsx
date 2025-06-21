import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiArrowLeft, FiLoader } from "react-icons/fi";
import DashboardLayout from "../components/DashboardLayout";
import CustomerForm from "../components/customers/CustomerForm";
import { getCustomerById, getCustomers } from "../redux/customerSlice";
import { showToast } from "../modules/utils";

const CustomerFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { selectedCustomer, loading, error } = useSelector((state) => ({
    selectedCustomer: state.customer.selectedCustomer,
    loading: state.customer.loading,
    error: state.customer.error,
  }));

  useEffect(() => {
    if (id && id !== 'new') {
      dispatch(getCustomerById(id))
        .unwrap()
        .catch(err => {
          showToast(err.message || 'Failed to load customer', 'error');
          navigate('/customers');
        });
    } else {
      // Reset selected customer when adding new
      dispatch({ type: 'customer/setSelectedCustomer', payload: null });
    }
    
    // Clean up selected customer when component unmounts
    return () => {
      dispatch({ type: 'customer/setSelectedCustomer', payload: null });
    };
  }, [id, dispatch, navigate]);

  const handleSuccess = () => {
    // Refresh the customers list and navigate back
    dispatch(getCustomers());
    navigate('/customers');
  };

  const handleBack = () => {
    navigate('/customers');
  };

  return (
    // <DashboardLayout>
      <div className="p-4 sm:p-6">
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <FiArrowLeft className="mr-2" />
            Back to Customers
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            {id === 'new' ? 'Add New Customer' : 'Edit Customer'}
          </h1>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          {loading && id !== 'new' ? (
            <div className="flex flex-col items-center justify-center h-64">
              <FiLoader className="animate-spin h-12 w-12 text-blue-500 mb-4" />
              <p className="text-gray-600">Loading customer data...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    {error.message || 'Failed to load customer data. Please try again.'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <CustomerForm
              key={selectedCustomer?.uuid || 'new'}
              initialValues={id === 'new' ? {} : selectedCustomer || {}}
              isEdit={id !== 'new'}
              onSuccess={handleSuccess}
              onCancel={handleBack}
              isSubmitting={loading}
            />
          )}
        </div>
      </div>
    // </DashboardLayout>
  );
};

export default CustomerFormPage;
