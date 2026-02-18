import { useEffect, useState } from "react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(saved.reverse());
  }, []);

  const updateOrders = (updated) => {
    setOrders(updated);
    localStorage.setItem("orders", JSON.stringify(updated));
  };

  const cancelOrder = (id) => {
    const updated = orders.map((o) =>
      o.id === id ? { ...o, status: "Cancelled" } : o,
    );
    updateOrders(updated);
  };

  const getEstimatedDelivery = (createdAt) => {
    const date = new Date(createdAt);
    date.setDate(date.getDate() + 5);
    return date.toDateString();
  };

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
      default:
        return 10;
    }
  };

  if (!orders.length) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <h2>No Orders Found 🛍</h2>
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

            <span className="bg-green-100 text-green-600 px-4 py-1 rounded-full">
              {order.status}
            </span>
          </div>

          {/* Items */}
          <div className="mt-4 space-y-4">
            {order.items.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 border p-3 rounded-lg"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p>Qty: {item.quantity}</p>
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
          <div className="mt-4 flex justify-end gap-3">
            {order.status !== "Delivered" && order.status !== "Cancelled" && (
              <button
                onClick={() => cancelOrder(order.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            )}

            <button
              onClick={() => setOpenId(openId === order.id ? null : order.id)}
              className="bg-black text-white px-4 py-2 rounded-lg"
            >
              Track Order
            </button>

            <button
              onClick={() => window.open(`/invoice/${order.id}`, "_blank")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Invoice
            </button>
          </div>

          {/* Tracking Section */}
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
