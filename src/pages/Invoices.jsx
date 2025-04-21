import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import { getInvoices } from "../redux/invoiceSlice";
import API from "../services/api";
import { toast } from "react-toastify";

const Invoices = () => {
  const dispatch = useDispatch();
  const { invoices } = useSelector((state) => state?.invoice);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(getInvoices());
  }, [dispatch]);

  const handleDownload = async (uuid, refNo) => {
    try {
      const response = await API.get(`/invoice/download-invoice/${uuid}`, {
        responseType: 'blob', // CRUCIAL: tells Axios to handle binary response
      });
  
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
  
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice_${refNo}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Invoice downloaded successfully!");
    } catch (error) {
      console.error("Error downloading invoice:", error);
      toast.error("Failed to download invoice.");
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.refNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="px-6 py-4">
        <h2 className="text-3xl font-semibold mb-6">Invoices</h2>

        {/* Search Input */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by ref No, customer, or email..."
            className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        {/* Completed Purchase Orders Table */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-xl font-medium mb-4 text-indigo-600">
            Completed Purchase Orders
          </h3>

          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left text-sm text-gray-700 font-semibold">
                {[
                  "Ref No",
                  "Customer",
                  "Email",
                  "Item",
                  "Quantity",
                  "Price",
                  "Total",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-4 py-2"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <tr
                    key={invoice.uuid}
                    className="border-b hover:bg-indigo-50 transition"
                  >
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {invoice.refNo}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {invoice.customerName}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {invoice.email}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {invoice.itemName}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {invoice.quantity}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      ₹{invoice.price}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      ₹{invoice.price * invoice.quantity}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700 cursor-pointer">
                      <button
                        onClick={() => handleDownload(invoice.uuid, invoice.refNo)}
                        className="text-blue-600 hover:text-blue-800 font-medium transition cursor-pointer"
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-2 text-sm text-center text-gray-500"
                  >
                    No completed purchase orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Invoices;
