import { useAuth } from "../contexts/AuthContext";

const Admin = () => {
  const { user } = useAuth();

  if (user.role !== "admin") {
    return <p className="p-6">Access denied</p>;
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-bold">Admin Panel</h1>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-white p-6 rounded shadow">Manage Orders</div>
        <div className="bg-white p-6 rounded shadow">Manage Users</div>
      </div>
      {orders.map((order) => (
        <div key={order.id} className="bg-white p-6 rounded shadow mb-4">
          <p className="font-semibold">Order #{order.id}</p>
          <p>Total: ₹{order.total}</p>

          <div className="mt-3 text-sm text-gray-600">
            <p>
              <b>Deliver To:</b>
            </p>
            <p>{order.address.name}</p>
            <p>
              {order.address.city}, {order.address.pincode}
            </p>
            <p>{order.address.phone}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Admin;
