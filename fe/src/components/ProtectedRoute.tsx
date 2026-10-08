import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Protected Route Component
 * Redirect ke /admin/login jika user belum authenticated
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  if (!isAuthenticated()) {
    // Redirect ke login page
    return <Navigate to="/admin/login" replace />;
  }

  // User authenticated, render children
  return <>{children}</>;
}
