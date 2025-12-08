import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedType }) {
  const { loading, isAuthenticated, user } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const userType = user?.userType;

  if (allowedType && userType !== allowedType) {
    // If user type is not set yet (e.g. new signup), allow them to proceed or redirect to onboarding
    // For now, if they are a customer trying to access chef routes:
    if (allowedType === "chef" && userType !== "chef") {
      return <Navigate to="/customer" replace />;
    }
    if (allowedType === "customer" && userType === "chef") {
      return <Navigate to="/chef" replace />;
    }
  }

  return children;
}
