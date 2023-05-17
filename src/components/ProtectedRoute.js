import { Navigate, useLocation } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../Firebase/script.js';

const ProtectedRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    user ? children : <Navigate to="/" state={{ from: location }} />
  );
};

export default ProtectedRoute;
