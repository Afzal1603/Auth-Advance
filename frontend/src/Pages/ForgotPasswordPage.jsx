import { motion } from "framer-motion";
import { Mail, Loader } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../Components/Input"; // Assuming you have an Input component
import { useAuthStore } from "../store/authStore";

const ForgotPasswordPage = () => {
  const { isLoading, error, forgotPassword } = useAuthStore();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false); // Track if form is submitted

  const handleSubmit = async (e) => {
    e.preventDefault();
    await forgotPassword(email);
    setIsSubmitted(true);
  };

  return (
    <div className="flex w-2/4 h-screen items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="p-8">
          <h2 className="text-3xl mb-6 font-bold text-center  bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
            Forgot Password
          </h2>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit}>
              <Input
                icon={Mail}
                type="email"
                placeholder="Email Address"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {error && <p className="text-red-500 mb-2">{error}</p>}

              <motion.button
                className="mt-2 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg
                hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                focus:ring-offset-gray-900 transition duration-200 text-center"
                type="submit"
                disabled={isLoading || isSubmitted} // Disable if already submitted or loading
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader className="text-center animate-spin"></Loader>
                  </div>
                ) : (
                  "Send Reset Email"
                )}
              </motion.button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.2 }}
              className="flex flex-col items-center text-center"
            >
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="flex justify-center items-center w-16 h-16 bg-green-500 rounded-full mb-6"
              >
                <Mail className="text-white font-bold w-96 h-8"></Mail>
              </motion.div>
              <p className="text-lg text-gray-300 font-normal mb-2">
                The password reset link has been sent to your email address.
              </p>
            </motion.div>
          )}

          {/* Link to login */}
          <div className=" mt-5 text-base bg-opacity-50 flex items-center justify-center">
            <p className="text-gray-400">
              Remembered your password?{" "}
              <Link className="text-green-600 font-medium" to="/login">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
