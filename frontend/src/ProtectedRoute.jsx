import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider"; // Hook do pobierania stanu autoryzacji

const ProtectedRoute = ({ component: Component }) => {
  const { isAuthenticated } = useAuth();
  
  // Jeśli użytkownik nie jest zalogowany, przekieruj do strony logowania
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  // W przeciwnym razie renderuj właściwy komponent
  return <Component />;
};

export default ProtectedRoute;
