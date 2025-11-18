import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import Loading from './admin/Loading';

export function ProtectedRoute({ children, requireAdmin }) {
  const { user, isLoading, isAdmin } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/authenticate/loggain" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/privat" replace />;
  }

  return children;
}