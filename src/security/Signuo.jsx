import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FaGoogle, FaFacebook } from "react-icons/fa";

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://poject-fullstack.onrender.com/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Signup failed");
        return;
      }

      // Save token and user
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Update Auth Context
      signup(data.user, data.token);

      alert("Signup Successful 🎉");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Server error. Make sure backend is running.");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left Section */}
      <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white p-10 relative overflow-hidden">
        <h1 className="text-5xl font-bold mb-6">ShopEase</h1>
        <p className="text-lg text-gray-300 max-w-sm text-center">
          Join ShopEase today and enjoy seamless shopping, faster checkout, and
          exclusive member-only offers.
        </p>
        <img
          src="https://images.unsplash.com/photo-1591020621233-baa072d3c1f8?auto=format&fit=crop&w=600&q=80"
          alt="Shopping illustration"
          className="absolute bottom-0 left-0 w-full h-2/3 object-cover opacity-20"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center justify-center p-6 bg-gray-50">
        <form
          onSubmit={handleSignup}
          className="w-full max-w-md bg-white p-10 rounded-2xl shadow-2xl space-y-6"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold">Create Your Account 🚀</h2>
            <p className="text-gray-500 mt-1">It only takes a minute</p>
          </div>

          <input
            name="name"
            placeholder="Full Name"
            required
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
          />

          <input
            name="email"
            type="email"
            placeholder="Email Address"
            required
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
          />

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition"
          >
            Sign Up
          </button>

          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <hr className="flex-1 border-t" />
            <span>or continue with</span>
            <hr className="flex-1 border-t" />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              className="flex-1 border border-gray-300 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-gray-100 transition"
            >
              <FaGoogle className="text-red-500" /> Google
            </button>

            <button
              type="button"
              className="flex-1 border border-gray-300 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-gray-100 transition"
            >
              <FaFacebook className="text-blue-600" /> Facebook
            </button>
          </div>

          <p className="text-sm text-center text-gray-500">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-600 cursor-pointer hover:underline font-medium"
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
