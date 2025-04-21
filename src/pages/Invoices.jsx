import { useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import { getInvoices } from "../redux/invoiceSlice";
import API from "../services/api";

const Invoices = () => {
  const dispatch = useDispatch();
  const { invoices } = useSelector((state) => state?.invoice);

  useEffect(() => {
    dispatch(getInvoices());
  }, [dispatch]);

  const handleDownload = async (uuid,refNo) => {
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
    } catch (error) {
      console.error("Error downloading invoice:", error);
      alert("Failed to download invoice");
    }
  };
  
  
  
  
  

  return (
    <DashboardLayout>
      <div className="px-6 py-4">
        <h2 className="text-3xl font-semibold mb-6">Invoices</h2>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-xl font-medium mb-4">
            Completed Purchase Orders
          </h3>

          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                {[
                  "ref No",
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
                    className="px-4 py-2 text-sm font-medium text-gray-700"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {invoices.length > 0 ? (
                invoices.map((order, index) => (
                  <tr key={order.uuid} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {order.refNo}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {order.customerName}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {order.email}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {order.itemName}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {order.quantity}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      ₹{order.price}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      ₹{order.price * order.quantity}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      <button
                        onClick={() => handleDownload(order.uuid,order.refNo)}
                        className="text-blue-600 hover:text-blue-800"
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
