// src/components/Navbar.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 20px",
        backgroundColor: "#007bff",
        color: "white",
      }}
    >
      <h2 style={{ margin: 0 }}>
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
          Campus Market
        </Link>
      </h2>

      <div style={{ display: "flex", gap: "16px" }}>
        {user ? (
          <>
            <Link to="/post" style={{ color: "white", textDecoration: "none" }}>
              Post Item
            </Link>
            <Link to="/myposts" style={{ color: "white", textDecoration: "none" }}>
              My Posts
            </Link>
            <button
              onClick={handleLogout}
              style={{
                background: "white",
                color: "#007bff",
                border: "none",
                borderRadius: "5px",
                padding: "6px 10px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: "white", textDecoration: "none" }}>
              Login
            </Link>
            <Link to="/register" style={{ color: "white", textDecoration: "none" }}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
