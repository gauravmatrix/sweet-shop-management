import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loading from '../Common/Loading';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <Loading />;
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  if (requireAdmin && !user?.is_admin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;