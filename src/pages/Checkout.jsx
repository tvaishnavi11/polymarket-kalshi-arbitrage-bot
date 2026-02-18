import { useState } from "react";
import { useAddress } from "../contexts/AddressContext";
import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { addresses } = useAddress();
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  const [selected, setSelected] = useState(null);
  const [payment, setPayment] = useState("COD");

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

  const placeOrder = () => {
    if (!selected) {
      alert("Please select a delivery address!");
      return;
    }
    const order = {
      id: "ORD-" + Date.now(),
      address: selected,
      items: cartItems,
      subtotal,
      shipping,
      total,
      status: "Placed",
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem("latestOrder", JSON.stringify(order));
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    localStorage.setItem("orders", JSON.stringify([...orders, order]));
    clearCart();
    navigate("/order-success");
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
        {/* LEFT: Address + Payment */}
        <div className="bg-white p-6 rounded-2xl shadow space-y-4">
          <h1 className="text-2xl font-bold mb-4">Delivery Address</h1>
          {addresses.length === 0 && (
            <p className="text-gray-500">
              No address added yet.{" "}
              <span
                onClick={() => navigate("/add-address")}
                className="text-blue-600 cursor-pointer underline"
              >
                + Add Address
              </span>
            </p>
          )}
          {addresses.map((a) => (
            <div
              key={a.id}
              onClick={() => setSelected(a)}
              className={`border p-4 rounded-lg cursor-pointer transition ${
                selected?.id === a.id
                  ? "border-black bg-gray-50 shadow-lg"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              <p className="font-medium">
                {a.street}, {a.city}, {a.state} - {a.zip}
              </p>
              <p className="text-sm text-gray-500">Contact: {a.contact}</p>
              {selected?.id === a.id && (
                <span className="text-green-600 font-semibold">Selected</span>
              )}
            </div>
          ))}

          <button
            onClick={() => navigate("/add-address")}
            className="mt-3 text-blue-600 underline"
          >
            + Add Address
          </button>

          <h2 className="text-lg font-semibold mt-6">Payment Method</h2>
          {["COD", "UPI", "CARD"].map((p) => (
            <div
              key={p}
              onClick={() => setPayment(p)}
              className={`border p-3 rounded-lg mb-2 cursor-pointer ${
                payment === p
                  ? "border-black bg-gray-50"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              {p}
            </div>
          ))}

          <button
            onClick={placeOrder}
            className="w-full mt-4 py-3 bg-black text-white rounded-lg"
          >
            Place Order
          </button>
        </div>

        {/* RIGHT: Order Summary */}
        <div className="bg-white p-6 rounded-2xl shadow space-y-2">
          <h2 className="text-xl font-bold mb-2">Order Summary</h2>
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border-b py-2"
            >
              <span>
                {item.name} x {item.quantity}
              </span>
              <span>₹ {item.price * item.quantity}</span>
            </div>
          ))}
          <div className="mt-2 space-y-1">
            <div className="flex justify-between font-medium">
              <span>Subtotal</span>
              <span>₹ {subtotal}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : `₹ ${shipping}`}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total</span>
              <span>₹ {total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
