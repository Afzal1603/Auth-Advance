import { motion } from "framer-motion";
import { Lock, Loader, Check } from "lucide-react";
import { useState } from "react";
import Input from "../Components/Input";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const ResetPasswordPage = () => {
  const { isLoading, error, resetPassword } = useAuthStore();
  const { token } = useParams(); // Retrieve reset token from the URL
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setIsSubmitted(false);
      return alert("Passwords do not match");
    }

    try {
      await resetPassword(token, newPassword);
      setIsSubmitted(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setIsSubmitted(false);
      alert("Error resetting password, please try again");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center ">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="p-8">
          <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
            Reset Your Password
          </h2>

          {isSubmitted ? (
            <div className="flex flex-col justify-center items-center">
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="w-16 h-16 bg-green-500 rounded-full flex justify-center items-center mb-3"
              >
                <Check className="text-white font-extrabold h-10 w-10"></Check>
              </motion.div>
              <p className="font-medium text-lg text-white text-center py-3 rounded-lg mb-4">
                Password reset successfully! Redirecting to login...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <Input
                icon={Lock}
                type="password"
                placeholder="New Password"
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <Input
                icon={Lock}
                type="password"
                placeholder="Confirm Password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              {error && <p className="text-red-500 mb-2">{error}</p>}

              <motion.button
                className="mt-2 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg
                hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                focus:ring-offset-gray-900 transition duration-200"
                type="submit"
                disabled={isLoading || isSubmitted}
              >
                {isLoading ? (
                  <div className="flex justify-center items-center">
                    <Loader className="animate-spin"></Loader>
                  </div>
                ) : (
                  "Reset Password"
                )}
              </motion.button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
