import { useCart } from "../../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../ui/ConfirmationModal";

const CartSidebar = () => {
  const {
    cartItems,
    isCartOpen,
    closeCart,
    confirmDeleteItem,
    updateQuantity,
    getTotalPrice,
    showDeleteModal,
    handleDeleteConfirm,
    handleDeleteCancel,
    showNotification,
  } = useCart();

  const navigate = useNavigate();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={closeCart} />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 z-50 h-full w-96 bg-white shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-6">
            <h2 className="text-xl font-semibold">SHOP CART</h2>
            <button onClick={closeCart}>✕</button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {cartItems.length === 0 ? (
              <p className="text-center text-gray-500">Your cart is empty</p>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={`${item.id}-${item.size}`}
                    className="flex items-center gap-4 rounded bg-gray-50 p-4"
                  >
                    {/* Image */}
                    <div className="h-20 w-16 overflow-hidden rounded bg-gray-200">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">Size: {item.size}</p>
                      <p className="font-semibold">${item.price}</p>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.size,
                            Math.max(1, item.quantity - 1),
                          )
                        }
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.size, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => confirmDeleteItem(item.id, item.size)}
                      className="text-red-500"
                    >
                      🗑
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t p-6">
              <div className="mb-4 flex justify-between font-semibold">
                <span>Total</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>

              <button
                className="w-full rounded bg-black py-3 text-white"
                onClick={() => {
                  showNotification("Payment disabled (demo project)", "info");
                  navigate("/cart");
                  closeCart();
                }}
              >
                Checkout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        message="Do you want to delete this product?"
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
};

export default CartSidebar;
