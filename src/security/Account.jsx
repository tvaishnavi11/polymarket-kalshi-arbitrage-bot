import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useAddress } from "../contexts/AddressContext";
import { useCart } from "../contexts/CartContext";

const Account = () => {
  const { user, logout } = useAuth();
  const { addresses } = useAddress();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold">My Account</h1>
          <button
            onClick={logout}
            className="border border-gray-300 px-6 py-2 rounded-md hover:bg-gray-200 transition"
          >
            Logout
          </button>
        </div>

        {/* PROFILE CARD */}
        <div className="bg-white shadow-md rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gray-800 text-white flex items-center justify-center text-3xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-gray-500">{user.email}</p>
            <p className="text-gray-400 text-sm mt-1">
              Member since {new Date().getFullYear()}
            </p>
          </div>
        </div>

        {/* DASHBOARD SECTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* ORDERS */}
          <div
            onClick={() => navigate("/orders")}
            className="bg-white rounded-xl shadow p-6 cursor-pointer hover:shadow-lg transition flex flex-col justify-between"
          >
            <div>
              <h3 className="text-lg font-semibold mb-2">My Orders</h3>
              <p className="text-gray-500 text-sm">
                Track, return, or buy things again
              </p>
            </div>
            {cartItems.length > 0 && (
              <span className="mt-2 text-xs text-green-600">
                {cartItems.length} item{cartItems.length > 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* ADDRESSES */}
          <div
            onClick={() => navigate("/checkout")}
            className={`bg-white rounded-xl shadow p-6 cursor-pointer hover:shadow-lg transition flex flex-col justify-between ${
              addresses.length === 0 ? "opacity-70" : ""
            }`}
          >
            <div>
              <h3 className="text-lg font-semibold mb-2">Saved Addresses</h3>
              <p className="text-gray-500 text-sm">
                {addresses.length === 0
                  ? "No saved addresses"
                  : `You have ${addresses.length} saved`}
              </p>
            </div>
          </div>

          {/* PAYMENTS */}
          <div className="bg-white rounded-xl shadow p-6 opacity-70 cursor-not-allowed">
            <h3 className="text-lg font-semibold mb-2">Payment Methods</h3>
            <p className="text-gray-500 text-sm">
              Manage cards & UPI (coming soon)
            </p>
          </div>

          {/* SUPPORT */}
          <div
            onClick={() => navigate("/support")}
            className="bg-white rounded-xl shadow p-6 cursor-pointer hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold mb-2">Help & Support</h3>
            <p className="text-gray-500 text-sm">
              Get help with orders & account
            </p>
          </div>
        </div>

        {/* ACCOUNT DETAILS TABLE */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4">Account Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Name:</span> {user.name}
            </div>
            <div>
              <span className="font-medium">Email:</span> {user.email}
            </div>
            <div>
              <span className="font-medium">Member Since:</span>{" "}
              {new Date().getFullYear()}
            </div>
            <div>
              <span className="font-medium">Saved Addresses:</span>{" "}
              {addresses.length || "None"}
            </div>
            <div>
              <span className="font-medium">Cart Items:</span>{" "}
              {cartItems.length || 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
