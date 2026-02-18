import { getOrders } from "../utils/orderService";

const AdminOrders = () => {
  const orders = getOrders();

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-6">All Orders (Admin)</h1>

      {orders.map((order) => (
        <div key={order.orderId} className="border p-4 mb-4">
          <p>Order ID: {order.orderId}</p>
          <p>User ID: {order.userId}</p>
          <p>Status: {order.status}</p>
          <p>Total: ${order.totalAmount}</p>
        </div>
      ))}
    </div>
  );
};

export default AdminOrders;
