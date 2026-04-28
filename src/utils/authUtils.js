import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export const useAuthRedirect = () => {
  const { isAuthenticated } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const requireAuth = (action) => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return false;
    }
    return true;
  };

  return { requireAuth, showLoginPrompt, setShowLoginPrompt };
}; 