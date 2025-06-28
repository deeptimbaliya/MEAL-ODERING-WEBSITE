import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('profile');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  
  useEffect(() => {
    if (user) {
      localStorage.setItem('profile', JSON.stringify(user));
    } else {
      localStorage.removeItem('profile');
    }
  }, [user]);

 const login = (userData) => {
  setUser({ ...userData, isLoggedIn: true });
};

  const logout = () => {
    setUser(null);
    localStorage.removeItem('profile');
  };

  const isLoggedIn = !!user;
  const isProfileComplete =!!(user?.username && user?.email && user?.MobileNo && user?.address);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, isProfileComplete, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
