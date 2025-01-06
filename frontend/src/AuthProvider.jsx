import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

// Hook do korzystania z kontekstu autoryzacji
export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Domyślnie niezalogowany
  
  const login = () => setIsAuthenticated(true); // Funkcja logowania
  const logout = () => setIsAuthenticated(false); // Funkcja wylogowania
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
