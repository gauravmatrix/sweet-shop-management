/**
 * Custom Hook: useAuth
 * Provides authentication-related functionality
 */

import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../utils/constants';

/**
 * Custom hook for authentication operations
 * @returns {Object} Authentication functions and state
 */
export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Get current user profile
  const { 
    data: user, 
    isLoading: loading, 
    error: userError,
    refetch: refetchUser 
  } = useQuery({
    queryKey: ['user'],
    queryFn: authAPI.profile,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    onError: (error) => {
      if (error.response?.status === 401) {
        // Token expired or invalid, clear local storage
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      }
    },
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: ({ email, password }) => authAPI.login({ email, password }),
    onSuccess: (data) => {
      // Store tokens
      localStorage.setItem('token', data.access);
      localStorage.setItem('refreshToken', data.refresh);
      
      // Update user cache
      queryClient.setQueryData(['user'], data.user);
      
      // Show success message
      toast.success(SUCCESS_MESSAGES.LOGIN);
      
      // Navigate based on user role
      if (data.user.is_admin) {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    },
    onError: (error) => {
      const message = error.response?.data?.detail || ERROR_MESSAGES.UNAUTHORIZED;
      toast.error(message);
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (userData) => authAPI.register(userData),
    onSuccess: (data) => {
      // Store tokens
      localStorage.setItem('token', data.access);
      localStorage.setItem('refreshToken', data.refresh);
      
      // Update user cache
      queryClient.setQueryData(['user'], data.user);
      
      // Show success message
      toast.success(SUCCESS_MESSAGES.REGISTER);
      
      // Navigate based on user role
      if (data.user.is_admin) {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    },
    onError: (error) => {
      const errors = error.response?.data;
      if (errors) {
        // Handle validation errors
        Object.entries(errors).forEach(([field, messages]) => {
          if (Array.isArray(messages)) {
            messages.forEach(msg => toast.error(`${field}: ${msg}`));
          } else {
            toast.error(messages);
          }
        });
      } else {
        toast.error(ERROR_MESSAGES.SERVER_ERROR);
      }
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data) => authAPI.updateProfile(data),
    onSuccess: (data) => {
      // Update user cache
      queryClient.setQueryData(['user'], data.user);
      toast.success(SUCCESS_MESSAGES.PROFILE_UPDATED);
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to update profile');
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: (data) => authAPI.changePassword(data),
    onSuccess: () => {
      toast.success(SUCCESS_MESSAGES.PASSWORD_CHANGED);
    },
    onError: (error) => {
      const errors = error.response?.data;
      if (errors?.old_password) {
        toast.error(errors.old_password[0]);
      } else {
        toast.error('Failed to change password');
      }
    },
  });

  // Logout function
  const logout = () => {
    // Clear tokens
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    
    // Clear user cache
    queryClient.removeQueries(['user']);
    queryClient.clear();
    
    // Show success message
    toast.success(SUCCESS_MESSAGES.LOGOUT);
    
    // Navigate to login
    navigate('/login');
  };

  // Check if user is authenticated
  const isAuthenticated = !!localStorage.getItem('token');

  // Check if user is admin
  const isAdmin = user?.is_admin || false;

  // Login function
  const login = async (email, password) => {
    return loginMutation.mutateAsync({ email, password });
  };

  // Register function
  const register = async (userData) => {
    return registerMutation.mutateAsync(userData);
  };

  // Update profile function
  const updateProfile = async (data) => {
    return updateProfileMutation.mutateAsync(data);
  };

  // Change password function
  const changePassword = async (data) => {
    return changePasswordMutation.mutateAsync(data);
  };

  return {
    // State
    user,
    loading: loading || loginMutation.isLoading || registerMutation.isLoading,
    isAuthenticated,
    isAdmin,
    
    // Errors
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    profileError: userError,
    
    // Functions
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    refetchUser,
    
    // Mutation states
    isLoggingIn: loginMutation.isLoading,
    isRegistering: registerMutation.isLoading,
    isUpdatingProfile: updateProfileMutation.isLoading,
    isChangingPassword: changePasswordMutation.isLoading,
    
    // Check specific permissions
    canManageSweets: isAdmin,
    canManageUsers: isAdmin,
    canRestock: isAdmin,
    canDelete: isAdmin,
  };
};

/**
 * Hook for checking authentication status
 * @returns {boolean} True if user is authenticated
 */
export const useIsAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

/**
 * Hook for getting user role
 * @returns {Object} User role information
 */
export const useUserRole = () => {
  const { user, loading } = useAuth();
  
  return {
    isAdmin: user?.is_admin || false,
    isUser: !user?.is_admin,
    isLoading: loading,
    role: user?.is_admin ? 'admin' : 'user',
  };
};

/**
 * Hook for protecting routes
 * @param {boolean} requireAdmin - Whether admin role is required
 * @returns {boolean} True if user has required permissions
 */
export const useRouteGuard = (requireAdmin = false) => {
  const { user, loading, isAuthenticated } = useAuth();
  
  if (loading) return { allowed: false, loading: true };
  if (!isAuthenticated) return { allowed: false, loading: false, redirectTo: '/login' };
  if (requireAdmin && !user?.is_admin) return { allowed: false, loading: false, redirectTo: '/dashboard' };
  
  return { allowed: true, loading: false };
};