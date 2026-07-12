import React, { createContext, useContext, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/auth';

const AuthContext = createContext(null);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const queryClientInstance = useQueryClient();

  const hasToken = () => !!localStorage.getItem('access_token');

  const {
    data: user,
    isLoading,
    isError,
    refetch,
    error,
  } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      try {
        const response = await authApi.me();
        if (response.success) {
          return response.data;
        }
        throw new Error(response.message || 'Failed to fetch user');
      } catch (err) {
        if (err.response?.status === 401) {
          clearAuth();
        }
        throw err;
      }
    },
    enabled: hasToken(),
    retry: false,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  const clearAuth = useCallback(() => {
    queryClientInstance.clear();
    localStorage.removeItem('access_token');
    queryClientInstance.setQueryData(['auth', 'me'], null);
  }, [queryClientInstance]);

  const loadUser = useCallback(async () => {
    if (!hasToken()) return;

    try {
      const result = await queryClientInstance.fetchQuery({
        queryKey: ['auth', 'me'],
        queryFn: async () => {
          const response = await authApi.me();
          if (response.success) {
            return response.data;
          }
          throw new Error(response.message || 'Failed to fetch user');
        },
        staleTime: 0,
      });
      return result;
    } catch (err) {
      if (err.response?.status === 401) {
        clearAuth();
      }
      throw err;
    }
  }, [queryClientInstance, clearAuth]);

  const login = useCallback(
    async (credentials, recaptchaToken) => {
      try {
        const response = await authApi.login(credentials, recaptchaToken);

        if (response.success) {
          const { access_token, user: userData } = response.data;

          localStorage.setItem('access_token', access_token);

          queryClientInstance.setQueryData(['auth', 'me'], userData);

          await queryClientInstance.invalidateQueries({
            queryKey: ['auth'],
            refetchType: 'active',
          });

          return { success: true, user: userData };
        }

        return {
          success: false,
          error: response.message || 'Login gagal',
        };
      } catch (err) {
        let errorMessage = 'Terjadi kesalahan saat login. Silakan coba lagi.';

        if (err.response) {
          const status = err.response.status;
          const data = err.response.data;

          if (status === 401 || status === 403) {
            errorMessage = data?.message || 'Email atau password salah';
          } else if (status === 422) {
            if (data?.errors) {
              const errors = data.errors;
              const firstKey = Object.keys(errors)[0];
              const firstError = errors[firstKey];
              errorMessage = Array.isArray(firstError) ? firstError[0] : 'Validasi gagal';
            } else if (data?.message) {
              errorMessage = data.message;
            }
          } else if (status === 400) {
            errorMessage = data?.message || 'reCAPTCHA tidak valid atau kadaluarsa';
          } else if (status >= 500) {
            errorMessage = 'Server error. Silakan coba beberapa saat lagi.';
          } else if (data?.message) {
            errorMessage = data.message;
          }
        } else if (err.request) {
          errorMessage = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
        } else if (err.message) {
          errorMessage = err.message;
        }

        return { success: false, error: errorMessage };
      }
    },
    [queryClientInstance]
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout().catch(() => {});
    } finally {
      queryClientInstance.clear();
      localStorage.removeItem('access_token');
      queryClientInstance.setQueryData(['auth', 'me'], null);
      return { success: true };
    }
  }, [queryClientInstance]);

  const refresh = useCallback(async () => {
    try {
      const response = await authApi.refresh();

      if (response.success) {
        const { access_token, user: userData } = response.data;

        localStorage.setItem('access_token', access_token);

        if (userData) {
          queryClientInstance.setQueryData(['auth', 'me'], userData);
        }

        return { success: true };
      }

      return { success: false };
    } catch (err) {
      if (err.response?.status === 401) {
        clearAuth();
      }
      return { success: false };
    }
  }, [queryClientInstance, clearAuth]);

  const value = {
    user,
    loading: isLoading,
    error: isError ? error : null,
    isAuthenticated: !!user,
    login,
    logout,
    refresh,
    loadUser,
    clearAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};