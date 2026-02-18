import { useState } from "react";
import { useParams } from "react-router-dom";

export function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");

  const submit = async () => {
    await fetch("http://localhost:5000/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    alert("Password Updated");
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="w-96 p-6 border rounded">
        <h2 className="text-xl mb-3">Reset Password</h2>
        <input
          type="password"
          placeholder="New password"
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full mb-3"
        />
        <button onClick={submit} className="bg-black text-white p-2 w-full">
          Reset Password
        </button>
      </div>
    </div>
  );
}
export default ResetPassword;
