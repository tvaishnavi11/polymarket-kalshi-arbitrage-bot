import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Mail } from "lucide-react";
import Confetti from "react-confetti";

export default function OrderSuccess() {
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [progressStep, setProgressStep] = useState(0);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const savedOrder = JSON.parse(localStorage.getItem("latestOrder"));

    if (savedOrder) {
      setOrder(savedOrder);
    }

    const interval = setInterval(() => {
      setProgressStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 1200);

    setTimeout(() => setShowConfetti(false), 4000);

    return () => clearInterval(interval);
  }, []);

  if (!order || !order.items) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>No order found. Please place an order first.</p>
      </div>
    );
  }

  const totalItems = order.items.reduce((acc, item) => acc + item.quantity, 0);

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 relative">
      {showConfetti && <Confetti />}

      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl p-6 md:p-10">
        {/* HEADER */}
        <div className="text-center">
          <CheckCircle size={70} className="text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl md:text-3xl font-bold">
            Thank You For Your Order!
          </h1>
          <p className="text-gray-500 mt-2">
            Your order has been placed successfully.
          </p>
        </div>

        {/* EMAIL CONFIRM */}
        <div className="flex items-center gap-3 bg-green-50 p-4 rounded-xl mt-6">
          <Mail className="text-green-600" />
          <span className="text-sm text-green-700">
            Order confirmation email sent 📧
          </span>
        </div>

        {/* ORDER DETAILS */}
        <div className="mt-6 border-t pt-6">
          <div className="flex justify-between mb-2">
            <span>Order ID</span>
            <span className="font-semibold">{order.id}</span>
          </div>

          <div className="flex justify-between">
            <span>Estimated Delivery</span>
            <span className="font-semibold">{deliveryDate.toDateString()}</span>
          </div>
        </div>

        {/* ORDERED ITEMS */}
        <div className="mt-10 bg-gray-50 p-6 rounded-xl">
          <h3 className="font-semibold mb-4">Ordered Items</h3>

          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center mb-4"
            >
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
              <span className="font-semibold">
                ₹ {item.price * item.quantity}
              </span>
            </div>
          ))}

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Items ({totalItems})</span>
              <span>{totalItems} items</span>
            </div>

            <div className="flex justify-between font-bold text-lg">
              <span>Grand Total</span>
              <span>₹ {order.total}</span>
            </div>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="mt-10 flex flex-col md:flex-row gap-4">
          <button
            onClick={() => navigate("/orders")}
            className="flex-1 bg-black text-white py-3 rounded-xl"
          >
            Track Order
          </button>

          <button
            onClick={() => navigate("/")}
            className="flex-1 border border-black py-3 rounded-xl"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
