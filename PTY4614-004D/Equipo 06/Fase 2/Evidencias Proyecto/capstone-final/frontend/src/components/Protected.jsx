// src/components/Protected.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Protected({ children, requireAdmin = false }) {
  const { user } = useAuth();

  // Si no hay usuario → login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si requiere admin y no lo es → acceso denegado
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}