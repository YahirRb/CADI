// components/ProtectedRoute.jsx
import PropTypes from 'prop-types';
// global_components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import useAuth from '../state/SesionState';


const ProtectedRoute = ({ element, isAdminRequired = false, isAuthenticatedRequired = false }) => {
    const { accessToken, isAdmin } = useAuth();
  
    // Verifica si el usuario no está logueado y se requiere autenticación
    if (isAuthenticatedRequired && !accessToken) {
      return <Navigate to="/login" />;
    }
  
    // Verifica si se requiere ser admin y el usuario no lo es
    if (isAdminRequired && !isAdmin) {
      return <Navigate to="/unauthorized" />;
    }
  
    return element; // Si el usuario está logueado y cumple con los requisitos, renderizar el elemento
  };
  
  ProtectedRoute.propTypes = {
    element: PropTypes.element.isRequired,
    isAdminRequired: PropTypes.bool,
    isAuthenticatedRequired: PropTypes.bool,
  };
  
  export default ProtectedRoute;