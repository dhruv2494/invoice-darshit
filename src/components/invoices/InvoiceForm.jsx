import React, { useEffect, useState } from 'react';
import { Formik, FieldArray } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { clearInvoice, createInvoice, fetchInvoiceById, updateInvoice } from '../../redux/invoiceSlice';
import { getPurchaseOrders } from '../../redux/purchaseOrderSlice';
import Select from 'react-select';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiArrowLeft } from 'react-icons/fi';

const itemSchema = Yup.object().shape({
    itemName: Yup.string().required('Item Name is required'),
    grossWeight: Yup.number().required('Gross Weight is required').min(0),
    tareWeight: Yup.number().required('Tare Weight is required').min(0),
    netWeight: Yup.number().required('Net Weight is required').min(0),
    weighingLoss: Yup.number().required('Weighing Loss is required').min(0),
    cleanWeight: Yup.number().required('Clean Weight is required').min(0),
    container: Yup.string().required('Container is required'),
    price: Yup.number().required('Price is required').min(0),
    laborCharges: Yup.number().required('Labor Charges is required').min(0),
    deduction: Yup.number().required('Deduction is required').min(0),
    airLoss: Yup.number().required('Air Loss is required').min(0),
    netDeduction: Yup.number().required('Net Deduction is required').min(0),
    totalAmount: Yup.number().required('Total Amount is required').min(0),
});

const validationSchema = Yup.object({
    invoiceNumber: Yup.string().required('Invoice Number is required'),
    date: Yup.date().required('Invoice Date is required'),
    customerName: Yup.string().required('Customer Name is required'),
    customer_id: Yup.string().required('Customer is required'),
    purchaseOrder: Yup.string().required('Purchase Order is required'),
    items: Yup.array().of(itemSchema).min(1, 'At least one item is required'),
    netAmount: Yup.number().required('Net Amount is required').min(0),
    status: Yup.string().required('Status is required'),
    notes: Yup.string(),
    terms: Yup.string(),
});
const mapApiToFormValues = (invoice) => {
    if (!invoice) return {};
    return {
        ...invoice,
        invoiceNumber: invoice.invoice_number,
        date: invoice.date,
        customerName: invoice.customer.name,
        customer_id: invoice.customer.id,
        purchaseOrder: invoice.po_id,
        items: (invoice.items || []).map((item) => ({
            id: item.id, // preserve item id for editing
            itemName: item.item_name,
            grossWeight: item.gross_weight,
            tareWeight: item.tare_weight,
            netWeight: item.net_weight,
            weighingLoss: item.weighing_loss,
            cleanWeight: item.clean_weight,
            container: item.container,
            price: item.price,
            laborCharges: item.labor_charges,
            deduction: item.deduction,
            airLoss: item.air_loss,
            netDeduction: item.net_deduction,
            totalAmount: item.total_amount,
        })),
        netAmount: invoice.total_amount,
        status: invoice.status,
        notes: invoice.notes,
        terms: invoice.terms_conditions,
    };
};
const InvoiceForm = ({ isEdit = false }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { uuid } = useParams();
    const { loading, error } = useSelector((state) => state.invoice);
    const invoice = useSelector((state) => state.invoice.invoice);
    const purchaseOrders = useSelector((state) => state.purchaseOrder.purchaseOrders);
    const [initialValues, setInitialValues] = useState({});
    useEffect(() => {
        if (!purchaseOrders || purchaseOrders.length === 0) {
            dispatch(getPurchaseOrders());
        }
    }, [dispatch, purchaseOrders]);

    // Fetch invoice on mount or uuid change
    useEffect(() => {
        if (uuid) {
            dispatch(fetchInvoiceById(uuid));
        }
        return () => {
            dispatch(clearInvoice());
        };
    }, [dispatch, uuid]);

    // Set initial values when invoice changes
    useEffect(() => {
        if (uuid && invoice) {
            setInitialValues(mapApiToFormValues(invoice));
        } else if (!uuid) {
            setInitialValues(defaultInitialValues);
        }
    return;
    }, [uuid, invoice]);

    const defaultInitialValues = {
        invoiceNumber: `INV-${Date.now()}`,
        date: '',
        customerName: '',
        customer_id: '',
        purchaseOrder: '',
        items: [
            {
                itemName: '',
                grossWeight: '',
                tareWeight: '',
                netWeight: '',
                weighingLoss: '',
                cleanWeight: '',
                container: '',
                price: '',
                laborCharges: '',
                deduction: '',
                airLoss: '',
                netDeduction: '',
                totalAmount: '',
            },
        ],
        netAmount: '',
        status: '',
        notes: '',
        terms: '',
    };

    if (!initialValues.items || !Array.isArray(initialValues.items)) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <span className="text-gray-500">Loading invoice data...</span>
            </div>
        );
    }
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            enableReinitialize
            onSubmit={async (values) => {
                // Map frontend values to backend API format
                function mapInvoiceToApi(values) {
                    return {
                        ...values,
                        invoice_number: values.invoiceNumber,
                        date: values.date,
                        customer_id: values.customer_id,
                        po_id: values.purchaseOrder,
                        status: values.status,
                        total_amount: values.netAmount,
                        notes: values.notes,
                        terms: values.terms,
                        items: values.items.map(item => ({
                            ...(item.id ? { id: item.id } : {}),
                            item_name: item.itemName,
                            gross_weight: item.grossWeight,
                            tare_weight: item.tareWeight,
                            net_weight: item.netWeight,
                            weighing_loss: item.weighingLoss,
                            clean_weight: item.cleanWeight,
                            container: item.container,
                            price: item.price,
                            labor_charges: item.laborCharges,
                            deduction: item.deduction,
                            air_loss: item.airLoss,
                            net_deduction: item.netDeduction,
                            total_amount: item.totalAmount,
                        })),
                    };
                }
                const apiPayload = mapInvoiceToApi(values);
                if (isEdit) {
                    await dispatch(updateInvoice({ id: uuid, invoiceData: apiPayload }));
                } else {
                    await dispatch(createInvoice(apiPayload));
                }
                navigate('/invoices');
            }}
        >
            {(formik) => (
                <form onSubmit={formik.handleSubmit} className="max-w-4xl mx-auto bg-white shadow rounded-xl p-0 border border-gray-200">
                    {/* Invoice Details Card Section */}
                    <div className="border border-gray-200 rounded-lg p-6 bg-gray-50 mb-6">
                        <h2 className="text-2xl font-bold mb-4">{isEdit ? 'Edit Invoice' : 'Create Invoice'}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
                                <input type="text" name="invoiceNumber" onChange={formik.handleChange} value={formik.values.invoiceNumber} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" disabled />
                                {formik.touched.invoiceNumber && formik.errors.invoiceNumber && <div className="text-red-500 text-xs mt-1">{formik.errors.invoiceNumber}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Date</label>
                                <input type="date" name="date" onChange={formik.handleChange} value={formik.values.date} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                                {formik.touched.date && formik.errors.date && <div className="text-red-500 text-xs mt-1">{formik.errors.date}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                                <input type="text" name="customerName" onChange={formik.handleChange} value={formik.values.customerName} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" disabled />
                                {formik.touched.customerName && formik.errors.customerName && <div className="text-red-500 text-xs mt-1">{formik.errors.customerName}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Order</label>
                                <Select
                                    name="purchaseOrder"
                                    options={purchaseOrders.map(po => ({ ...po, value: po.id, label: po.po_number || po.po_ref_no || po.id }))}
                                    value={purchaseOrders.map(po => ({ value: po.id, label: po.po_number || po.po_ref_no || po.id })).find(option => option.value === formik.values.purchaseOrder) || null}
                                    onChange={option => {
                                        formik.setFieldValue('purchaseOrder', option ? option.value : '');
                                        formik.setFieldValue('customerName', option ? option.supplier_name : '');
                                        formik.setFieldValue('customer_id', option ? option.supplier_id : '');
                                    }}
                                    onBlur={() => formik.setFieldTouched('purchaseOrder', true)}
                                    isSearchable
                                    placeholder="Select Purchase Order..."
                                    classNamePrefix="react-select"
                                />
                                {formik.touched.purchaseOrder && formik.errors.purchaseOrder && <div className="text-red-500 text-xs mt-1">{formik.errors.purchaseOrder}</div>}
                            </div>
                            {/* <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Net Amount</label>
                                <input type="number" name="netAmount" onChange={formik.handleChange} value={formik.values.netAmount} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                                {formik.touched.netAmount && formik.errors.netAmount && <div className="text-red-500 text-xs mt-1">{formik.errors.netAmount}</div>}
                            </div> */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select name="status" onChange={formik.handleChange} value={formik.values.status} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
                                    <option value="">Select status</option>
                                    <option value="paid">Paid</option>
                                    <option value="pending">Pending</option>
                                    <option value="overdue">Overdue</option>
                                    <option value="draft">Draft</option>
                                </select>
                                {formik.touched.status && formik.errors.status && <div className="text-red-500 text-xs mt-1">{formik.errors.status}</div>}
                            </div>
                            {/* <div className="md:col-span-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                <textarea name="notes" onChange={formik.handleChange} value={formik.values.notes} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" rows={2} />
                                {formik.touched.notes && formik.errors.notes && <div className="text-red-500 text-xs mt-1">{formik.errors.notes}</div>}
                            </div>
                            <div className="md:col-span-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Terms & Conditions</label>
                                <textarea name="terms" onChange={formik.handleChange} value={formik.values.terms} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" rows={2} />
                                {formik.touched.terms && formik.errors.terms && <div className="text-red-500 text-xs mt-1">{formik.errors.terms}</div>}
                            </div> */}
                        </div>
                    </div>

                    {/* Items Table Section */}
                    <div className="p-6">
                        <h3 className="text-lg font-semibold mb-3">Invoice Items</h3>
                        <FieldArray name="items">
                            {({ push, remove }) => (
                                <div className="space-y-4">
                                    {formik.values.items.map((item, idx) => (
                                        <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-gray-50 relative">
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                                                    <input type="text" name={`items[${idx}].itemName`} value={item.itemName} onChange={formik.handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                                                    {formik.touched.items && formik.touched.items[idx] && formik.errors.items && formik.errors.items[idx] && formik.errors.items[idx].itemName && (
                                                        <div className="text-red-500 text-xs mt-1">{formik.errors.items[idx].itemName}</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Gross Weight</label>
                                                    <input type="number" name={`items[${idx}].grossWeight`} value={item.grossWeight} onChange={formik.handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                                                    {formik.touched.items && formik.touched.items[idx] && formik.errors.items && formik.errors.items[idx] && formik.errors.items[idx].grossWeight && (
                                                        <div className="text-red-500 text-xs mt-1">{formik.errors.items[idx].grossWeight}</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tare Weight</label>
                                                    <input type="number" name={`items[${idx}].tareWeight`} value={item.tareWeight} onChange={formik.handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                                                    {formik.touched.items && formik.touched.items[idx] && formik.errors.items && formik.errors.items[idx] && formik.errors.items[idx].tareWeight && (
                                                        <div className="text-red-500 text-xs mt-1">{formik.errors.items[idx].tareWeight}</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Net Weight</label>
                                                    <input type="number" name={`items[${idx}].netWeight`} value={item.netWeight} onChange={formik.handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                                                    {formik.touched.items && formik.touched.items[idx] && formik.errors.items && formik.errors.items[idx] && formik.errors.items[idx].netWeight && (
                                                        <div className="text-red-500 text-xs mt-1">{formik.errors.items[idx].netWeight}</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Weighing Loss</label>
                                                    <input type="number" name={`items[${idx}].weighingLoss`} value={item.weighingLoss} onChange={formik.handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                                                    {formik.touched.items && formik.touched.items[idx] && formik.errors.items && formik.errors.items[idx] && formik.errors.items[idx].weighingLoss && (
                                                        <div className="text-red-500 text-xs mt-1">{formik.errors.items[idx].weighingLoss}</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Clean Weight</label>
                                                    <input type="number" name={`items[${idx}].cleanWeight`} value={item.cleanWeight} onChange={formik.handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                                                    {formik.touched.items && formik.touched.items[idx] && formik.errors.items && formik.errors.items[idx] && formik.errors.items[idx].cleanWeight && (
                                                        <div className="text-red-500 text-xs mt-1">{formik.errors.items[idx].cleanWeight}</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Container</label>
                                                    <input type="text" name={`items[${idx}].container`} value={item.container} onChange={formik.handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                                                    {formik.touched.items && formik.touched.items[idx] && formik.errors.items && formik.errors.items[idx] && formik.errors.items[idx].container && (
                                                        <div className="text-red-500 text-xs mt-1">{formik.errors.items[idx].container}</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                                    <input type="number" name={`items[${idx}].price`} value={item.price} onChange={formik.handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                                                    {formik.touched.items && formik.touched.items[idx] && formik.errors.items && formik.errors.items[idx] && formik.errors.items[idx].price && (
                                                        <div className="text-red-500 text-xs mt-1">{formik.errors.items[idx].price}</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Labor Charges</label>
                                                    <input type="number" name={`items[${idx}].laborCharges`} value={item.laborCharges} onChange={formik.handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                                                    {formik.touched.items && formik.touched.items[idx] && formik.errors.items && formik.errors.items[idx] && formik.errors.items[idx].laborCharges && (
                                                        <div className="text-red-500 text-xs mt-1">{formik.errors.items[idx].laborCharges}</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Deduction</label>
                                                    <input type="number" name={`items[${idx}].deduction`} value={item.deduction} onChange={formik.handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                                                    {formik.touched.items && formik.touched.items[idx] && formik.errors.items && formik.errors.items[idx] && formik.errors.items[idx].deduction && (
                                                        <div className="text-red-500 text-xs mt-1">{formik.errors.items[idx].deduction}</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Air Loss</label>
                                                    <input type="number" name={`items[${idx}].airLoss`} value={item.airLoss} onChange={formik.handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                                                    {formik.touched.items && formik.touched.items[idx] && formik.errors.items && formik.errors.items[idx] && formik.errors.items[idx].airLoss && (
                                                        <div className="text-red-500 text-xs mt-1">{formik.errors.items[idx].airLoss}</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Net Deduction</label>
                                                    <input type="number" name={`items[${idx}].netDeduction`} value={item.netDeduction} onChange={formik.handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                                                    {formik.touched.items && formik.touched.items[idx] && formik.errors.items && formik.errors.items[idx] && formik.errors.items[idx].netDeduction && (
                                                        <div className="text-red-500 text-xs mt-1">{formik.errors.items[idx].netDeduction}</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
                                                    <input type="number" name={`items[${idx}].totalAmount`} value={item.totalAmount} onChange={formik.handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                                                    {formik.touched.items && formik.touched.items[idx] && formik.errors.items && formik.errors.items[idx] && formik.errors.items[idx].totalAmount && (
                                                        <div className="text-red-500 text-xs mt-1">{formik.errors.items[idx].totalAmount}</div>
                                                    )}
                                                </div>
                                            </div>
                                            <button type="button" onClick={() => remove(idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => push({ itemName: '', grossWeight: '', tareWeight: '', netWeight: '', weighingLoss: '', cleanWeight: '', container: '', price: '', laborCharges: '', deduction: '', airLoss: '', netDeduction: '', totalAmount: '' })}
                                        className="flex items-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded shadow hover:bg-blue-200 text-sm mt-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                        Add Item
                                    </button>
                                    {formik.touched.items && typeof formik.errors.items === 'string' && (
                                        <div className="text-red-500 text-xs mt-1">{formik.errors.items}</div>
                                    )}
                                </div>
                            )}
                        </FieldArray>
                    </div>

                    {/* Totals Section */}
                    <div className="px-6 pb-4 flex flex-col md:flex-row md:items-center md:justify-between border-t border-gray-100 bg-gray-50">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Net Amount</label>
                            <input type="number" name="netAmount" onChange={formik.handleChange} value={formik.values.netAmount} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                            {formik.touched.netAmount && formik.errors.netAmount && <div className="text-red-500 text-xs mt-1">{formik.errors.netAmount}</div>}
                        </div>
                    </div>

                    {/* Notes and Terms Section */}
                    <div className="px-6 pb-6">
                        <div className="md:col-span-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                            <textarea name="notes" onChange={formik.handleChange} value={formik.values.notes} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" rows={2} />
                            {formik.touched.notes && formik.errors.notes && <div className="text-red-500 text-xs mt-1">{formik.errors.notes}</div>}
                        </div>
                        <div className="md:col-span-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Terms & Conditions</label>
                            <textarea name="terms" onChange={formik.handleChange} value={formik.values.terms} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" rows={2} />
                            {formik.touched.terms && formik.errors.terms && <div className="text-red-500 text-xs mt-1">{formik.errors.terms}</div>}
                        </div>

                        {/* Save/Cancel Buttons */}
                        <div className="mt-8 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => navigate('/invoices')}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                            >
                                <FiArrowLeft className="mr-2" /> Cancel
                            </button>
                            <button
                                onClick={formik.handleSubmit}
                                disabled={loading}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <FiSave className="mr-2" /> {isEdit ? 'Update Invoice' : 'Save Invoice'}
                            </button>
                        </div>
                        {error && <div className="text-red-500 text-sm mt-4">{error}</div>}
                    </div>
                </form>
            )}
        </Formik>
    );
};

export default InvoiceForm;
