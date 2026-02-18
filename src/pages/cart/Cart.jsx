import { useCart } from "../../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../components/ui/ConfirmationModal";
import { useAuth } from "../../contexts/AuthContext";

export const Cart = () => {
  const {
    cartItems,
    updateQuantity,
    confirmDeleteItem,
    getTotalPrice,
    showDeleteModal,
    handleDeleteConfirm,
    handleDeleteCancel,
    showNotification,
  } = useCart();

  const navigate = useNavigate();

  // const handleCheckout = () => {
  //   showNotification(
  //     "Payment is disabled. This project is built for showcase purposes only.",
  //     "info",
  //   );
  //   navigate("/payment"); // ✅ go to payment page
  // };
  const { isAuth } = useAuth();

  const handleCheckout = () => {
    if (!isAuth) {
      navigate("/login");
      return;
    }
    navigate("/checkout");
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-light text-gray-900 mb-6">YOUR CART</h1>

          <svg
            className="w-24 h-24 text-gray-300 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>

          <p className="text-gray-500 mb-6">Your cart is empty</p>

          <button
            onClick={() => navigate("/men")}
            className="bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-gray-800"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-light text-gray-900 mb-8">YOUR CART</h1>

        {/* Cart Items */}
        <div className="space-y-6">
          {cartItems.map((item) => (
            <div
              key={`${item.id}-${item.size}`}
              className="flex items-center gap-6 p-6 bg-gray-50 rounded-lg"
            >
              {/* Product Image */}
              <div className="w-24 h-32 bg-gray-200 rounded-md overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-500">Size: {item.size}</p>
                <p className="text-lg font-semibold">${item.price}</p>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    updateQuantity(item.id, item.size, item.quantity - 1)
                  }
                  className="w-8 h-8 border rounded hover:bg-gray-100"
                >
                  −
                </button>

                <span className="text-lg">{item.quantity}</span>

                <button
                  onClick={() =>
                    updateQuantity(item.id, item.size, item.quantity + 1)
                  }
                  className="w-8 h-8 border rounded hover:bg-gray-100"
                >
                  +
                </button>
              </div>

              {/* Delete */}
              <button
                onClick={() => confirmDeleteItem(item.id, item.size)}
                className="text-gray-400 hover:text-red-500"
              >
                🗑
              </button>
            </div>
          ))}
        </div>

        {/* Checkout */}
        <div className="mt-12 border-t pt-8">
          <div className="flex justify-between mb-6">
            <span className="text-2xl font-semibold">Total</span>
            <span className="text-3xl font-bold">
              ${getTotalPrice().toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full bg-gray-900 text-white py-4 text-lg rounded-md hover:bg-gray-800"
          >
            Proceed to pay ${getTotalPrice().toFixed(2)}
          </button>
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        message="Do you wanna delete this product?"
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default Cart;
