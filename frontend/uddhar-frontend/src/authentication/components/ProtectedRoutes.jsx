import PropTypes from 'prop-types';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles = [], redirectUnauthorized = '/sign-in' }) => {
  const { isAuthenticated, hasRole } = useAuth();
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to={redirectUnauthorized} state={{ from: location }} replace />;
  }

  if (roles.length > 0 && !hasRole(roles)) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return (children || <Outlet />);
};

export default ProtectedRoute;

ProtectedRoute.propTypes = {
    children: PropTypes.node,
    roles: PropTypes.array,
    redirectUnauthorized: PropTypes.string,
};