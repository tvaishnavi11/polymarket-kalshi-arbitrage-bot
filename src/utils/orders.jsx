import { useEffect, useState } from "react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [openId, setOpenId] = useState(null);

  // ✅ Load orders on mount
  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(savedOrders.reverse());
  }, []);

  // ✅ Update orders helper
  const updateOrders = (updatedOrders) => {
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  };

  // ✅ Cancel Order (only change status)
  const cancelOrder = (id) => {
    const updated = orders.map((order) =>
      order.id === id ? { ...order, status: "Cancelled" } : order,
    );

    updateOrders(updated);
  };

  // ✅ Delete Order Permanently
  const deleteOrder = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete this order?",
    );

    if (!confirmDelete) return;

    const updated = orders.filter((order) => order.id !== id);
    updateOrders(updated);
  };

  // ✅ Estimated Delivery (5 days)
  const getEstimatedDelivery = (createdAt) => {
    const date = new Date(createdAt);
    date.setDate(date.getDate() + 5);
    return date.toDateString();
  };

  // ✅ Progress Percentage
  const getProgress = (status) => {
    switch (status) {
      case "Placed":
        return 25;
      case "Shipped":
        return 50;
      case "Out for Delivery":
        return 75;
      case "Delivered":
        return 100;
      case "Cancelled":
        return 0;
      default:
        return 10;
    }
  };

  // ✅ If no orders
  if (!orders.length) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <h2 className="text-xl font-semibold">No Orders Found 🛍</h2>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {orders.map((order) => (
        <div key={order.id} className="bg-white shadow-lg p-6 rounded-2xl mb-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">Order ID: {order.id}</p>
              <p className="text-sm text-gray-500">
                {new Date(order.createdAt).toDateString()}
              </p>
              <p className="text-sm text-gray-500">
                Estimated Delivery: {getEstimatedDelivery(order.createdAt)}
              </p>
            </div>

            <span
              className={`px-4 py-1 rounded-full text-sm font-medium ${
                order.status === "Cancelled"
                  ? "bg-red-100 text-red-600"
                  : order.status === "Delivered"
                    ? "bg-green-100 text-green-600"
                    : "bg-yellow-100 text-yellow-600"
              }`}
            >
              {order.status}
            </span>
          </div>

          {/* Items */}
          <div className="mt-4 space-y-4">
            {order.items?.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 border p-3 rounded-lg"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold">₹ {item.price * item.quantity}</p>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="flex justify-between mt-4 border-t pt-4">
            <span className="font-semibold">Total</span>
            <span className="font-bold text-lg">₹ {order.total}</span>
          </div>

          {/* Buttons */}
          <div className="mt-4 flex justify-end gap-3 flex-wrap">
            {/* Cancel */}
            {order.status !== "Delivered" && order.status !== "Cancelled" && (
              <button
                onClick={() => cancelOrder(order.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Cancel
              </button>
            )}

            {/* Track */}
            <button
              onClick={() => setOpenId(openId === order.id ? null : order.id)}
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
            >
              Track Order
            </button>

            {/* Invoice */}
            <button
              onClick={() => window.open(`/invoice/${order.id}`, "_blank")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Invoice
            </button>

            {/* Delete */}
            <button
              onClick={() => deleteOrder(order.id)}
              className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
            >
              Delete
            </button>
          </div>

          {/* Tracking Bar */}
          {openId === order.id && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 h-3 rounded-full">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all duration-700"
                  style={{ width: `${getProgress(order.status)}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
