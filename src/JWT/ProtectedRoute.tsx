import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import isTokenExpired from './authUtils'; // Assuming you have a separate authUtils file

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    if (isTokenExpired(token)) {
      localStorage.removeItem('accessToken')
      navigate('/');
    }
  }, [token, navigate]);

  return token ? <>{children}</> : null; 
}

export default ProtectedRoute;