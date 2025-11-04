import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png"; // Adjust if your logo path differs

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brandBlue via-brandGreen to-brandYellow px-4">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md p-8 animate-fadeIn">
        
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Campus Marketplace Logo" className="h-16 w-auto" />
        </div>

        {/* Welcome Text */}
        <h2 className="text-2xl font-bold text-center text-brandBlue mb-2">
          Login to Campus Marketplace
        </h2>
        <p className="text-center text-gray-600 mb-6 leading-relaxed">
          <span className="text-brandGreen font-semibold">Hello.</span> Buying and
          Selling has never been easier.
        </p>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brandBlue outline-none transition"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brandBlue outline-none transition"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-brandBlue text-white py-2 rounded-lg hover:bg-brandGreen hover:text-white transition duration-300 font-semibold"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="text-brandBlue hover:underline font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
