import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";

import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/layout/ProtectedRoute";

import Home from "./pages/Home";
import Men from "./pages/men/Men";
import ProductDetail from "./pages/men/ProductDetail";
import Women from "./pages/women/Women";
import WomenProductDetail from "./pages/women/WomenProductDetail";

import Cart from "./pages/cart/Cart";
import Payment from "./pages/Payment";
import OrderSuccess from "./pages/OrderSuccess";
import Invoice from "./pages/Invoice";

import Login from "./pages/Login";
import Signup from "./security/Signuo";
import Dashboard from "./security/Dashboard";
import Account from "./security/Account";
import AdminOrders from "./contexts/AdminOrders";

import CartSidebar from "./components/cart/CartSidebar";
import Notification from "./components/ui/Notification";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Admin from "./pages/Admin";
import Checkout from "./pages/Checkout";
import OrderDetail from "./security/OrderDetail";
import Orders from "./utils/orders";
import Support from "./security/Support";
import VerifyEmail from "./pages/VerifyEmail";
import AddAddress from "./components/AddAddressModel";

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* 🌐 Public Layout */}
          <Route path="/" element={<Layout />}>
            {/* Public routes */}
            <Route index element={<Home />} />
            <Route path="men" element={<Men />} />
            <Route path="men/:id" element={<ProductDetail />} />
            <Route path="women" element={<Women />} />
            <Route path="women/:id" element={<WomenProductDetail />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset/:token" element={<ResetPassword />} />
            <Route path="invoice/:id" element={<Invoice />} />
            <Route path="support" element={<Support />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="add-address" element={<AddAddress />} />

            {/* 🔐 User Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="cart" element={<Cart />} />
              <Route path="payment" element={<Payment />} />
              <Route path="order-success" element={<OrderSuccess />} />

              <Route path="account" element={<Account />} />
              <Route path="orders" element={<Orders />} />
              <Route path="orders/:id" element={<OrderDetail />} />
              <Route path="checkout" element={<Checkout />} />
            </Route>

            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />

            {/* 👑 Admin Protected Routes */}
            <Route element={<ProtectedRoute role="admin" />}>
              <Route path="admin/orders" element={<AdminOrders />} />
              <Route path="dashboard" element={<Dashboard />} />
            </Route>
          </Route>
        </Routes>

        {/* Global UI */}
        <CartSidebar />
        <Notification />
      </Router>
    </CartProvider>
  );
}

export default App;
