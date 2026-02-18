import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  const trackingSteps = [
    "Order Placed",
    "Shipped",
    "Out for Delivery",
    "Delivered",
  ];

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const found = orders.find((o) => o.id === Number(id));

    if (!found) {
      navigate("/orders");
      return;
    }

    setOrder(found);

    // Set step based on status
    const stepIndex = trackingSteps.indexOf(found.status);
    setCurrentStep(stepIndex >= 0 ? stepIndex : 0);
  }, [id]);

  // Auto move tracking (demo purpose)
  useEffect(() => {
    if (!order) return;

    if (order.status === "Delivered" || order.status === "Cancelled") return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < 3) {
          updateStatus(trackingSteps[prev + 1]);
          return prev + 1;
        }
        return prev;
      });
    }, 5000); // every 5 sec

    return () => clearInterval(interval);
  }, [order]);

  const updateStatus = (newStatus) => {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    const updated = orders.map((o) =>
      o.id === Number(id) ? { ...o, status: newStatus } : o,
    );

    localStorage.setItem("orders", JSON.stringify(updated));

    setOrder({ ...order, status: newStatus });
  };

  if (!order) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Order #{order.id}</h2>

        {/* TRACKING SECTION */}
        <div className="relative">
          {trackingSteps.map((step, index) => (
            <div key={index} className="flex items-center mb-6">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${
                  index <= currentStep ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                ✓
              </div>

              <div className="ml-4">
                <p
                  className={`font-medium ${
                    index <= currentStep ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  {step}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CANCEL BUTTON */}
        {order.status !== "Delivered" && order.status !== "Cancelled" && (
          <button
            onClick={() => updateStatus("Cancelled")}
            className="mt-6 w-full bg-red-500 text-white py-3 rounded-xl"
          >
            Cancel Order
          </button>
        )}

        {order.status === "Cancelled" && (
          <p className="text-red-600 font-semibold mt-6">Order Cancelled ❌</p>
        )}
      </div>
    </div>
  );
}
export default OrderDetail;
