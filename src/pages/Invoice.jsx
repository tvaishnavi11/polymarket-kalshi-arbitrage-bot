import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function Invoice() {
  const { id } = useParams();
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const order = orders.find((o) => o.id.toString() === id);

  if (!order)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-xl font-semibold">Invoice Not Found</h2>
      </div>
    );

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Invoice", 14, 22);

    doc.setFontSize(12);
    doc.text(`Order ID: ${order.id}`, 14, 32);
    doc.text(`Order Date: ${new Date(order.createdAt).toDateString()}`, 14, 40);

    doc.text(
      `Shipping Address: ${order.address.street}, ${order.address.city}, ${order.address.state}, ${order.address.zip}`,
      14,
      48,
    );

    const tableColumn = ["Item", "Qty", "Price", "Subtotal"];
    const tableRows = [];

    order.items.forEach((item) => {
      const row = [
        item.name,
        item.quantity,
        `₹ ${item.price}`,
        `₹ ${item.price * item.quantity}`,
      ];
      tableRows.push(row);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 60,
    });

    doc.text(`Total: ₹ ${order.total}`, 14, doc.lastAutoTable.finalY + 10);
    doc.save(`Invoice_${order.id}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Invoice</h1>

        {/* Order Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="font-medium text-gray-700">Order ID:</p>
            <p className="text-gray-900">{order.id}</p>
          </div>
          <div>
            <p className="font-medium text-gray-700">Order Date:</p>
            <p className="text-gray-900">
              {new Date(order.createdAt).toDateString()}
            </p>
          </div>
        </div>

        {/* Address */}
        <div className="mb-6">
          <p className="font-medium text-gray-700 mb-2">Shipping Address:</p>
          <p className="text-gray-900">
            {order.address.street}, {order.address.city}, {order.address.state},{" "}
            {order.address.zip}
          </p>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2 text-left">Item</th>
                <th className="border px-4 py-2">Qty</th>
                <th className="border px-4 py-2">Price</th>
                <th className="border px-4 py-2">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{item.name}</td>
                  <td className="border px-4 py-2 text-center">
                    {item.quantity}
                  </td>
                  <td className="border px-4 py-2 text-right">
                    ₹ {item.price}
                  </td>
                  <td className="border px-4 py-2 text-right">
                    ₹ {item.price * item.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total */}
        <div className="mt-4 flex justify-end text-lg font-bold">
          Total: ₹ {order.total}
        </div>

        {/* Buttons */}
        <div className="mt-6 flex gap-4 justify-center md:justify-end">
          <button
            onClick={downloadPDF}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Download PDF
          </button>
          <button
            onClick={() => window.print()}
            className="bg-black text-white px-6 py-2 rounded-lg hover:opacity-90 transition"
          >
            Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
