import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import DashboardLayout from "../components/DashboardLayout";
import { showToast } from "../modules/utils";
import API from "../services/api";
import { addEditInvoices, deleteInvoices } from "../redux/invoiceSlice";
import ConfirmModal from "../components/ConfirmModal";

const InvoiceDetails = () => {
  const { invoice } = useLocation().state || {};
  const [invoiceData, setInvoiceData] = useState(invoice);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const [showEditForm, setShowEditForm] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const navigate = useNavigate();
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

  const handleEditSubmit = async (values) => {
    await dispatch(addEditInvoices(values));
    setInvoiceData(values);
    setShowEditForm(false);
  };

  const confirmDelete = () => {

    dispatch(deleteInvoices(invoiceData.uuid));
    setDeletePopup(false);
    setInvoiceData(null);
    navigate("/invoices");

  };
  useEffect(() => {
    if (invoice) {
      setInvoiceData(invoice);
      setLoading(false);
    }
  }, [invoice]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!invoiceData) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-red-500 text-lg">Invoice not found</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-semibold text-gray-800">Invoice Details</h2>

        </div>

        {showEditForm ? (
          <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
            <h3 className="text-xl font-medium mb-4">Edit Invoice</h3>
            <Formik
              initialValues={invoiceData}
              onSubmit={handleEditSubmit}
            >
              {({ setFieldValue }) => (
                <Form>
                  <div className="space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          PO Ref No
                          <span className="ml-1 text-xs text-gray-500">(Required)</span>
                        </label>
                        <Field
                          type="text"
                          name="refNo"
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Customer Name
                          <span className="ml-1 text-xs text-gray-500">(Required)</span>
                        </label>
                        <Field
                          type="text"
                          name="customerName"
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mobile
                          <span className="ml-1 text-xs text-gray-500">(Required)</span>
                        </label>
                        <Field
                          type="text"
                          name="mobile"
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Item Name
                          <span className="ml-1 text-xs text-gray-500">(Required)</span>
                        </label>
                        <Field
                          type="text"
                          name="itemName"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Weight Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Gross Weight
                          <span className="ml-1 text-xs text-gray-500">(kg)</span>
                        </label>
                        <Field
                          type="number"
                          name="grossWeight"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tare Weight
                          <span className="ml-1 text-xs text-gray-500">(kg)</span>
                        </label>
                        <Field
                          type="number"
                          name="tareWeight"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Net Weight
                          <span className="ml-1 text-xs text-gray-500">(kg)</span>
                        </label>
                        <Field
                          type="number"
                          name="netWeight"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Weighing Loss
                          <span className="ml-1 text-xs text-gray-500">(kg)</span>
                        </label>
                        <Field
                          type="number"
                          name="weighingLoss"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Container
                          <span className="ml-1 text-xs text-gray-500">(Optional)</span>
                        </label>
                        <Field
                          type="text"
                          name="container"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Weight Deduction
                          <span className="ml-1 text-xs text-gray-500">(kg)</span>
                        </label>
                        <Field
                          type="number"
                          name="weightDeduction"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Clean Weight
                          <span className="ml-1 text-xs text-gray-500">(kg)</span>
                        </label>
                        <Field
                          type="number"
                          name="cleanWeight"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Financial Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price
                          <span className="ml-1 text-xs text-gray-500">(₹)</span>
                        </label>
                        <Field
                          type="number"
                          name="price"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Total Amount
                          <span className="ml-1 text-xs text-gray-500">(₹)</span>
                        </label>
                        <Field
                          type="number"
                          name="totalAmount"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Labor Charges
                          <span className="ml-1 text-xs text-gray-500">(₹)</span>
                        </label>
                        <Field
                          type="number"
                          name="laborCharges"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Net Amount
                          <span className="ml-1 text-xs text-gray-500">(₹)</span>
                        </label>
                        <Field
                          type="number"
                          name="netAmount"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Deduction
                          <span className="ml-1 text-xs text-gray-500">(₹)</span>
                        </label>
                        <Field
                          type="number"
                          name="deduction"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Air Loss
                          <span className="ml-1 text-xs text-gray-500">(₹)</span>
                        </label>
                        <Field
                          type="number"
                          name="airLoss"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Net Deduction
                          <span className="ml-1 text-xs text-gray-500">(₹)</span>
                        </label>
                        <Field
                          type="number"
                          name="netDeduction"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Additional Information */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Oil Content Report
                        <span className="ml-1 text-xs text-gray-500">(Optional)</span>
                      </label>
                      <Field
                        type="text"
                        name="oilContentReport"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowEditForm(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      Save Changes
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="flex flex-col gap-6">

              {/* Basic Information */}
              <div className="">
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Basic Information</h3>
                <div className="space-y-2">
                  <InfoRow label="PO Ref No" value={invoiceData.refNo} />
                  <InfoRow label="Customer" value={invoiceData.customerName} />
                  <InfoRow label="Mobile" value={invoiceData.mobile} />
                  <InfoRow label="Item Name" value={invoiceData.itemName} />
                </div>
              </div>

              {/* Weight Details */}
              <div className="">
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Weight Details</h3>
                <div className="space-y-2">
                  <InfoRow label="Gross Weight" value={`${invoiceData.grossWeight} kg`} />
                  <InfoRow label="Tare Weight" value={`${invoiceData.tareWeight} kg`} />
                  <InfoRow label="Net Weight" value={`${invoiceData.netWeight} kg`} />
                  <InfoRow label="Weighing Loss" value={`${invoiceData.weighingLoss} kg`} />
                  <InfoRow label="Clean Weight" value={`${invoiceData.cleanWeight} kg`} />
                </div>
              </div>

              {/* Financial Details */}
              <div className="">
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Financial Details</h3>
                <div className="space-y-2">
                  <InfoRow label="PO Ref No" value={invoiceData.refNo} />
                  <InfoRow label="Gross Weight" value={`${invoiceData.grossWeight} kg`} />
                  <InfoRow label="Tare Weight" value={`${invoiceData.tareWeight} kg`} />
                  <InfoRow label="Net Weight" value={`${invoiceData.netWeight} kg`} />
                  <InfoRow label="Weighing Loss" value={`${invoiceData.weighingLoss} kg`} />
                  <InfoRow label="Container" value={invoiceData.container} />
                  <InfoRow label="Weight Deduction" value={`${invoiceData.weightDeduction} kg`} />
                  <InfoRow label="Clean Weight" value={`${invoiceData.cleanWeight} kg`} />
                  <InfoRow label="Price" value={`₹${invoiceData.price}`} />
                  <InfoRow label="Total Amount" value={`₹${invoiceData.totalAmount}`} />
                  <InfoRow label="Labor Charges" value={`₹${invoiceData.laborCharges}`} />
                  <InfoRow label="Net Amount" value={`₹${invoiceData.netAmount}`} />
                  <InfoRow label="Deduction" value={`₹${invoiceData.deduction}`} />
                  <InfoRow label="Air Loss" value={`₹${invoiceData.airLoss}`} />
                  <InfoRow label="Net Deduction" value={`₹${invoiceData.netDeduction}`} />
                  <InfoRow label="Oil Content Report" value={invoiceData.oilContentReport} />
                </div>
              </div>

            </div>
          </div>

        )}
        <div className="flex flex-wrap gap-4 mt-6">
          {/* Download Button */}
          <button
            className="flex items-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
            onClick={() => handleDownload(invoiceData.uuid, invoiceData.refNo)}
            data-tooltip-id="download"
            data-tooltip-content="Download this invoice as PDF"
            aria-label="Download Invoice"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span className="text-sm md:text-base">Download Invoice</span>
          </button>
          <Tooltip id="download" place="top" />

          {/* Edit Button */}
          <button
            className="flex items-center bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-300"
            onClick={() => setShowEditForm(true)}
            data-tooltip-id="edit"
            data-tooltip-content="Edit invoice details"
            aria-label="Edit Invoice"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span className="text-sm md:text-base">Edit Invoice</span>
          </button>
          <Tooltip id="edit" place="top" />

          {/* Delete Button */}
          <button
            className="flex items-center bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-300"
            onClick={() => setDeletePopup(true)}
            data-tooltip-id="delete"
            data-tooltip-content="Delete this invoice"
            aria-label="Delete Invoice"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="text-sm md:text-base">Delete Invoice</span>
          </button>
          <Tooltip id="delete" place="top" />
        </div>

      </div>
      {deletePopup && (
        <ConfirmModal
          isOpen={deletePopup}
          onConfirm={confirmDelete}
          onCancel={() => setDeletePopup(false)}
          message="Are you sure you want to delete this Invoice?"
        />
      )}
    </DashboardLayout>
  );
};

export default InvoiceDetails;

const InfoRow = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row justify-between sm:items-center">
    <span className="font-medium text-gray-700">{label}:</span>
    <span className="text-gray-600">{value}</span>
  </div>
);
