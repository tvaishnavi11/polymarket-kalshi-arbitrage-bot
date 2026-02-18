import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md text-center space-y-4">
        <h2 className="text-2xl font-semibold">Verify Your Email 📩</h2>
        <p className="text-gray-600">
          We have sent a verification link to your email. Please check your
          inbox and verify your account.
        </p>

        <button
          onClick={() => window.open("https://mail.google.com", "_blank")}
          className="bg-black text-white px-6 py-2 rounded-md"
        >
          Open Gmail
        </button>

        <button
          onClick={() => navigate("/login")}
          className="block w-full mt-3 text-blue-600 hover:underline"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;
