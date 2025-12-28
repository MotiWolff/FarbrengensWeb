import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  console.log('PrivateRoute - Current user:', user);
  console.log('PrivateRoute - Loading:', loading);

  if (loading) {
    return <div>טוען...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute; 