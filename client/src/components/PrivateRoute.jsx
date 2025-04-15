import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = () => {
  const { user } = useAuth();

  if (!user) {
    // Redirect to login page if the user is not authenticated
    return <Navigate to="/login" />;
  }

  return <Outlet />;  // Render child routes if authenticated
};

export default PrivateRoute;
