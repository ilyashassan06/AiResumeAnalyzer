// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import { AuthProvider, useAuth } from "./Context/AuthContext";
import ProtectedRoute from "./Components/ProtectedRoute";
import Home from "./Pages/Home";
import Result from "./Pages/Result";
import { useTheme } from "./Context/ThemeContext";

function App() {
  const { currentUser } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="w-full flex justify-center min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-100">
      <Routes>
        <Route
          path="/"
          element={currentUser ? <Navigate to="/Home" /> : <Navigate to="/login" />}
        />

        <Route
          path="/Home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Result"
          element={
            <ProtectedRoute>
              <Result />
            </ProtectedRoute>
          }
        />

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>

      {/* Theme toggle - responsive placement so it doesn't overlap form or logout */}
      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className={`
          fixed right-6 bottom-15 z-40
          md:top-6 md:right-6 md:bottom-auto
          flex items-center justify-center gap-2
          w-12 h-12 rounded-xl p-2 text-sm font-medium
          transition-transform duration-150
          ${theme === "light"
            ? "bg-white text-amber-600 shadow-md hover:scale-105"
            : "bg-gray-800 text-amber-300 shadow-md hover:scale-105"}
        `}
      >
        {/* simple sun/moon icon swapped by theme */}
        {theme === "light" ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 18a6 6 0 100-12 6 6 0 000 12z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
          </svg>
        )}
      </button>
    </div>
  );
}

export default App;
