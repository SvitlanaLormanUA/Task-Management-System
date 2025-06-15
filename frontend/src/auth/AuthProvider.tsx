import React, { useState, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import Cookies from 'js-cookie';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Перевіряємо наявність токенів при завантаженні
    const accessToken = Cookies.get('access_token');
    const refreshToken = Cookies.get('refresh_token');
    
    if (accessToken && refreshToken) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (tokens: { access_token: string; refresh_token: string }) => {
    Cookies.set('access_token', tokens.access_token);
    Cookies.set('refresh_token', tokens.refresh_token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    // Cookies.remove('access_token');
    // Cookies.remove('refresh_token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const getAccessToken = (): string | null => {
    const token = Cookies.get('access_token');
    return token === undefined ? null : token;
  };

  const refreshAccessToken = async (): Promise<boolean> => {
    const refreshToken = Cookies.get('refresh_token');
    
    if (!refreshToken) {
      logout();
      return false;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/refresh', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${refreshToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        Cookies.set('access_token', data.access_token);
        return true;
      } else {
        logout();
        return false;
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      logout();
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      login,
      logout,
      getAccessToken,
      refreshAccessToken
    }}>
      {children}
    </AuthContext.Provider>
  );
};
