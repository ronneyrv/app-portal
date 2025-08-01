import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner/LoadingSpinner";

const ProtectedRoute = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(null);

  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;

  useEffect(() => {
    fetch(`${API_URL}/verificaLogin`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setLoggedIn(data.loggedIn);
      })
      .catch((error) => {
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
