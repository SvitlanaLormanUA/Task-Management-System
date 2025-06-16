import { useAuth } from '../auth/AuthContext';
import { Navigate } from 'react-router-dom';
import { type ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#d7e9f7]">
        <div className="text-lg text-[#4b306a]">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('User is not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;