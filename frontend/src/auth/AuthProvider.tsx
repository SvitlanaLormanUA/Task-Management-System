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
    console.log('🔐 Logout called');
    const refreshToken = Cookies.get('refresh_token');

    if (refreshToken) {
      try {
        await fetch('http://127.0.0.1:5000/logout', {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${refreshToken}`,
            'Content-Type': 'application/json',
          },
        });
        console.log('✅ Logout API call successful');
      } catch (error) {
        console.error('❌ Error during logout:', error);
      }
    }

    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    Cookies.remove('user');
    setIsAuthenticated(false);
    console.log('🔐 User logged out, redirecting to login');
    navigate('/login');
  }, [navigate]);

  const getAccessToken = (): string | null => {
    const token = Cookies.get('access_token');
    console.log('🔑 Getting access token:', token ? 'Found' : 'Not found');
    return token === undefined ? null : token;
  };

  const isTokenExpired = React.useCallback((token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      const isExpired = payload.exp < currentTime + 300;
      console.log('⏰ Token expiry check:', {
        exp: payload.exp,
        current: currentTime + 300,
        isExpired,
      });
      return isExpired;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }, []);

  const refreshAccessToken = React.useCallback(async (): Promise<boolean> => {
    console.log('🔄 Attempting to refresh access token...');
    const refreshToken = Cookies.get('refresh_token');

    if (!refreshToken) {
      logout();
      return false;
    }
    if (isTokenExpired(refreshToken)) {
      logout();
      return false;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/refresh', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${refreshToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        Cookies.set('access_token', data.access_token, { expires: 7 });
        return true;
      } else {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        logout();
        return false;
      }
    } catch (error) {
      console.error('Network error refreshing token:', error);
      logout();
      return false;
    }
  }, [logout, isTokenExpired]);

  const validateToken = async (token: string): Promise<boolean> => {
    try {
      const response = await fetch('http://127.0.0.1:5000/validate-token', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const isValid = response.ok;
      console.log('🔍 Token validation result:', isValid ? 'Valid' : 'Invalid');
      if (!isValid) {
        console.log('Validation failed with status:', response.status);
      }
      return isValid;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = Cookies.get('access_token');
      const refreshToken = Cookies.get('refresh_token');

      if (!accessToken || !refreshToken) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      if (isTokenExpired(accessToken)) {
        const refreshSuccess = await refreshAccessToken();
        if (refreshSuccess) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } else {
        console.log('⏰ Access token not expired, validating...');
        const isValid = await validateToken(accessToken);
        if (isValid) {
          setIsAuthenticated(true);
        } else {
          const refreshSuccess = await refreshAccessToken();
          if (refreshSuccess) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        }
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, [refreshAccessToken, isTokenExpired]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    const checkTokenExpiration = async () => {
      const accessToken = Cookies.get('access_token');

      if (accessToken && isTokenExpired(accessToken)) {
        const success = await refreshAccessToken();
        if (!success) {
          console.log('Periodic token refresh failed');
        }
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
  }, [isAuthenticated, refreshAccessToken, isTokenExpired]);

  const login = (tokens: { access_token: string; refresh_token: string }) => {
    console.log('🔐 Login called with tokens');
    Cookies.set('access_token', tokens.access_token, { expires: 7 });
    Cookies.set('refresh_token', tokens.refresh_token, { expires: 7 });
    setIsAuthenticated(true);
  };

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-lg'>Loading...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        getAccessToken,
        refreshAccessToken,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
