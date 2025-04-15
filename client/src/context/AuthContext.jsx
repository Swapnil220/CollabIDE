// // AuthContext.js
// import { createContext, useContext, useState, useEffect } from 'react';

// const AuthContext = createContext();
// const API_URL = '/api/users';

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   const checkAuth = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) return;
      
//       const response = await fetch(`${API_URL}/me`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const userData = await response.json();
//       setUser(userData);
//     } catch (error) {
//       setUser(null);
//       localStorage.removeItem('token');
//     }
//   };

//   useEffect(() => {
//     checkAuth();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, setUser, checkAuth }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getCurrentUser } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const userFromStorage = localStorage.getItem('user');
    return userFromStorage ? JSON.parse(userFromStorage) : null;
  });

  const checkAuth = useCallback(async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch {
      setUser(null);
      localStorage.removeItem('user');
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider value={{ user, setUser, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
