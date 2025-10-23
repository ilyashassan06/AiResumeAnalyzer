// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";

import { AuthProvider, useAuth } from "./Context/AuthContext";
import ProtectedRoute from "./Components/ProtectedRoute";
import Home from "./Pages/Home";
import Result from "./Pages/Result";

function App() {
  const { currentUser } = useAuth();

  return (
   
      <div className="w-full flex justify-center items-center min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-100
">
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

        {/* Public routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      </div>
    
  );
}

export default App;
