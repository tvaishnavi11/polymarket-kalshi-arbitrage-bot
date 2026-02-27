import { useState } from "react";
import { useAddress } from "../contexts/AddressContext";
import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Checkout() {
  const { addresses, addAddress } = useAddress(); // addAddress to update context
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  const [selected, setSelected] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);

  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
    contact: "",
  });

  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

  // Load Razorpay script
  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      const existingScript = document.getElementById("razorpay-script");
      if (existingScript) return resolve(true);

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.id = "razorpay-script";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  // Place order function
  const placeOrder = (paymentStatus) => {
    const order = {
      id: "ORD-" + Date.now(),
      userEmail: storedUser.email,
      address: selected,
      items: cartItems,
      subtotal,
      shipping,
      total,
      paymentMethod,
      status: paymentStatus,
      createdAt: new Date().toISOString(),
    };

    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    localStorage.setItem("orders", JSON.stringify([...orders, order]));
    localStorage.setItem("latestOrder", JSON.stringify(order));

    clearCart();
    navigate("/order-success");
  };

  // Razorpay Payment
  const handleOnlinePayment = async () => {
    if (!selected) {
      alert("Please select delivery address!");
      return;
    }

    try {
      setLoading(true);
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) return alert("Razorpay SDK failed to load!");

      const { data } = await axios.post(
        "https://backend-j5ya.onrender.com/api/payment/create-order",
        { amount: total },
      );

      if (!data?.id) return alert("Order creation failed!");

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "Vaishnavi Store",
        description: "Order Payment",
        order_id: data.id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              "https://backend-j5ya.onrender.com/api/payment/verify",
              response,
            );
            if (verifyRes.data.success) placeOrder("Paid");
            else alert("Payment verification failed!");
          } catch {
            alert("Verification error!");
          }
        },
        prefill: {
          name: selected?.name || "",
          contact: selected?.contact || "",
          email: storedUser?.email || "",
        },
        theme: { color: "#111827" },
      };

      const razor = new window.Razorpay(options);
      razor.open();
      razor.on("payment.failed", (response) => {
        console.log(response.error);
        alert("Payment Failed ❌ Please try again.");
      });
    } catch (err) {
      console.log(err);
      alert("Server error! Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = () => {
    if (!selected) return alert("Please select delivery address!");
    paymentMethod === "COD" ? placeOrder("Placed") : handleOnlinePayment();
  };

  // ✅ Handle adding new address
  const handleAddNewAddress = () => {
    const id = "ADDR-" + Date.now();
    const addressObj = { ...newAddress, id };
    addAddress(addressObj); // update context
    setSelected(addressObj); // select new address
    setShowNewAddressForm(false);
    setNewAddress({ street: "", city: "", state: "", zip: "", contact: "" });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        {/* Left Side: Address & Payment */}
        <div className="md:col-span-2 space-y-6">
          {/* Delivery Address */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-bold mb-4">Delivery Address</h2>

            {addresses.map((a) => (
              <div
                key={a.id}
                onClick={() => setSelected(a)}
                className={`p-4 border rounded-xl cursor-pointer mb-3 transition ${
                  selected?.id === a.id
                    ? "border-black bg-gray-50"
                    : "border-gray-300 hover:border-black"
                }`}
              >
                <p className="font-medium">
                  {a.street}, {a.city}
                </p>
                <p className="text-sm text-gray-500">
                  {a.state} - {a.zip}
                </p>
                <p className="text-sm text-gray-500">Contact: {a.contact}</p>
              </div>
            ))}

            <button
              className="mt-2 py-2 px-4 bg-black text-white rounded-xl hover:bg-gray-800 transition"
              onClick={() => setShowNewAddressForm(!showNewAddressForm)}
            >
              + Add New Address
            </button>

            {showNewAddressForm && (
              <div className="mt-4 space-y-3">
                <input
                  type="text"
                  placeholder="Street"
                  value={newAddress.street}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, street: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="City"
                  value={newAddress.city}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, city: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={newAddress.state}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, state: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Zip Code"
                  value={newAddress.zip}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, zip: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Contact"
                  value={newAddress.contact}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, contact: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
                <button
                  onClick={handleAddNewAddress}
                  className="w-full py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
                >
                  Save Address
                </button>
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-bold mb-4">Payment Method</h2>
            {["COD", "ONLINE"].map((method) => (
              <div
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={`p-4 border rounded-xl cursor-pointer mb-3 transition ${
                  paymentMethod === method
                    ? "border-black bg-gray-50"
                    : "border-gray-300 hover:border-black"
                }`}
              >
                {method === "COD" ? "Cash on Delivery" : "UPI / CARD (Online)"}
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="bg-white p-6 rounded-2xl shadow h-fit">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>

          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between py-2 border-b">
              <span>
                {item.name} x {item.quantity}
              </span>
              <span>₹ {item.price * item.quantity}</span>
            </div>
          ))}

          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹ {subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : `₹ ${shipping}`}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-3">
              <span>Total</span>
              <span>₹ {total}</span>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full mt-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading ? "Processing..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
