import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import FloatingShapes from "./Components/FloatingShapes";
import SignUpPage from "./Pages/SignUpPage";
import LogInPage from "./Pages/LogInPage";
import EmailVerificationPage from "./Pages/EmailVerificationPage";
import HomePage from "./Pages/HomePage";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import ForgotPasswordPage from "./Pages/ForgotPasswordPage";
import ResetPasswordPage from "./Pages/ResetPasswordPage";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return (
      <div className="flex h-screen items-center justify-center text-white">
        Checking authentication...
      </div>
    );
  }

  // Redirect if the user is not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  console.log("User Data:", user.name);

  // Ensure `user` is fully loaded before checking `isVerified`
  if (user && Object.keys(user).length > 0 && user.isVerified === false) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user, isCheckingAuth } = useAuthStore();

  console.log("Auth State:", { isAuthenticated, user, isCheckingAuth });

  // Show a loading state if authentication is still being checked
  if (isCheckingAuth) {
    return (
      <div className="flex h-screen items-center justify-center text-white">
        Checking authentication...
      </div>
    );
  }

  // If authenticated and user is verified, redirect to home page
  if (isAuthenticated && user && user.isVerified) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const { isCheckingAuth, checkAuth, isAuthenticated } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log("isAuthenticated:", isAuthenticated);

  // Show a loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="flex h-screen items-center justify-center text-white">
        Checking authentication...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br 
      from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden"
    >
      {/* Floating Shapes */}
      <FloatingShapes
        color="bg-green-500"
        size="w-64 h-64"
        top="-5%"
        left="10%"
        delay={0}
      />
      <FloatingShapes
        color="bg-emerald-500"
        size="w-48 h-48"
        top="70%"
        left="80%"
        delay={5}
      />
      <FloatingShapes
        color="bg-lime-500"
        size="w-32 h-32"
        top="40%"
        left="-10%"
        delay={2}
      />

      {/* Routes */}
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <RedirectAuthenticatedUser>
              <SignUpPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/login"
          element={
            <RedirectAuthenticatedUser>
              <LogInPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route
          path="/forgot-password"
          element={
            <RedirectAuthenticatedUser>
              <ForgotPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <RedirectAuthenticatedUser>
              <ResetPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />

        <Route path="*" element={<Navigate to="/" replace></Navigate>} />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
