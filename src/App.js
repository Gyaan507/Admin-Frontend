import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Options from "./components/Options";
import Admin_api from "./components/Admin_api";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  console.log("ProtectedRoute - isAuthenticated:", isAuthenticated); // Debug log
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/options"
          element={
            <ProtectedRoute>
              <Options />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin_api"
          element={
            <ProtectedRoute>
              <Admin_api />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

