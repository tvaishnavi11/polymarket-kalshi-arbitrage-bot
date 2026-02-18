import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("fashion-shop-cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("fashion-shop-cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Show notification function
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "success" }),
      3000,
    );
  };

  const addToCart = (product, selectedSize, quantity = 1) => {
    const existingItem = cartItems.find(
      (item) => item.id === product.id && item.size === selectedSize,
    );

    if (existingItem) {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === product.id && item.size === selectedSize
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        ),
      );
    } else {
      const newItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size: selectedSize,
        quantity: quantity,
      };
      setCartItems((prev) => [...prev, newItem]);
    }

    // Show notification
    showNotification("Product Added To Cart Successfully");

    // Don't automatically open cart sidebar - user must click cart icon
  };

  const removeFromCart = (itemId, size) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.id === itemId && item.size === size)),
    );
  };

  const confirmDeleteItem = (itemId, size) => {
    setItemToDelete({ itemId, size });
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      removeFromCart(itemToDelete.itemId, itemToDelete.size);
      setItemToDelete(null);
      showNotification("Product deleted successfully");
    }
    setShowDeleteModal(false);
  };

  const handleDeleteCancel = () => {
    setItemToDelete(null);
    setShowDeleteModal(false);
  };

  const updateQuantity = (itemId, size, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId, size);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId && item.size === size
          ? { ...item, quantity: newQuantity }
          : item,
      ),
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const value = {
    cartItems,
    isCartOpen,
    notification,
    showDeleteModal,
    itemToDelete,
    addToCart,
    removeFromCart,
    confirmDeleteItem,
    handleDeleteConfirm,
    handleDeleteCancel,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    toggleCart,
    closeCart,
    showNotification,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
