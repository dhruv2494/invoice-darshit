import { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import DashboardLayout from "../components/DashboardLayout";
import { addEditCustomer } from "../redux/customerSlice";
import { useDispatch, useSelector } from "react-redux";
import ConfirmModal from "../components/ConfirmModal";
import Select from "react-select";
import {
  getCustomersFromDetails,
  getInvoicesFromDetails,
  getPurchaseOrdersFromDetails,
} from "../redux/customerDetailsSlice";
import { showToast } from "../modules/utils";
import API from "../services/api";

// Validation schema using Yup
const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  mobile: Yup.string()
    .required("Mobile is required")
    .matches(/^\d+$/, "Mobile must be a valid number"),
});

const CustomerDetails = () => {
  const { customers, purchaseOrders, invoices } = useSelector(
    (state) => state?.customerDetails
  );
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const options = customers.map((customer) => ({
    label: `${customer.name}-${customer.mobile}`,
    value: customer.uuid,
  }));
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermForinvoice, setSearchTermForinvoice] = useState("");

  const [selectedCustomer, setSelectedCustomer] = useState(options[0]);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCustomersFromDetails());
  }, [dispatch]);
  useEffect(() => {
    dispatch(getPurchaseOrdersFromDetails(selectedCustomer?.value));
    dispatch(getInvoicesFromDetails(selectedCustomer?.value));
  }, [selectedCustomer]);

  const filteredInvoices = invoices?.filter((item) => {
    const lowerSearch = searchTermForinvoice.toLowerCase();
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
  const filteredOrders = purchaseOrders?.filter((order) => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      order.customerName?.toLowerCase().includes(lowerSearch) ||
      order.mobile?.toLowerCase().includes(lowerSearch) ||
      order.address?.toLowerCase().includes(lowerSearch) ||
      order.itemName?.toLowerCase().includes(lowerSearch) ||
      String(order.price)?.toLowerCase().includes(lowerSearch) ||
      String(order.quantity)?.toLowerCase().includes(lowerSearch) ||
      String(order.refNo)?.toLowerCase().includes(lowerSearch) ||
      order.status?.toLowerCase().includes(lowerSearch)
    );
  });
  const handleFormSubmit = (values, { resetForm }) => {
    dispatch(addEditCustomer(values));
    setEditingCustomer(null);
    resetForm();
    setShowForm(false);
  };

  const handleAddClick = () => {
    setEditingCustomer(null);
    setShowForm(true);
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
  return (
    <DashboardLayout>
      <div className="px-6 py-4">
        <h2 className="text-3xl font-semibold mb-6">Customer Management</h2>

        {/* Add Customer Button */}
        <button
          onClick={handleAddClick}
          className="mb-6 px-5 py-2.5 bg-green-600 text-white font-medium rounded-xl hover:bg-emerald-700 shadow-md transition cursor-pointer"
        >
          Add Customer
        </button>

        <Select
          value={selectedCustomer}
          onChange={(selectedOption) => {
            console.log("Selected customer:", selectedOption);
            setSelectedCustomer(selectedOption);
          }}
          options={options}
          isClearable
          className="react-select-container"
          classNamePrefix="react-select"
        />
        {/* Add or Edit Customer Form */}
        {showForm && (
          <div className="bg-white shadow-lg rounded-xl p-6 mb-8 border border-gray-100">
            <h3 className="text-xl font-medium mb-4 text-indigo-600">
              {editingCustomer ? "Edit Customer" : "Add New Customer"}
            </h3>
            <Formik
              initialValues={{
                name: editingCustomer ? editingCustomer.name : "",
                mobile: editingCustomer ? editingCustomer.mobile : "",
                address: editingCustomer ? editingCustomer.address : "",
                uuid: editingCustomer ? editingCustomer.uuid : "",
              }}
              validationSchema={validationSchema}
              onSubmit={handleFormSubmit}
              enableReinitialize={true}
            >
              <Form>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <Field
                      type="text"
                      name="name"
                      className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                      placeholder="Enter name"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Mobile
                    </label>
                    <Field
                      type="text"
                      name="mobile"
                      className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                      placeholder="Enter mobile number"
                    />
                    <ErrorMessage
                      name="mobile"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <Field
                      type="address"
                      name="address"
                      className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                      placeholder="Enter address"
                    />
                    <ErrorMessage
                      name="address"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <button
                    type="submit"
                    className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 shadow-md transition cursor-pointer"
                  >
                    {editingCustomer ? "Update Customer" : "Add Customer"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="w-full mt-2 py-2 px-4 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 shadow-sm transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </Form>
            </Formik>
          </div>
        )}
        {selectedCustomer && (
          <div className="mt-5">
            <h2 className="text-3xl font-semibold mb-6">Purchase Orders</h2>

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
                        Ref. No
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Mobile
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Item Name
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filteredOrders?.length > 0 ? (
                      filteredOrders.map((order) => (
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
                            {order.itemName}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {order.price}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {order.quantity}
                          </td>
                          <td className="px-6 py-4 text-sm text-indigo-600 font-medium">
                            {order.status}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={7} // Update to match the total number of columns in your table
                          className="px-4 py-2 text-sm text-center text-gray-500"
                        >
                          No orders found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <h2 className="text-3xl font-semibold mb-6">Invoices</h2>
            <div className="rounded-xl shadow-lg border border-gray-200 mb-8">
              <input
                type="text"
                value={searchTermForinvoice}
                onChange={(e) => setSearchTermForinvoice(e.target.value)}
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
                    {filteredInvoices?.length > 0 ? (
                      filteredInvoices.map((invoice) => (
                        <tr
                          key={invoice.uuid}
                          className="hover:bg-sky-50 transition-colors duration-200"
                        >
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {invoice.refNo}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {invoice.customerName}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {invoice.mobile}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {invoice.address}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {invoice.itemName}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {invoice.grossWeight}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {invoice.tareWeight}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {invoice.netWeight}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {invoice.weighingLoss}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {invoice.container}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {invoice.weightDeduction}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {invoice.cleanWeight}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {invoice.price}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {invoice.totalAmount}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {invoice.laborCharges}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {invoice.netAmount}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {invoice.deduction}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {invoice.airLoss}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {invoice.netDeduction}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {invoice.oilContentReport}
                          </td>
                          <td className="px-6 py-4 w-fit flex">
                            <button
                              onClick={() =>
                                handleDownload(invoice.uuid, invoice.refNo)
                              }
                              className="text-sky-600 hover:text-sky-800 font-medium cursor-pointer transition-colors"
                            >
                              Download
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={20} // Update to match the total number of columns in your table
                          className="px-4 py-2 text-sm text-center text-gray-500"
                        >
                          No invoice found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CustomerDetails;
