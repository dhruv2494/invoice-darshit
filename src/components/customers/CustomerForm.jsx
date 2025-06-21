import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { FiX, FiSave, FiUser, FiPhone, FiMapPin } from 'react-icons/fi';
import { addEditCustomer } from '../../redux/customerSlice';
import { showToast } from '../../modules/utils';

// Validation Schema
const customerSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  mobile: Yup.string()
    .required('Mobile is required')
    .matches(/^\d+$/, 'Mobile must be a valid number'),
  address: Yup.string().required('Address is required'),
  email: Yup.string().email('Invalid email address'),
  gstNumber: Yup.string(),
  state: Yup.string(),
  city: Yup.string(),
  pincode: Yup.string()
    .matches(/^\d{6}$/, 'Pincode must be 6 digits'),
});

const CustomerForm = ({ 
  onClose, 
  initialValues: propInitialValues = {}, 
  isEdit = false, 
  onSuccess,
  isSubmitting = false,
  onCancel
}) => {
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.customer);

  // Set initial values
  const getInitialValues = () => {
    if (propInitialValues && Object.keys(propInitialValues).length > 0) {
      return {
        ...propInitialValues,
      };
    }
    
    // Default values for a new customer
    return {
      name: '',
      mobile: '',
      address: '',
      email: '',
      gstNumber: '',
      state: '',
      city: '',
      pincode: '',
    };
  };

  const initialValues = getInitialValues();

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const resultAction = await dispatch(addEditCustomer(values));
      if (addEditCustomer.fulfilled.match(resultAction)) {
        showToast(
          isEdit ? 'Customer updated successfully' : 'Customer added successfully',
          'success'
        );
        onSuccess?.();
      } else {
        throw new Error(resultAction.error?.message || 'Failed to save customer');
      }
    } catch (error) {
      showToast(error.message || 'An error occurred while saving the customer', 'error');
      throw error; // Re-throw to let Formik know the submission failed
    }
  };

  const renderLoadingOverlay = () => (
    <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-2 text-gray-600">Saving customer...</p>
      </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            {isEdit ? 'Edit Customer' : 'Add New Customer'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close form"
          >
            <FiX size={24} />
          </button>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={customerSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting: formikIsSubmitting, values, handleChange, handleBlur, setFieldValue }) => {
            const submitting = formikIsSubmitting || isSubmitting;
            return (
              <Form className="space-y-6 relative">
                {submitting && renderLoadingOverlay()}
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                    Basic Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiUser className="h-5 w-5 text-gray-400" />
                        </div>
                        <Field
                          type="text"
                          name="name"
                          className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="John Doe"
                        />
                      </div>
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mobile <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiPhone className="h-5 w-5 text-gray-400" />
                        </div>
                        <Field
                          type="text"
                          name="mobile"
                          className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="9876543210"
                        />
                      </div>
                      <ErrorMessage
                        name="mobile"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <Field
                        type="email"
                        name="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="john@example.com"
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        GST Number
                      </label>
                      <Field
                        type="text"
                        name="gstNumber"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="22AAAAA0000A1Z5"
                      />
                      <ErrorMessage
                        name="gstNumber"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  </div>
                </div>


                {/* Address Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
                    Address Information
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 pt-2">
                          <FiMapPin className="h-5 w-5 text-gray-400" />
                        </div>
                        <Field
                          as="textarea"
                          name="address"
                          rows={3}
                          className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="123 Main St, City, State, Country"
                        />
                      </div>
                      <ErrorMessage
                        name="address"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <Field
                        type="text"
                        name="city"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Mumbai"
                      />
                      <ErrorMessage
                        name="city"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <Field
                        type="text"
                        name="state"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Maharashtra"
                      />
                      <ErrorMessage
                        name="state"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pincode
                      </label>
                      <Field
                        type="text"
                        name="pincode"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="400001"
                      />
                      <ErrorMessage
                        name="pincode"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col-reverse sm:flex-row justify-end space-y-3 sm:space-y-0 space-x-0 sm:space-x-3 pt-4 border-t border-gray-200">
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={onCancel || onClose}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${submitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                    >
                      {submitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {isEdit ? 'Updating...' : 'Saving...'}
                        </>
                      ) : isEdit ? 'Update Customer' : 'Add Customer'}
                    </button>
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
  );
};

export default CustomerForm;
