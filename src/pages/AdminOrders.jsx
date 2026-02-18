import { useEffect, useState } from "react";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(saved);
  }, []);

  const updateStatus = (id, newStatus) => {
    const updated = orders.map((o) =>
      o.id === id ? { ...o, status: newStatus } : o,
    );
    setOrders(updated);
    localStorage.setItem("orders", JSON.stringify(updated));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Orders</h1>

      {orders.map((order) => (
        <div key={order.id} className="border p-4 mb-4 rounded-lg">
          <p className="font-semibold">{order.id}</p>

          <select
            value={order.status}
            onChange={(e) => updateStatus(order.id, e.target.value)}
            className="border px-3 py-1 rounded mt-2"
          >
            <option>Placed</option>
            <option>Shipped</option>
            <option>Out for Delivery</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>
        </div>
      ))}
    </div>
  );
}
