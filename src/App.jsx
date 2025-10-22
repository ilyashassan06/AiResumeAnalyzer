// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

import { AuthProvider, useAuth } from "./Context/AuthContext";
import ProtectedRoute from "./Components/ProtectedRoute";
import Home from "./Pages/Home";

function App() {
  const { currentUser } = useAuth();

  return (
   
      <div className="w-full flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <Routes>
        {/* Default route "/" redirects based on login */}
        <Route
          path="/"
          element={
            currentUser ? <Navigate to="/Home" /> : <Navigate to="/login" />
          }
        />

        {/* Protected Home */}
        <Route
          path="/Home"
          element={
            // <ProtectedRoute>
              <Home />
            // </ProtectedRoute>
          }
        />

        {/* Public routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      </div>
    
  );
}

export default App;
