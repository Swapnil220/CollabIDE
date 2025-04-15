import { useState, useEffect, useCallback } from 'react';
import { getCurrentUser } from '../services/authService'; // Ensure this service works for getting the current user

export const useAuth = () => {
  const [user, setUser] = useState(() => {
    // Check if there's a user in localStorage when the hook is first used
    const userFromStorage = localStorage.getItem('user');
    return userFromStorage ? JSON.parse(userFromStorage) : null;
  });

  // Function to check the current authentication status
  const checkAuth = useCallback(async () => {
    try {
      const userData = await getCurrentUser(); // Fetch current user from backend (if required)
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData)); // Persist user in localStorage
    } catch {
      setUser(null);
      localStorage.removeItem('user'); // Clear from localStorage if auth fails
    }
  }, []);

  useEffect(() => {
    checkAuth(); // On mount, check auth status
  }, [checkAuth]);

  return { user, setUser, checkAuth };
};
