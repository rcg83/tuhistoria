import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from 'src/features/auth/context/AuthContext';

export const ProtectedRoute = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
