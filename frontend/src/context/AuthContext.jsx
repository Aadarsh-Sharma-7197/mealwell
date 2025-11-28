import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const login = (userData, userType) => {
    setUser({ ...userData, type: userType });
    setIsAuthenticated(true);
    
    // Redirect based on user type
    if (userType === 'chef') {
      navigate('/chef');
    } else {
      navigate('/customer');
    }
  };

  const signup = (userData, userType) => {
    setUser({ ...userData, type: userType });
    setIsAuthenticated(true);
    
    // Redirect based on user type
    if (userType === 'chef') {
      navigate('/chef');
    } else {
      navigate('/customer');
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
