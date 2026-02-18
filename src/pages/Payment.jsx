import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { createOrder } from "../utils/orderService";

const Payment = () => {
  const { cartItems, getTotalPrice, clearCart, showNotification } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("card");

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/cart");
    }
  }, [cartItems, navigate]);

  const handlePayment = (e) => {
    e.preventDefault();

    const newOrder = {
      orderId: Date.now(),
      userId: user.id,
      items: cartItems,
      totalAmount: getTotalPrice(),
      paymentMethod,
      status: "Placed",
      createdAt: new Date().toISOString(),
    };

    createOrder(newOrder);
    clearCart();

    showNotification(
      `Payment successful via ${paymentMethod.toUpperCase()} (Demo)`,
      "success",
    );

    navigate("/order-success");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl grid md:grid-cols-2 overflow-hidden">
        {/* LEFT SIDE */}
        <div className="p-8 bg-gray-100">
          <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

          {cartItems.map((item) => (
            <div
              key={`${item.id}-${item.size}`}
              className="flex items-center gap-4 mb-4"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">
                  Size: {item.size} × {item.quantity}
                </p>
              </div>
              <p className="font-semibold">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}

          <div className="border-t pt-4 mt-6 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${getTotalPrice().toFixed(2)}</span>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="p-8 bg-white">
          <h2 className="text-2xl font-bold mb-6">Payment Method</h2>

          <div className="flex gap-3 mb-6">
            {["card", "upi", "cod"].map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => setPaymentMethod(method)}
                className={`flex-1 py-2 border rounded-md font-medium ${
                  paymentMethod === method
                    ? "bg-black text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                {method === "card" && "💳 Card"}
                {method === "upi" && "📱 UPI"}
                {method === "cod" && "💵 COD"}
              </button>
            ))}
          </div>

          <form onSubmit={handlePayment} className="space-y-4">
            {paymentMethod === "card" && (
              <>
                <input
                  type="text"
                  placeholder="Card Holder Name"
                  required
                  className="w-full border p-3 rounded"
                />
                <input
                  type="text"
                  placeholder="Card Number"
                  maxLength={16}
                  required
                  className="w-full border p-3 rounded"
                />
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    required
                    className="w-1/2 border p-3 rounded"
                  />
                  <input
                    type="password"
                    placeholder="CVV"
                    maxLength={3}
                    required
                    className="w-1/2 border p-3 rounded"
                  />
                </div>
              </>
            )}

            {paymentMethod === "upi" && (
              <input
                type="text"
                placeholder="UPI ID (example@upi)"
                required
                className="w-full border p-3 rounded"
              />
            )}

            {paymentMethod === "cod" && (
              <p className="text-gray-600 text-sm">
                Pay with cash when your order is delivered.
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition"
            >
              Pay ${getTotalPrice().toFixed(2)}
            </button>
          </form>

          <p className="text-xs text-gray-400 mt-4">
            * This is a demo payment page. No real transaction will occur.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Payment;
