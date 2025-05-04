import { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import DashboardLayout from "../components/DashboardLayout";
import {
  addEditPurchaseOrder,
  deletePurchaseOrder,
  getPurchaseOrders,
} from "../redux/purchaseOrderSlice";
import { useDispatch, useSelector } from "react-redux";
import ConfirmModal from "../components/ConfirmModal";
import { toast } from "react-toastify";
import { getCustomers } from "../redux/customerSlice";
import {
  addEditInvoices,
  deleteInvoices,
  getCompletedPurchaseOrder,
  getInvoices,
} from "../redux/invoiceSlice";
import API from "../services/api";
import { showToast } from "../modules/utils";
import Select from "react-select";

// Validation schema using Yup
const validationSchema = Yup.object({
  purchaseOrderId: Yup.string().required("Purchase Order ID is required"),
  refNo: Yup.string().required("Reference Number is required"),
  customerId: Yup.string().required("Customer ID is required"),
  grossWeight: Yup.number()
    .required("Gross Weight is required")
    .positive("Gross Weight must be a positive number"),
  tareWeight: Yup.number()
    .required("Tare Weight is required")
    .positive("Tare Weight must be a positive number"),
  netWeight: Yup.number()
    .required("Net Weight is required")
    .positive("Net Weight must be a positive number"),
  weighingLoss: Yup.number()
    .required("Weighing Loss is required")
    .positive("Weighing Loss must be a positive number"),
  container: Yup.string().required("Container information is required"),
  weightDeduction: Yup.number()
    .nullable()
    .positive("Weight Deduction must be a positive number"),
  cleanWeight: Yup.number()
    .required("Clean Weight is required")
    .positive("Clean Weight must be a positive number"),
  price: Yup.number()
    .required("Price is required")
    .positive("Price must be a positive number"),
  totalAmount: Yup.number()
    .required("Total Amount is required")
    .positive("Total Amount must be a positive number"),
  laborCharges: Yup.number()
    .required("Labor Charges are required")
    .positive("Labor Charges must be a positive number"),
  netAmount: Yup.number()
    .required("Net Amount is required")
    .positive("Net Amount must be a positive number"),
  deduction: Yup.number()
    .nullable()
    .positive("Deduction must be a positive number"),
  airLoss: Yup.number()
    .nullable()
    .positive("Air Loss must be a positive number"),
  netDeduction: Yup.number()
    .nullable()
    .positive("Net Deduction must be a positive number"),
  oilContentReport: Yup.string().required("Oil Content Report is required"),
});

const Invoices = () => {
  const dispatch = useDispatch();
  const { completedPurchaseOrder, invoices } = useSelector(
    (state) => state.invoice
  );

  const [editingInvoce, setEditingInvoce] = useState(null);
  const [deletePopup, setDeletePopup] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    dispatch(getInvoices());
    dispatch(getCompletedPurchaseOrder());
  }, [dispatch]);

  const handleFormSubmit = (values, { resetForm }) => {
    dispatch(addEditInvoices(values));
    setEditingInvoce(null);
    resetForm();
    setShowForm(false);
  };

  const handleEditClick = (order) => {
    console.log(order, "orderorder");
    setEditingInvoce(order);
    setShowForm(true);
  };

  const handleAddClick = () => {
    setEditingInvoce(null);
    setShowForm(true);
  };

  const handleDeleteClick = (order) => {
    setOrderToDelete(order);
    setDeletePopup(true);
  };

  const confirmDelete = () => {
    if (orderToDelete) {
      dispatch(deleteInvoices(orderToDelete.uuid));
      setDeletePopup(false);
      setOrderToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeletePopup(false);
    setOrderToDelete(null);
  };
  const handleDownload = async (uuid, refNo) => {
    try {
      const response = await API.get(`/invoice/download-invoice/${uuid}`, {
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
  const filteredInvoices = invoices?.filter((item) => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      item.refNo?.toLowerCase().includes(lowerSearch) ||
      item.customerName?.toLowerCase().includes(lowerSearch) ||
      item.address?.toLowerCase().includes(lowerSearch) ||
      item.itemName?.toLowerCase().includes(lowerSearch) ||
      String(item.mobile)?.toLowerCase().includes(lowerSearch) ||
      String(item.grossWeight)?.toLowerCase().includes(lowerSearch) ||
      String(item.tareWeight)?.toLowerCase().includes(lowerSearch) ||
      String(item.netWeight)?.toLowerCase().includes(lowerSearch) ||
      String(item.weighingLoss)?.toLowerCase().includes(lowerSearch) ||
      item.container?.toLowerCase().includes(lowerSearch) ||
      String(item.weightDeduction)?.toLowerCase().includes(lowerSearch) ||
      String(item.cleanWeight)?.toLowerCase().includes(lowerSearch) ||
      String(item.price)?.toLowerCase().includes(lowerSearch) ||
      String(item.totalAmount)?.toLowerCase().includes(lowerSearch) ||
      String(item.laborCharges)?.toLowerCase().includes(lowerSearch) ||
      String(item.netAmount)?.toLowerCase().includes(lowerSearch) ||
      String(item.deduction)?.toLowerCase().includes(lowerSearch) ||
      String(item.airLoss)?.toLowerCase().includes(lowerSearch) ||
      String(item.netDeduction)?.toLowerCase().includes(lowerSearch) ||
      item.oilContentReport?.toLowerCase().includes(lowerSearch)
    );
  });
  const handlePurchaseOrderChange = (event, setFieldValue) => {
    const selectedRefNo = event.target.value;

    // Find the selected purchase order by its refNo
    const selectedOrder = completedPurchaseOrder.find(
      (order) => order.refNo === selectedRefNo
    );

    if (selectedOrder) {
      // Update Formik values with the selected order's details
      setFieldValue("refNo", selectedRefNo);
      setFieldValue("purchaseOrderId", selectedOrder.uuid); // Update purchaseOrderId with the selected order's ID
      setFieldValue("customerId", selectedOrder.customerId);
      setFieldValue("customerName", selectedOrder.customerName);
      setFieldValue("address", selectedOrder.address);
      setFieldValue("mobile", selectedOrder.mobile);
      setFieldValue("itemName", selectedOrder.itemName);
    }
  };

  const CustomSelect = ({ field, form, options }) => {
    const handleChange = (selectedOption) => {
      form.setFieldValue(
        field.name,
        selectedOption ? selectedOption.value : ""
      );
      handlePurchaseOrderChange(
        { target: { value: selectedOption?.value } },
        form.setFieldValue
      );
    };

    const customOptions = options.map((order) => ({
      value: order.refNo,
      label: order.refNo,
    }));

    return (
      <Select
        name={field.name}
        value={customOptions.find((opt) => opt.value === field.value)}
        onChange={handleChange}
        options={customOptions}
        isClearable
        className="react-select-container"
        classNamePrefix="react-select"
      />
    );
  };
  return (
    <DashboardLayout>
      <div className="px-6 py-4">
        <h2 className="text-3xl font-semibold mb-6">Invoices</h2>
        <button
          onClick={handleAddClick}
          className="mb-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Add Invoive
        </button>

        {showForm && (
          <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
            <h3 className="text-xl font-medium mb-4">
              {editingInvoce ? "Edit Invoice" : "Add New Invoice"}
            </h3>
            <Formik
              initialValues={{
                uuid: editingInvoce ? editingInvoce.uuid : null,
                refNo: editingInvoce ? editingInvoce.refNo : "",
                grossWeight: editingInvoce ? editingInvoce.grossWeight : "",
                tareWeight: editingInvoce ? editingInvoce.tareWeight : "",
                netWeight: editingInvoce ? editingInvoce.netWeight : "",
                weighingLoss: editingInvoce ? editingInvoce.weighingLoss : "",
                container: editingInvoce ? editingInvoce.container : "",
                weightDeduction: editingInvoce
                  ? editingInvoce.weightDeduction
                  : "",
                cleanWeight: editingInvoce ? editingInvoce.cleanWeight : "",
                price: editingInvoce ? editingInvoce.price : "",
                totalAmount: editingInvoce ? editingInvoce.totalAmount : "",
                laborCharges: editingInvoce ? editingInvoce.laborCharges : "",
                netAmount: editingInvoce ? editingInvoce.netAmount : "",
                deduction: editingInvoce ? editingInvoce.deduction : "",
                airLoss: editingInvoce ? editingInvoce.airLoss : "",
                netDeduction: editingInvoce ? editingInvoce.netDeduction : "",
                oilContentReport: editingInvoce
                  ? editingInvoce.oilContentReport
                  : "",
                customerName: editingInvoce ? editingInvoce.customerName : "",
                mobile: editingInvoce ? editingInvoce.mobile : "",
                address: editingInvoce ? editingInvoce.address : "",
                itemName: editingInvoce ? editingInvoce.itemName : "",
                purchaseOrderId: editingInvoce
                  ? editingInvoce.purchaseOrderId
                  : null,
                customerId: editingInvoce ? editingInvoce.customerId : null,
              }}
              validationSchema={validationSchema}
              onSubmit={handleFormSubmit}
              enableReinitialize
            >
              {({ setFieldValue }) => (
                <Form>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Purchase Order Ref Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Completed Purchase Order Ref Number
                      </label>
                      <Field
                        name="refNo"
                        component={CustomSelect}
                        options={completedPurchaseOrder}
                      />

                      <ErrorMessage
                        name="refNo"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                    {/* Customer Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Customer Name
                      </label>
                      <Field
                        type="text"
                        name="customerName"
                        disabled
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                      />
                    </div>
                    {/* Mobile */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Mobile
                      </label>
                      <Field
                        type="number"
                        name="mobile"
                        disabled
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                      />
                    </div>
                    {/* Address */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Address
                      </label>
                      <Field
                        type="address"
                        name="address"
                        disabled
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                      />
                    </div>
                    {/* Item Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Item Name
                      </label>
                      <Field
                        type="text"
                        name="itemName"
                        disabled
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                      />
                      <ErrorMessage
                        name="itemName"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                    {/* Gross Weight */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Gross Weight
                      </label>
                      <Field
                        type="number"
                        name="grossWeight"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <ErrorMessage
                        name="grossWeight"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                    {/* Tare Weight */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Tare Weight
                      </label>
                      <Field
                        type="number"
                        name="tareWeight"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <ErrorMessage
                        name="tareWeight"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                    {/* Net Weight */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Net Weight
                      </label>
                      <Field
                        type="number"
                        name="netWeight"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <ErrorMessage
                        name="netWeight"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                    {/* Weighing Loss */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Weighing Loss
                      </label>
                      <Field
                        type="number"
                        name="weighingLoss"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <ErrorMessage
                        name="weighingLoss"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                    {/* Container */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Container
                      </label>
                      <Field
                        type="text"
                        name="container"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <ErrorMessage
                        name="container"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                    {/* Weight Deduction */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Weight Deduction
                      </label>
                      <Field
                        type="number"
                        name="weightDeduction"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <ErrorMessage
                        name="weightDeduction"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                    {/* Clean Weight */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Clean Weight
                      </label>
                      <Field
                        type="number"
                        name="cleanWeight"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <ErrorMessage
                        name="cleanWeight"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                    {/* Price */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Price
                      </label>
                      <Field
                        type="number"
                        name="price"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <ErrorMessage
                        name="price"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                    {/* Total Amount */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Total Amount
                      </label>
                      <Field
                        type="number"
                        name="totalAmount"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <ErrorMessage
                        name="totalAmount"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                    {/* Labor Charges */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Labor Charges
                      </label>
                      <Field
                        type="number"
                        name="laborCharges"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <ErrorMessage
                        name="laborCharges"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                    {/* Net Amount */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Net Amount
                      </label>
                      <Field
                        type="number"
                        name="netAmount"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <ErrorMessage
                        name="netAmount"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                    {/* Deduction */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Deduction
                      </label>
                      <Field
                        type="number"
                        name="deduction"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <ErrorMessage
                        name="deduction"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                    {/* Air Loss */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Air Loss
                      </label>
                      <Field
                        type="number"
                        name="airLoss"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <ErrorMessage
                        name="airLoss"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                    {/* Net Deduction */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Net Deduction
                      </label>
                      <Field
                        type="number"
                        name="netDeduction"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <ErrorMessage
                        name="netDeduction"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                    {/* Oil Content Report */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Oil Content Report
                      </label>
                      <Field
                        type="text"
                        name="oilContentReport"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <ErrorMessage
                        name="oilContentReport"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                  </div>

                  {/* Submit and Cancel Buttons */}
                  <div className="mt-4">
                    <button
                      type="submit"
                      className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                    >
                      {editingInvoce ? "Update Invoive" : "Add Invoive"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="w-full mt-2 py-2 px-4 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        )}

        {/* List of orders */}
        <div className="rounded-xl shadow-lg border border-gray-200 mb-8">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search orders..."
            className="p-3 w-full border-b border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Po Ref. No
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Mobile
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Item Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Gross Weight
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Tare Weight
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Net Weight
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Weighing Loss
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Container
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Weight Deduction
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Clean Weight
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Total Amount
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Labor Charges
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Net Amount
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Deduction
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Air Loss
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Net Deduction
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Oil Content Report
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredInvoices.map((order) => (
                  <tr
                    key={order.uuid}
                    className="hover:bg-sky-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {order.refNo}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {order.customerName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {order.mobile}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {order.address}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {order.itemName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {order.grossWeight}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {order.tareWeight}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {order.netWeight}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {order.weighingLoss}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {order.container}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {order.weightDeduction}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {order.cleanWeight}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {order.price}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {order.totalAmount}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {order.laborCharges}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {order.netAmount}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {order.deduction}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {order.airLoss}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {order.netDeduction}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {order.oilContentReport}
                    </td>
                    <td className="px-6 py-4 w-fit flex">
                      <button
                        onClick={() => handleEditClick(order)}
                        className="text-sky-600 hover:text-sky-800 font-medium mr-4 cursor-pointer transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(order)}
                        className="text-rose-600 hover:text-rose-800 font-medium mr-4 cursor-pointer transition-colors"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleDownload(order.uuid, order.refNo)}
                        className="text-sky-600 hover:text-sky-800 font-medium cursor-pointer transition-colors"
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {deletePopup && (
          <ConfirmModal
            isOpen={deletePopup}
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
            message="Are you sure you want to delete this Invoice?"
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Invoices;
const CustomSelect = ({ field, form, options }) => {
  const handleChange = (selectedOption) => {
    form.setFieldValue(field.name, selectedOption ? selectedOption.value : "");
    handlePurchaseOrderChange(
      { target: { value: selectedOption?.value } },
      form.setFieldValue
    );
  };

  const customOptions = options.map((order) => ({
    value: order.refNo,
    label: order.refNo,
  }));

  return (
    <Select
      name={field.name}
      value={customOptions.find((opt) => opt.value === field.value)}
      onChange={handleChange}
      options={customOptions}
      isClearable
      className="react-select-container"
      classNamePrefix="react-select"
    />
  );
};
