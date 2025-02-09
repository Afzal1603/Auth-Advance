import { motion } from "framer-motion";
import { LogOut, User, Mail } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import axios from "axios";

const HomePage = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await axios.post(
        `${
          import.meta.env.MODE === "development"
            ? "http://localhost:5000"
            : "https://auth-advance-1.onrender.com"
        }/auth/logout`,
        {},
        { withCredentials: true } // ✅ Ensures cookies are included
      );

      logout(); // ✅ Reset state in Zustand
      window.location.href = "/login"; // ✅ Redirect after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center ">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 max-w-md w-full bg-opacity-50 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="p-8">
          <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
            Welcome to your dashboard
          </h2>

          <div className="space-y-4">
            <div className="flex items-center bg-gray-700 px-4 py-3 rounded-lg">
              <User className="text-green-500 mr-3" />
              <span className="text-white">
                {user?.name || "No Name Found"}
              </span>
            </div>

            <div className="flex items-center bg-gray-700 px-4 py-3 rounded-lg">
              <Mail className="text-green-500 mr-3" />
              <span className="text-white">
                {user?.email || "No Email Found"}
              </span>
            </div>
          </div>

          <motion.button
            className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg
            hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
            focus:ring-offset-gray-900 transition duration-200 flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
          >
            <LogOut className="mr-2" /> Log Out
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;
