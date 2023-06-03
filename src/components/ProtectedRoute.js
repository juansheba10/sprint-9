import { Navigate, useLocation } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../Firebase/script.js';
import { Puff } from 'react-loader-spinner';

const ProtectedRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);
  const location = useLocation();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
    <Puff color="#00BFFF" height={100} width={100} />
  </div>
  }

  return (
    user ? children : <Navigate to="/" state={{ from: location }} />
  );
};

export default ProtectedRoute;
