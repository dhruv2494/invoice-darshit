import React, { useEffect, useState, useMemo } from 'react';
import { Formik, Form, FieldArray, Field, ErrorMessage, useField, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { 
  createPurchaseOrder, 
  updatePurchaseOrder,
  resetCurrentOrder
} from '../../redux/purchaseOrderSlice';
import { getCustomers } from '../../redux/customerSlice';
import { showToast } from '../../modules/utils';
import { FiX, FiPlus, FiTrash2, FiSave, FiXCircle } from 'react-icons/fi';

// Validation Schema
const purchaseOrderSchema = Yup.object().shape({
  poNumber: Yup.string().required('PO Number is required'),
  orderDate: Yup.date().required('Order Date is required'),
  expectedDeliveryDate: Yup.date().required('Expected Delivery Date is required'),
  supplierId: Yup.string().required('Supplier is required'),
  status: Yup.string().required('Status is required'),
  notes: Yup.string(),
  terms: Yup.string(),
  items: Yup.array()
    .of(
      Yup.object().shape({
        productId: Yup.string().required('Product is required'),
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

const PurchaseOrderForm = ({ onClose, initialValues: propInitialValues = {}, isEdit = false, onSuccess }) => {
  const dispatch = useDispatch();
  const { customers } = useSelector((state) => state.customer);
  const { status } = useSelector((state) => state.purchaseOrder);
  
  // Format customers for react-select
  const customerOptions = useMemo(() => 
    customers.map(customer => ({
      value: customer.uuid,
      label: customer.name
    })),
    [customers]
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
        }}
        onBlur={() => {
          form.setFieldTouched(field.name, true);
        }}
        styles={customStyles}
        className="text-sm"
        classNamePrefix="select"
        placeholder="Search or select a supplier..."
        isClearable
        isSearchable
        noOptionsMessage={({ inputValue }) => 
          inputValue ? 'No matching suppliers found' : 'No suppliers available'
        }
        {...props}
      />
    );
  };
  
  // Removed products state as we're using a fixed product name now

  // Set initial values
  const getInitialValues = () => {
    // If we have propInitialValues and it's not an empty object
    if (propInitialValues && Object.keys(propInitialValues).length > 0) {
      return {
        ...propInitialValues,
        items: (propInitialValues.items && propInitialValues.items.length > 0) 
          ? propInitialValues.items 
          : [{
              productId: '',
              description: '',
              quantity: 1,
              unitPrice: 0,
              taxRate: 0,
            }]
      };
    }
    
    // Default values for a new purchase order
    return {
      poNumber: `PO-${Date.now()}`,
      orderDate: new Date().toISOString().split('T')[0],
      expectedDeliveryDate: '',
      supplierId: '',
      status: 'draft',
      notes: '',
      terms: '',
      items: [
        {
          productId: '',
          description: '',
          quantity: 1,
          unitPrice: 0,
          taxRate: 0,
        },
      ],
    };
  };
  
  const initialValues = getInitialValues();
  
  console.log('Initial Values:', initialValues); // Debug log

  // Fetch customers on component mount
  useEffect(() => {
    dispatch(getCustomers());
    
    // Clean up when component unmounts
    return () => {
      if (!isEdit && !propInitialValues?.id) {
        dispatch(resetCurrentOrder());
      }
    };
  }, [dispatch, isEdit, propInitialValues?.id]);

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (isEdit && propInitialValues?.id) {
        await dispatch(updatePurchaseOrder({ id: propInitialValues.id, ...values })).unwrap();
        showToast('Purchase order updated successfully', 'success');
      } else {
        await dispatch(createPurchaseOrder(values)).unwrap();
        showToast('Purchase order created successfully', 'success');
      }
      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
      }
    } catch (error) {
      console.error('Error saving purchase order:', error);
      showToast(error.message || 'Failed to save purchase order', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate line total
  const calculateLineTotal = (item) => {
    const quantity = parseFloat(item.quantity) || 0;
    const unitPrice = parseFloat(item.unitPrice) || 0;
    const taxRate = parseFloat(item.taxRate) || 0;
    const subtotal = quantity * unitPrice;
    const tax = (subtotal * taxRate) / 100;
    return subtotal + tax;
  };

  // Calculate order totals
  const calculateTotals = (items) => {
    if (!items || !Array.isArray(items)) {
      return { subtotal: 0, tax: 0, total: 0 };
    }
    
    return items.reduce(
      (acc, item) => {
        if (!item) return acc;
        
        const lineTotal = calculateLineTotal(item);
        const subtotal = parseFloat(item.quantity || 0) * parseFloat(item.unitPrice || 0);
        const tax = (subtotal * (parseFloat(item.taxRate || 0))) / 100;
        
        return {
          subtotal: acc.subtotal + (isNaN(subtotal) ? 0 : subtotal),
          tax: acc.tax + (isNaN(tax) ? 0 : tax),
          total: acc.total + (isNaN(lineTotal) ? 0 : lineTotal),
        };
      },
      { subtotal: 0, tax: 0, total: 0 }
    );
  };

  // Custom styles for react-select
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: '42px',
      borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
      boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
      '&:hover': {
        borderColor: state.isFocused ? '#3b82f6' : '#9ca3af',
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#3b82f6' : 'white',
      color: state.isSelected ? 'white' : '#1f2937',
      '&:hover': {
        backgroundColor: state.isSelected ? '#2563eb' : '#f3f4f6',
      },
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 50,
    }),
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            {isEdit ? 'Edit Purchase Order' : 'Create New Purchase Order'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={24} />
          </button>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={purchaseOrderSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, isSubmitting, setFieldValue }) => {
            const { subtotal, tax, total } = calculateTotals(values.items);
            
            return (
              <Form className="space-y-6">
              {/* Header Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    PO Number
                  </label>
                  <Field
                    type="text"
                    name="poNumber"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    disabled={!!propInitialValues}
                  />
                  <ErrorMessage
                    name="poNumber"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order Date
                  </label>
                  <Field
                    type="date"
                    name="orderDate"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <ErrorMessage
                    name="orderDate"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expected Delivery
                  </label>
                  <Field
                    type="date"
                    name="expectedDeliveryDate"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <ErrorMessage
                    name="expectedDeliveryDate"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </div>


              {/* Supplier and Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Supplier
                  </label>
                  <Field
                    name="supplierId"
                    component={CustomSelect}
                    options={customerOptions}
                    className="text-sm"
                  />
                  <ErrorMessage
                    name="supplierId"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <Field
                    as="select"
                    name="status"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    {status.map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="status"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </div>


              {/* Line Items */}
              <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Items</h3>
                </div>

                <FieldArray name="items">
                  {({ push, remove }) => (
                    <div className="space-y-4">
                      {values.items.map((item, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                        >
                          <div className="grid grid-cols-12 gap-4 items-start">
                            <div className="col-span-12 sm:col-span-4">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Product
                              </label>
                              <Field
                                type="text"
                                name={`items.${index}.productId`}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                value="groundnut"
                              />
                              <input type="hidden" name={`items.${index}.description`} value="Groundnut" />
                            </div>

                            <div className="col-span-12 sm:col-span-5">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                              </label>
                              <Field
                                as="textarea"
                                name={`items.${index}.description`}
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              />
                              <ErrorMessage
                                name={`items.${index}.description`}
                                component="div"
                                className="text-red-500 text-sm mt-1"
                              />
                            </div>

                            <div className="col-span-6 sm:col-span-1">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Qty
                              </label>
                              <Field
                                type="number"
                                name={`items.${index}.quantity`}
                                min="1"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              />
                              <ErrorMessage
                                name={`items.${index}.quantity`}
                                component="div"
                                className="text-red-500 text-sm mt-1"
                              />
                            </div>

                            <div className="col-span-6 sm:col-span-1">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Price
                              </label>
                              <Field
                                type="number"
                                name={`items.${index}.unitPrice`}
                                min="0"
                                step="0.01"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              />
                              <ErrorMessage
                                name={`items.${index}.unitPrice`}
                                component="div"
                                className="text-red-500 text-sm mt-1"
                              />
                            </div>

                            <div className="col-span-6 sm:col-span-1">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tax (%)
                              </label>
                              <Field
                                type="number"
                                name={`items.${index}.taxRate`}
                                min="0"
                                max="100"
                                step="0.01"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              />
                              <ErrorMessage
                                name={`items.${index}.taxRate`}
                                component="div"
                                className="text-red-500 text-sm mt-1"
                              />
                            </div>

                            <div className="col-span-6 sm:col-span-1 flex items-end">
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="text-red-600 hover:text-red-800 p-2"
                                disabled={values.items.length <= 1}
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          </div>

                          <div className="mt-2 text-right font-medium">
                            Line Total: ${calculateLineTotal(item).toFixed(2)}
                          </div>
                        </div>
                      ))}

                      <div className="flex justify-between">
                        <button
                          type="button"
                          onClick={() =>
                            push({
                              productId: '',
                              description: '',
                              quantity: 1,
                              unitPrice: 0,
                              taxRate: 0,
                            })
                          }
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <FiPlus className="mr-1" /> Add Item
                        </button>
                      </div>
                    </div>
                  )}
                </FieldArray>
              </div>

              {/* Totals */}
              <div className="mt-6 border-t border-gray-200 pt-4">
                <div className="flex justify-end">
                  <div className="w-full max-w-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax:</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-2 font-semibold text-lg">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes and Terms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <Field
                    as="textarea"
                    name="notes"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Terms & Conditions
                  </label>
                  <Field
                    as="textarea"
                    name="terms"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FiXCircle className="mr-2 h-4 w-4" />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <FiSave className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Saving...' : 'Save Purchase Order'}
                </button>
              </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default PurchaseOrderForm;
