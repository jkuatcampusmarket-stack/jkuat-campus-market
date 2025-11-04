// src/App.jsx
import React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import PostItem from "./pages/PostItem";
import Categories from "./pages/Categories";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyPosts from "./pages/MyPosts";
import EditPost from "./pages/EditPost";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* 🌟 NAVBAR */}
      <nav className="bg-blue-600 text-white shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-3">
          <Link
            to="/"
            className="text-2xl font-bold tracking-wide hover:text-yellow-300 transition"
          >
            JKUAT Campus Market
          </Link>

          <div className="flex space-x-6 text-sm sm:text-base items-center">
            {user ? (
              <>
                <Link
                  to="/"
                  className="hover:text-yellow-300 transition duration-200"
                >
                  Home
                </Link>
                <Link
                  to="/post"
                  className="hover:text-yellow-300 transition duration-200"
                >
                  Post Item
                </Link>
                <Link
                  to="/categories"
                  className="hover:text-yellow-300 transition duration-200"
                >
                  Categories
                </Link>
                <Link
                  to="/myposts"
                  className="hover:text-yellow-300 transition duration-200"
                >
                  My Posts
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-yellow-400 text-blue-700 px-3 py-1 rounded-md font-semibold hover:bg-yellow-300 transition duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-yellow-400 text-blue-700 px-3 py-1 rounded-md font-semibold hover:bg-yellow-300 transition duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-yellow-400 text-blue-700 px-3 py-1 rounded-md font-semibold hover:bg-yellow-300 transition duration-200"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* PAGE CONTENT */}
      <div className="flex-grow">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <Categories />
              </ProtectedRoute>
            }
          />
          <Route
            path="/post"
            element={
              <ProtectedRoute>
                <PostItem />
              </ProtectedRoute>
            }
          />
          <Route
            path="/myposts"
            element={
              <ProtectedRoute>
                <MyPosts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute>
                <EditPost />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>

      {/* FOOTER */}
      <footer className="bg-blue-600 text-white text-center py-3 mt-auto">
        <p className="text-sm">
          © {new Date().getFullYear()} JKUAT Campus Market — All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default App;
