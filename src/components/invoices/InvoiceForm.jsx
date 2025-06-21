import React, { useEffect, useState, useMemo } from 'react';
import { Formik, Form, FieldArray, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { 
  createInvoice, 
  updateInvoice,
  resetCurrentInvoice,
  getCompletedPurchaseOrders
} from '../../redux/invoiceSlice';
import { showToast } from '../../modules/utils';
import { FiX, FiPlus, FiTrash2, FiSave, FiXCircle } from 'react-icons/fi';

// Validation Schema
const invoiceSchema = Yup.object().shape({
  invoiceNumber: Yup.string().required('Invoice Number is required'),
  invoiceDate: Yup.date().required('Invoice Date is required'),
  dueDate: Yup.date().required('Due Date is required'),
  customerId: Yup.string().required('Customer is required'),
  status: Yup.string().required('Status is required'),
  notes: Yup.string(),
  terms: Yup.string(),
  items: Yup.array()
    .of(
      Yup.object().shape({
        description: Yup.string().required('Description is required'),
        quantity: Yup.number()
          .required('Quantity is required')
          .min(1, 'Quantity must be at least 1'),
        unitPrice: Yup.number()
          .required('Unit Price is required')
          .min(0, 'Unit Price cannot be negative'),
        taxRate: Yup.number()
          .min(0, 'Tax Rate cannot be negative')
          .max(100, 'Tax Rate cannot exceed 100%'),
      })
    )
    .min(1, 'At least one item is required'),
});

const InvoiceForm = ({ onClose, initialValues: propInitialValues = {}, isEdit = false, onSuccess }) => {
  const dispatch = useDispatch();
  const { customers } = useSelector((state) => state.customer);
  const { completedPurchaseOrders, status } = useSelector((state) => state.invoice);
  
  // Format customers for react-select
  const customerOptions = useMemo(() => 
    customers.map(customer => ({
      value: customer.uuid,
      label: customer.name
    })),
    [customers]
  );
  
  // Format purchase orders for react-select
  const purchaseOrderOptions = useMemo(() => 
    completedPurchaseOrders.map(po => ({
      value: po.uuid,
      label: po.poNumber,
      ...po
    })),
    [completedPurchaseOrders]
  );
  
  // Custom select component that works with Formik
  const CustomSelect = ({ options, field, form, ...props }) => {
    const selectedOption = options.find(option => option.value === field.value);
    
    return (
      <Select
        options={options}
        name={field.name}
        value={selectedOption}
        onChange={(option) => {
          form.setFieldValue(field.name, option ? option.value : '');
          
          // If this is the purchase order field, update the items
          if (field.name === 'purchaseOrderId' && option) {
            const selectedPO = purchaseOrderOptions.find(po => po.value === option.value);
            if (selectedPO && selectedPO.items) {
              form.setFieldValue('items', selectedPO.items);
            }
          }
        }}
        onBlur={() => {
          form.setFieldTouched(field.name, true);
        }}
        styles={customStyles}
        className="text-sm"
        classNamePrefix="select"
        placeholder="Search or select..."
        isClearable
        isSearchable
        noOptionsMessage={({ inputValue }) => 
          inputValue ? 'No matching options found' : 'No options available'
        }
        {...props}
      />
    );
  };

  // Set initial values
  const getInitialValues = () => {
    if (propInitialValues && Object.keys(propInitialValues).length > 0) {
      return {
        ...propInitialValues,
        items: (propInitialValues.items && propInitialValues.items.length > 0) 
          ? propInitialValues.items 
          : [{
              description: '',
              quantity: 1,
              unitPrice: 0,
              taxRate: 0,
            }]
      };
    }
    
    // Default values for new invoice
    return {
      invoiceNumber: '',
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: '',
      customerId: '',
      purchaseOrderId: '',
      status: 'draft',
      notes: '',
      terms: '',
      items: [{
        description: '',
        quantity: 1,
        unitPrice: 0,
        taxRate: 0,
      }],
    };
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const action = isEdit 
        ? updateInvoice({ id: propInitialValues.uuid, ...values })
        : createInvoice(values);
      
      const resultAction = await dispatch(action);
      
      if (createInvoice.fulfilled.match(resultAction) || updateInvoice.fulfilled.match(resultAction)) {
        showToast(
          isEdit ? 'Invoice updated successfully' : 'Invoice created successfully',
          'success'
        );
        
        if (onSuccess) {
          onSuccess();
        } else {
          onClose();
        }
      } else {
        throw new Error('Failed to save invoice');
      }
    } catch (error) {
      console.error('Error saving invoice:', error);
      showToast(error.message || 'Failed to save invoice', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate totals
  const calculateTotals = (items) => {
    return items.reduce((acc, item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const unitPrice = parseFloat(item.unitPrice) || 0;
      const taxRate = parseFloat(item.taxRate) || 0;
      const subtotal = quantity * unitPrice;
      const tax = subtotal * (taxRate / 100);
      const total = subtotal + tax;
      
      return {
        subtotal: acc.subtotal + subtotal,
        tax: acc.tax + tax,
        total: acc.total + total
      };
    }, { subtotal: 0, tax: 0, total: 0 });
  };

  // Load purchase orders when component mounts
  useEffect(() => {
    dispatch(getCompletedPurchaseOrders());
    
    return () => {
      dispatch(resetCurrentInvoice());
    };
  }, [dispatch]);

  // Custom styles for react-select
  const customStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: '42px',
      borderRadius: '0.375rem',
      borderColor: '#d1d5db',
      '&:hover': {
        borderColor: '#9ca3af',
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#f3f4f6' : 'white',
      color: state.isSelected ? 'white' : '#1f2937',
      '&:active': {
        backgroundColor: state.isSelected ? '#2563eb' : '#e5e7eb',
      },
    }),
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            {isEdit ? 'Edit Invoice' : 'Create New Invoice'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>
      </div>

      <Formik
        initialValues={getInitialValues()}
        validationSchema={invoiceSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, isSubmitting, setFieldValue }) => {
          const { subtotal, tax, total } = calculateTotals(values.items || []);
          
          return (
            <Form className="divide-y divide-gray-200">
              <div className="px-6 py-4 space-y-4">
                {/* Header Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="invoiceNumber" className="block text-sm font-medium text-gray-700">
                      Invoice Number *
                    </label>
                    <Field
                      type="text"
                      name="invoiceNumber"
                      id="invoiceNumber"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                    <ErrorMessage name="invoiceNumber" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                  
                  <div>
                    <label htmlFor="invoiceDate" className="block text-sm font-medium text-gray-700">
                      Invoice Date *
                    </label>
                    <Field
                      type="date"
                      name="invoiceDate"
                      id="invoiceDate"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                    <ErrorMessage name="invoiceDate" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                  
                  <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                      Due Date *
                    </label>
                    <Field
                      type="date"
                      name="dueDate"
                      id="dueDate"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                    <ErrorMessage name="dueDate" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                </div>

                {/* Customer and Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="customerId" className="block text-sm font-medium text-gray-700">
                      Customer *
                    </label>
                    <Field
                      name="customerId"
                      id="customerId"
                      component={CustomSelect}
                      options={customerOptions}
                      className="mt-1"
                    />
                    <ErrorMessage name="customerId" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
                  
                  <div>
                    <label htmlFor="purchaseOrderId" className="block text-sm font-medium text-gray-700">
                      Purchase Order (Optional)
                    </label>
                    <Field
                      name="purchaseOrderId"
                      id="purchaseOrderId"
                      component={CustomSelect}
                      options={purchaseOrderOptions}
                      className="mt-1"
                      placeholder="Select a purchase order..."
                    />
                  </div>
                </div>

                {/* Status */}
                <div className="w-1/3">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status *
                  </label>
                  <Field
                    as="select"
                    name="status"
                    id="status"
                    className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                    <option value="cancelled">Cancelled</option>
                  </Field>
                  <ErrorMessage name="status" component="div" className="mt-1 text-sm text-red-600" />
                </div>
              </div>

              {/* Invoice Items */}
              <div className="px-6 py-4">
                <h4 className="text-md font-medium text-gray-900 mb-4">Invoice Items</h4>
                
                <FieldArray name="items">
                  {({ push, remove }) => (
                    <div className="space-y-4">
                      {values.items && values.items.map((item, index) => (
                        <div key={index} className="grid grid-cols-12 gap-4 items-start border-b border-gray-200 pb-4">
                          <div className="col-span-5">
                            <label className="block text-sm font-medium text-gray-700">
                              Description *
                            </label>
                            <Field
                              type="text"
                              name={`items.${index}.description`}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                            <ErrorMessage 
                              name={`items.${index}.description`} 
                              component="div" 
                              className="mt-1 text-sm text-red-600" 
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Qty *
                            </label>
                            <Field
                              type="number"
                              name={`items.${index}.quantity`}
                              min="1"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                            <ErrorMessage 
                              name={`items.${index}.quantity`} 
                              component="div" 
                              className="mt-1 text-sm text-red-600" 
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Unit Price *
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">$</span>
                              </div>
                              <Field
                                type="number"
                                name={`items.${index}.unitPrice`}
                                min="0"
                                step="0.01"
                                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                            <ErrorMessage 
                              name={`items.${index}.unitPrice`} 
                              component="div" 
                              className="mt-1 text-sm text-red-600" 
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Tax Rate (%)
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                              <Field
                                type="number"
                                name={`items.${index}.taxRate`}
                                min="0"
                                max="100"
                                step="0.01"
                                className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                            <ErrorMessage 
                              name={`items.${index}.taxRate`} 
                              component="div" 
                              className="mt-1 text-sm text-red-600" 
                            />
                          </div>
                          
                          <div className="flex items-end h-10">
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="text-red-600 hover:text-red-800"
                              disabled={values.items.length <= 1}
                            >
                              <FiTrash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => push({
                            description: '',
                            quantity: 1,
                            unitPrice: 0,
                            taxRate: 0,
                          })}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <FiPlus className="-ml-0.5 mr-2 h-4 w-4" />
                          Add Item
                        </button>
                      </div>
                    </div>
                  )}
                </FieldArray>
                
                {/* Totals */}
                <div className="mt-8 flex justify-end">
                  <div className="w-64">
                    <div className="flex justify-between py-2 text-sm font-medium text-gray-500">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2 text-sm font-medium text-gray-500">
                      <span>Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2 text-lg font-medium text-gray-900 border-t border-gray-200">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Notes and Terms */}
              <div className="px-6 py-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <Field
                      as="textarea"
                      name="notes"
                      id="notes"
                      rows="3"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                      placeholder="Any additional notes..."
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="terms" className="block text-sm font-medium text-gray-700 mb-1">
                      Terms & Conditions
                    </label>
                    <Field
                      as="textarea"
                      name="terms"
                      id="terms"
                      rows="3"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                      placeholder="Payment terms, late fees, etc..."
                    />
                  </div>
                </div>
              </div>
              
              {/* Form Actions */}
              <div className="px-6 py-4 bg-gray-50 text-right">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : isEdit ? 'Update Invoice' : 'Create Invoice'}
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default InvoiceForm;
