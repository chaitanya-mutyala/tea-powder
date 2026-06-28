import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, role, authLoading } = useAuthStore();

  // Wait for Firebase to resolve auth state before redirecting
  if (authLoading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}
