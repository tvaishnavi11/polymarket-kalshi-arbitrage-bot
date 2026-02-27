import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Mail } from "lucide-react";
import Confetti from "react-confetti";
import axios from "axios";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  const [order, setOrder] = useState(null);
  const [showConfetti] = useState(true);
  const [emailStatus, setEmailStatus] = useState("idle");

  // ✅ Prevent duplicate email sending
  const emailSentRef = useRef(false);

  useEffect(() => {
    let orderData = location.state;

    // ✅ Fallback to localStorage
    if (!orderData) {
      const stored = localStorage.getItem("latestOrder");
      orderData = stored ? JSON.parse(stored) : null;
    }

    if (!orderData) {
      console.error("❌ No order data found");
      return;
    }

    console.log("✅ Loaded Order Data:", orderData);

    setOrder(orderData);

    // ✅ Prevent multiple API calls
    if (!emailSentRef.current) {
      sendEmail(orderData);
      emailSentRef.current = true;
    }
  }, []);

  const sendEmail = async (orderData) => {
    try {
      // ✅ Safe field extraction with fallback
      const orderId = orderData.orderId || orderData.id || orderData._id;

      const userEmail =
        orderData.userEmail || orderData.email || orderData.customerEmail;

      const userName = orderData.userName || orderData.name || "Customer";

      const items = Array.isArray(orderData.items) ? orderData.items : [];

      const total = orderData.totalAmount || orderData.total || 0;

      console.log("📤 Sending Email Data:", {
        orderId,
        userEmail,
        userName,
        items,
        total,
      });

      // ✅ Only required validation
      if (!orderId || !userEmail) {
        console.error("❌ Missing required fields:", {
          orderId,
          userEmail,
        });
        setEmailStatus("failed");
        return;
      }

      setEmailStatus("sending");

      const response = await axios.post(
        "http://localhost:5000/api/order/send-confirmation",
        {
          orderId,
          userEmail,
          userName,
          items,
          total,
        },
      );

      console.log("✅ Email Success:", response.data);

      setEmailStatus("sent");
    } catch (error) {
      console.error("❌ Email Error:", error.response?.data || error.message);
      setEmailStatus("failed");
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>No order found.</p>
      </div>
    );
  }

  const totalItems =
    order.items?.reduce((acc, item) => acc + (item.quantity || 0), 0) || 0;

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 relative">
      {showConfetti && <Confetti />}

      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl p-6 md:p-10">
        <div className="text-center">
          <CheckCircle size={70} className="text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl md:text-3xl font-bold">
            Thank You For Your Order!
          </h1>
          <p className="text-gray-500 mt-2">
            Your order has been placed successfully.
          </p>
        </div>

        {/* ✅ Email Status Section */}
        <div className="flex items-center gap-3 bg-green-50 p-4 rounded-xl mt-6">
          <Mail className="text-green-600" />
          <span className="text-sm text-green-700">
            {emailStatus === "idle" && "Preparing email..."}
            {emailStatus === "sending" && "Sending confirmation email..."}
            {emailStatus === "sent" && "Order confirmation email sent 📧"}
            {emailStatus === "failed" && "Email failed ❌"}
          </span>
        </div>

        <div className="mt-6 border-t pt-6">
          <div className="flex justify-between mb-2">
            <span>Order ID</span>
            <span className="font-semibold">
              {order.orderId || order.id || order._id}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Estimated Delivery</span>
            <span className="font-semibold">{deliveryDate.toDateString()}</span>
          </div>
        </div>

        <div className="mt-10 bg-gray-50 p-6 rounded-xl">
          <h3 className="font-semibold mb-4">Ordered Items ({totalItems})</h3>

          {order.items?.length > 0 ? (
            order.items.map((item, index) => (
              <div key={index} className="flex justify-between mb-4">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <span className="font-semibold">
                  ₹ {item.price * item.quantity}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">
              No items found in this order.
            </p>
          )}

          <div className="border-t pt-4">
            <div className="flex justify-between font-bold text-lg">
              <span>Grand Total</span>
              <span>₹ {order.totalAmount || order.total || 0}</span>
            </div>
          </div>
        </div>

        <div className="mt-10 flex gap-4">
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
