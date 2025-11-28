import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedType }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedType && user?.type !== allowedType) {
    // Redirect to appropriate dashboard if user type doesn't match
    return <Navigate to={user?.type === 'chef' ? '/chef' : '/customer'} replace />;
  }

  return children;
}
