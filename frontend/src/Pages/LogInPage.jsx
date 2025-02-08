import { motion } from "framer-motion";
import Input from "../Components/Input";
import { Loader, Mail, Lock, EyeOff, Eye } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const LogInPage = () => {
  const { isLoading, login, error } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    await login(email, password);
    navigate("/");
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 max-w-md w-full bg-opacity-50 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Welcome Back
        </h2>
        <form onSubmit={handleLogin}>
          <Input
            icon={Mail}
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Input>
          <div className="flex">
            <div className="absolute right-10 flex items-center justify-center py-2 pl-3 cursor-pointer z-50">
              {show ? (
                <Eye
                  onClick={() => setShow(!show)}
                  className="text-green-500"
                />
              ) : (
                <EyeOff
                  onClick={() => setShow(!show)}
                  className="text-green-500"
                />
              )}
            </div>
            <Input
              icon={Lock}
              type={show ? "text" : "password"}
              placeholder="Password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Input>
          </div>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <div>
            <Link
              className="text-green-500 font-medium"
              to={"/forgot-password"}
            >
              Forgot Password?
            </Link>
          </div>
          <motion.button
            className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg
          shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
          focus:ring-offset-gray-900 transition duration-200"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="mx-auto animate-spin"></Loader>
            ) : (
              "Log In"
            )}
          </motion.button>
        </form>
      </div>
      <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex items-center justify-center">
        <p className="text-gray-500">
          Don't have an account?{" "}
          <Link className="text-green-600 font-medium" to="/signup">
            Sign up
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default LogInPage;
