// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faEnvelope } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(""); // New state for forgot password email
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // New state for success messages
  const [loading, setLoading] = useState(false);
  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false); // New state to toggle views
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", { username, password });
      const { jwtToken, role } = response.data;

      localStorage.setItem("jwtToken", jwtToken);
      localStorage.setItem("userRole", role);

      console.log("Login successful:", response.data);

      switch (role) {
        case "ROLE_ADMIN":
          navigate("/admin/dashboard");
          break;
        case "ROLE_EDUCATOR":
          navigate("/educator/dashboard");
          break;
        case "ROLE_STUDENT":
          navigate("/student/dashboard");
          break;
        default:
          navigate("/dashboard");
          break;
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Invalid username or password.");
      } else if (
        err.response &&
        err.response.data &&
        err.response.data.message
      ) {
        setError(err.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      // **THE FIX IS HERE:** Send the email wrapped in a JSON object.
      // This matches what your backend's ForgotPasswordRequest DTO expects.
      await api.post("/auth/forgot-password/request", { email: email });

      setSuccessMessage(
        "If an account with that email exists, a password reset link has been sent to your inbox."
      );
      setEmail(""); // Clear email field
      setIsForgotPasswordMode(false); // Optionally go back to login form after success
    } catch (err) {
      // The backend sends a generic success message to prevent user enumeration,
      // so we generally won't get a specific error here for "email not found".
      // However, network errors or server issues should still be caught.
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(
          "An error occurred while trying to send the reset link. Please try again."
        );
      }
      console.error("Forgot password error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm border border-blue-200 transform transition-all duration-300 hover:scale-[1.01]">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-800">
          {isForgotPasswordMode ? "Forgot Password?" : "Login to Campus App"}
        </h2>

        {successMessage && (
          <p className="text-green-600 text-sm font-medium text-center mb-4">
            {successMessage}
          </p>
        )}
        {error && (
          <p className="text-red-600 text-sm font-medium text-center mb-4">
            {error}
          </p>
        )}

        {!isForgotPasswordMode ? (
          // Login Form
          <form onSubmit={handleLoginSubmit} className="space-y-6">
            <div>
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                htmlFor="username"
              >
                <FontAwesomeIcon icon={faUser} className="mr-2 text-blue-500" />
                Username
              </label>
              <input
                type="text"
                id="username"
                className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter your username"
              />
            </div>
            <div>
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                htmlFor="password"
              >
                <FontAwesomeIcon icon={faLock} className="mr-2 text-blue-500" />
                Password
              </label>
              <input
                type="password"
                id="password"
                className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline-blue transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
                disabled={loading}
              >
                {loading ? "Logging In..." : "Sign In"}
              </button>
            </div>
            <p className="text-center text-sm mt-4">
              <button
                type="button"
                onClick={() => {
                  setIsForgotPasswordMode(true);
                  setError(""); // Clear errors when switching modes
                  setSuccessMessage("");
                }}
                className="text-blue-600 hover:text-blue-800 text-sm font-semibold transition duration-200"
              >
                Forgot Password?
              </button>
            </p>
          </form>
        ) : (
          // Forgot Password Form
          <form onSubmit={handleForgotPasswordSubmit} className="space-y-6">
            <div>
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                htmlFor="email"
              >
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="mr-2 text-blue-500"
                />
                Enter your email
              </label>
              <input
                type="email"
                id="email"
                className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your.email@example.com"
              />
            </div>
            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline-blue transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </div>
            <p className="text-center text-sm mt-4">
              <button
                type="button"
                onClick={() => {
                  setIsForgotPasswordMode(false);
                  setError(""); // Clear errors when switching modes
                  setSuccessMessage("");
                }}
                className="text-blue-600 hover:text-blue-800 text-sm font-semibold transition duration-200"
              >
                Back to Login
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;