import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `https://poject-fullstack.onrender.com/api/auth/reset/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message);
        return;
      }

      setMessage("Password reset successful!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMessage("Server error");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Reset Password</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Reset Password</button>
      </form>

      <p>{message}</p>
    </div>
  );
}
