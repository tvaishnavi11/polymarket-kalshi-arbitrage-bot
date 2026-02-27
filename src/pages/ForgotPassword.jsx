import { useState } from "react";
import { Mail } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(
      "https://poject-fullstack.onrender.com/api/auth/forgot-password",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      },
    );

    const data = await res.json();
    setMsg(data.message);
    setLoading(false);
  };
  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded w-96">
        <h2 className="text-xl font-bold mb-4">Forgot Password</h2>

        <div className="relative mb-3">
          <Mail className="absolute top-3 left-3 text-gray-400" />
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 p-2 w-full border rounded"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white w-full p-2 rounded"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
        {msg && <p className="mt-3 text-green-600">{msg}</p>}
      </form>
    </div>
  );
}
