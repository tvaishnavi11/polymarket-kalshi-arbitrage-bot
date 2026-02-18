import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // If email is not verified, redirect to verify page
        if (data.message === "Please verify your email first") {
          navigate("/verify-email");
        } else {
          alert(data.message || "Login failed");
        }
        return;
      }

      // Login successful → save user + token
      login(data.user, data.token);

      alert("Login successful 🎉");
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      alert("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left Section */}
      <div className="hidden md:flex flex-col justify-center items-center bg-black text-white p-10">
        <h1 className="text-4xl font-bold mb-4">ShopEase</h1>
        <p className="text-lg text-gray-300 max-w-sm text-center">
          Login to access your cart, orders, and exclusive deals.
        </p>
      </div>

      {/* Right Section */}
      <div className="flex items-center justify-center p-6">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg space-y-6"
        >
          <div className="text-center">
            <h2 className="text-3xl font-semibold">Welcome Back 👋</h2>
            <p className="text-gray-500 text-sm mt-1">
              Please login to your account
            </p>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              name="email"
              type="email"
              required
              onChange={handleChange}
              className="w-full mt-1 border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-600">Password</label>
            <input
              name="password"
              type="password"
              required
              onChange={handleChange}
              className="w-full mt-1 border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Forgot password */}
          <div className="text-right">
            <span
              onClick={() => navigate("/forgot-password")}
              className="text-blue-600 cursor-pointer font-medium hover:underline"
            >
              Forgot password?
            </span>
          </div>

          {/* Login Button */}
          <button
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-md font-medium hover:bg-gray-800 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Signup */}
          <p className="text-sm text-center text-gray-600">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-blue-600 cursor-pointer font-medium hover:underline"
            >
              Sign up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
