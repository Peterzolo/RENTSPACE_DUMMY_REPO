// AuthProvider.js
import React, { createContext, useState } from 'react';
import Cookies from 'universal-cookie';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const cookies = new Cookies();
  const [isAuthenticated, setIsAuthenticated] = useState(!!cookies.get('token'));

  const login = (token) => {
    cookies.set('token', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    cookies.remove('token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
