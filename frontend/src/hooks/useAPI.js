/**
 * Custom Hook: useAPI
 * Generic API hook for making HTTP requests with React Query
 */

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_CONFIG, ERROR_MESSAGES } from '../utils/constants';

/**
 * Create axios instance with base configuration
 */
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        const response = await axios.post(`${API_CONFIG.BASE_URL}/auth/refresh/`, {
          refresh: refreshToken,
        });
        
        const { access } = response.data;
        localStorage.setItem('token', access);
        
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

/**
 * Generic hook for GET requests
 * @param {string} key - Query key
 * @param {string} url - API endpoint URL
 * @param {Object} params - Query parameters
 * @param {Object} options - React Query options
 * @returns {Object} Query result
 */
export const useGet = (key, url, params = {}, options = {}) => {
  return useQuery({
    queryKey: [key, params],
    queryFn: async () => {
      const response = await api.get(url, { params });
      return response.data;
    },
    retry: API_CONFIG.RETRY_ATTEMPTS,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

/**
 * Generic hook for infinite scroll GET requests
 * @param {string} key - Query key
 * @param {string} url - API endpoint URL
 * @param {Object} params - Query parameters
 * @param {Function} getNextPageParam - Function to get next page param
 * @param {Object} options - React Query options
 * @returns {Object} Infinite query result
 */
export const useInfiniteGet = (key, url, params = {}, getNextPageParam, options = {}) => {
  return useInfiniteQuery({
    queryKey: [key, 'infinite', params],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get(url, { 
        params: { ...params, page: pageParam } 
      });
      return response.data;
    },
    getNextPageParam: getNextPageParam || ((lastPage) => {
      if (!lastPage.next) return undefined;
      const url = new URL(lastPage.next);
      const nextPage = url.searchParams.get('page');
      return nextPage ? parseInt(nextPage) : undefined;
    }),
    ...options,
  });
};

/**
 * Generic hook for POST requests
 * @param {Object} config - Mutation configuration
 * @returns {Object} Mutation result
 */
export const usePost = (config = {}) => {
  const queryClient = useQueryClient();
  const { 
    invalidateQueries = [],
    successMessage,
    errorMessage = ERROR_MESSAGES.SERVER_ERROR,
    onSuccess: customOnSuccess,
    onError: customOnError,
    ...mutationOptions
  } = config;

  return useMutation({
    mutationFn: async ({ url, data, params = {} }) => {
      const response = await api.post(url, data, { params });
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      // Invalidate specified queries
      invalidateQueries.forEach(queryKey => {
        queryClient.invalidateQueries(queryKey);
      });

      // Show success message
      if (successMessage) {
        toast.success(successMessage);
      }

      // Call custom onSuccess if provided
      if (customOnSuccess) {
        customOnSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      // Show error message
      const message = error.response?.data?.detail || 
                     error.response?.data?.error || 
                     errorMessage;
      toast.error(message);

      // Call custom onError if provided
      if (customOnError) {
        customOnError(error, variables, context);
      }
    },
    ...mutationOptions,
  });
};

/**
 * Generic hook for PUT requests
 * @param {Object} config - Mutation configuration
 * @returns {Object} Mutation result
 */
export const usePut = (config = {}) => {
  const queryClient = useQueryClient();
  const { 
    invalidateQueries = [],
    updateQueryKey,
    successMessage,
    errorMessage = 'Update failed',
    onSuccess: customOnSuccess,
    onError: customOnError,
    ...mutationOptions
  } = config;

  return useMutation({
    mutationFn: async ({ url, data, params = {} }) => {
      const response = await api.put(url, data, { params });
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      // Update specific query cache if key provided
      if (updateQueryKey) {
        queryClient.setQueryData(updateQueryKey, data);
      }

      // Invalidate specified queries
      invalidateQueries.forEach(queryKey => {
        queryClient.invalidateQueries(queryKey);
      });

      // Show success message
      if (successMessage) {
        toast.success(successMessage);
      }

      // Call custom onSuccess if provided
      if (customOnSuccess) {
        customOnSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      // Show error message
      const message = error.response?.data?.detail || 
                     error.response?.data?.error || 
                     errorMessage;
      toast.error(message);

      // Call custom onError if provided
      if (customOnError) {
        customOnError(error, variables, context);
      }
    },
    ...mutationOptions,
  });
};

/**
 * Generic hook for PATCH requests
 * @param {Object} config - Mutation configuration
 * @returns {Object} Mutation result
 */
export const usePatch = (config = {}) => {
  return usePut({ ...config, method: 'PATCH' });
};

/**
 * Generic hook for DELETE requests
 * @param {Object} config - Mutation configuration
 * @returns {Object} Mutation result
 */
export const useDelete = (config = {}) => {
  const queryClient = useQueryClient();
  const { 
    invalidateQueries = [],
    removeQueryKey,
    successMessage,
    errorMessage = 'Delete failed',
    onSuccess: customOnSuccess,
    onError: customOnError,
    ...mutationOptions
  } = config;

  return useMutation({
    mutationFn: async ({ url, params = {} }) => {
      const response = await api.delete(url, { params });
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      // Remove specific query from cache if key provided
      if (removeQueryKey) {
        queryClient.removeQueries(removeQueryKey);
      }

      // Invalidate specified queries
      invalidateQueries.forEach(queryKey => {
        queryClient.invalidateQueries(queryKey);
      });

      // Show success message
      if (successMessage) {
        toast.success(successMessage);
      }

      // Call custom onSuccess if provided
      if (customOnSuccess) {
        customOnSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      // Show error message
      const message = error.response?.data?.detail || 
                     error.response?.data?.error || 
                     errorMessage;
      toast.error(message);

      // Call custom onError if provided
      if (customOnError) {
        customOnError(error, variables, context);
      }
    },
    ...mutationOptions,
  });
};

/**
 * Hook for uploading files
 * @param {Object} config - Upload configuration
 * @returns {Object} Upload mutation
 */
export const useUpload = (config = {}) => {
  const { 
    successMessage = 'File uploaded successfully',
    errorMessage = 'Upload failed',
    ...mutationOptions
  } = config;

  return useMutation({
    mutationFn: async ({ url, file, fieldName = 'file', additionalData = {} }) => {
      const formData = new FormData();
      formData.append(fieldName, file);
      
      // Append additional data
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await api.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (successMessage) {
        toast.success(successMessage);
      }
    },
    onError: (error) => {
      const message = error.response?.data?.detail || errorMessage;
      toast.error(message);
    },
    ...mutationOptions,
  });
};

/**
 * Hook for downloading files
 * @param {Object} config - Download configuration
 * @returns {Object} Download mutation
 */
export const useDownload = (config = {}) => {
  const { 
    errorMessage = 'Download failed',
    onSuccess: customOnSuccess,
    ...mutationOptions
  } = config;

  return useMutation({
    mutationFn: async ({ url, params = {}, filename }) => {
      const response = await api.get(url, {
        params,
        responseType: 'blob',
      });

      // Create download link
      const urlObject = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = urlObject;
      link.setAttribute('download', filename || 'download');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(urlObject);

      return response.data;
    },
    onSuccess: (data, variables, context) => {
      if (customOnSuccess) {
        customOnSuccess(data, variables, context);
      }
    },
    onError: (error) => {
      const message = error.response?.data?.detail || errorMessage;
      toast.error(message);
    },
    ...mutationOptions,
  });
};

/**
 * Hook for making custom API requests
 * @param {Object} config - Request configuration
 * @returns {Object} Custom mutation
 */
export const useCustomRequest = (config = {}) => {
  const { 
    method = 'GET',
    successMessage,
    errorMessage = 'Request failed',
    onSuccess: customOnSuccess,
    onError: customOnError,
    ...mutationOptions
  } = config;

  return useMutation({
    mutationFn: async ({ url, data = {}, params = {}, headers = {} }) => {
      const response = await api({
        method,
        url,
        data,
        params,
        headers,
      });
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      if (successMessage) {
        toast.success(successMessage);
      }
      if (customOnSuccess) {
        customOnSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      const message = error.response?.data?.detail || errorMessage;
      toast.error(message);
      if (customOnError) {
        customOnError(error, variables, context);
      }
    },
    ...mutationOptions,
  });
};

/**
 * Hook for optimistic updates
 * @param {Object} config - Optimistic update configuration
 * @returns {Object} Mutation with optimistic updates
 */
export const useOptimisticUpdate = (config = {}) => {
  const queryClient = useQueryClient();
  const { 
    queryKey,
    updateFn,
    successMessage,
    errorMessage = 'Update failed',
    ...mutationOptions
  } = config;

  return useMutation({
    mutationFn: async (variables) => {
      return updateFn(variables);
    },
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(queryKey);

      // Optimistically update to the new value
      if (previousData) {
        queryClient.setQueryData(queryKey, (old) => {
          // Implement your optimistic update logic here
          return old;
        });
      }

      return { previousData };
    },
    onError: (err, variables, context) => {
      // Rollback to the previous value
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      toast.error(errorMessage);
    },
    onSuccess: (data, variables, context) => {
      if (successMessage) {
        toast.success(successMessage);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey });
    },
    ...mutationOptions,
  });
};

// Export the axios instance for direct use if needed
export { api };

// Export default configuration
export default {
  useGet,
  useInfiniteGet,
  usePost,
  usePut,
  usePatch,
  useDelete,
  useUpload,
  useDownload,
  useCustomRequest,
  useOptimisticUpdate,
  api,
};