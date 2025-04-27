import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3001/verificaLogin', { withCredentials: true })
      .then(response => {
        setLoggedIn(response.data.loggedIn);
      })
      .catch(error => {
        setLoggedIn(false);
        console.error(error);
      });
  }, []);

  if (loggedIn === null) {
    return <LoadingSpinner />;
  }

  if (!loggedIn) {
    // Se não está logado, redireciona
    return <Navigate to="/" />;
  }

  // Se está logado, renderiza a página
  return children;
};

export default ProtectedRoute;
