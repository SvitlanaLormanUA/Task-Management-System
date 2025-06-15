import React, { useState, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import Cookies from 'js-cookie';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const logout = React.useCallback(async () => {
    const refreshToken = Cookies.get('refresh_token');
    
    if (refreshToken) {
      try {
        await fetch('http://127.0.0.1:5000/logout', {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${refreshToken}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error('Error during logout:', error);
      }
    }

    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    Cookies.remove('user');
    setIsAuthenticated(false);
    navigate('/login');
  }, [navigate]);

  const getAccessToken = (): string | null => {
    const token = Cookies.get('access_token');
    return token === undefined ? null : token;
  };


  const isTokenExpired = React.useCallback((token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      // Add 5 minute buffer to refresh before actual expiration
      return payload.exp < (currentTime + 300);
    } catch {
      return true;
    }
  }, []);

  const refreshAccessToken = React.useCallback(async (): Promise<boolean> => {
    const refreshToken = Cookies.get('refresh_token');

    if (!refreshToken) {
      console.log('No refresh token available');
      logout();
      return false;
    }

    // Check if refresh token is expired
    if (isTokenExpired(refreshToken)) {
      console.log('Refresh token is expired');
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
        Cookies.set('access_token', data.access_token, { expires: 7 });
        console.log('Token refreshed successfully');
        return true;
      } else {
        console.error('Failed to refresh token:', response.status);
        logout();
        return false;
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      logout();
      return false;
    }
  }, [logout, isTokenExpired]);

  const validateToken = async (token: string): Promise<boolean> => {
    try {
      const response = await fetch('http://127.0.0.1:5000/validate-token', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = Cookies.get('access_token');
      const refreshToken = Cookies.get('refresh_token');

      if (!accessToken || !refreshToken) {
        setIsLoading(false);
        return;
      }
      if (isTokenExpired(accessToken)) {
        console.log('Access token expired, attempting refresh...');
        const refreshSuccess = await refreshAccessToken();
        if (refreshSuccess) {
          setIsAuthenticated(true);
        }
      } else {
        const isValid = await validateToken(accessToken);
        if (isValid) {
          setIsAuthenticated(true);
        } else {
          const refreshSuccess = await refreshAccessToken();
          if (refreshSuccess) {
            setIsAuthenticated(true);
          }
        }
      }
      
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const checkTokenExpiration = async () => {
      const accessToken = Cookies.get('access_token');
      
      if (accessToken && isTokenExpired(accessToken)) {
        console.log('Token about to expire, refreshing...');
        await refreshAccessToken();
      }
    };

    const interval = setInterval(checkTokenExpiration, 5 * 60 * 1000);

    const handleFocus = () => {
      checkTokenExpiration();
    };
    
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [isAuthenticated, refreshAccessToken]);

  const login = (tokens: { access_token: string; refresh_token: string }) => {
    Cookies.set('access_token', tokens.access_token, { expires: 7 });
    Cookies.set('refresh_token', tokens.refresh_token, { expires: 7 });
    setIsAuthenticated(true);
  };


  // Show loading state while initializing
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      login,
      logout,
      getAccessToken,
      refreshAccessToken,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};