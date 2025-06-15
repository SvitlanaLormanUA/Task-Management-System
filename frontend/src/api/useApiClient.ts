import { useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { apiClient } from '../api/apiClient';

export const useApiClient = () => {
  const authContext = useAuth();

  useEffect(() => {
    apiClient.setAuthContext(authContext);
  }, [authContext]);

  return apiClient;
};