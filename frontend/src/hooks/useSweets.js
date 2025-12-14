/**
 * Custom Hook: useSweets
 * Provides sweet-related functionality with React Query
 */

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { sweetAPI } from '../services/api';
import toast from 'react-hot-toast';
import { SUCCESS_MESSAGES, ERROR_MESSAGES, PAGINATION } from '../utils/constants';

/**
 * Hook for fetching sweets with pagination and filters
 * @param {Object} filters - Filter parameters
 * @param {Object} options - Query options
 * @returns {Object} Query results
 */
export const useSweets = (filters = {}, options = {}) => {
  const queryParams = {
    page: filters.page || PAGINATION.DEFAULT_PAGE,
    page_size: filters.page_size || PAGINATION.DEFAULT_PAGE_SIZE,
    ...filters,
  };

  return useQuery({
    queryKey: ['sweets', queryParams],
    queryFn: () => sweetAPI.getAll(queryParams),
    staleTime: 2 * 60 * 1000, // 2 minutes
    keepPreviousData: true,
    ...options,
  });
};

/**
 * Hook for infinite scrolling sweets
 * @param {Object} filters - Filter parameters
 * @returns {Object} Infinite query results
 */
export const useInfiniteSweets = (filters = {}) => {
  const queryParams = {
    page_size: filters.page_size || 20,
    ...filters,
  };

  return useInfiniteQuery({
    queryKey: ['sweets', 'infinite', queryParams],
    queryFn: ({ pageParam = 1 }) => 
      sweetAPI.getAll({ ...queryParams, page: pageParam }),
    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined;
      const url = new URL(lastPage.next);
      const nextPage = url.searchParams.get('page');
      return nextPage ? parseInt(nextPage) : undefined;
    },
    staleTime: 2 * 60 * 1000,
  });
};

/**
 * Hook for fetching a single sweet by ID
 * @param {string|number} id - Sweet ID
 * @param {Object} options - Query options
 * @returns {Object} Query results
 */
export const useSweet = (id, options = {}) => {
  return useQuery({
    queryKey: ['sweet', id],
    queryFn: () => sweetAPI.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

/**
 * Hook for creating a new sweet
 * @returns {Object} Mutation functions and state
 */
export const useCreateSweet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => sweetAPI.create(data),
    onSuccess: () => {
      // Invalidate sweets queries
      queryClient.invalidateQueries(['sweets']);
      toast.success(SUCCESS_MESSAGES.SWEET_CREATED);
    },
    onError: (error) => {
      const errors = error.response?.data;
      if (errors) {
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
};

/**
 * Hook for updating a sweet
 * @returns {Object} Mutation functions and state
 */
export const useUpdateSweet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => sweetAPI.update(id, data),
    onSuccess: (data, variables) => {
      // Update specific sweet cache
      queryClient.setQueryData(['sweet', variables.id], data);
      
      // Invalidate sweets list
      queryClient.invalidateQueries(['sweets']);
      toast.success(SUCCESS_MESSAGES.SWEET_UPDATED);
    },
    onError: (error) => {
      const errors = error.response?.data;
      if (errors) {
        Object.entries(errors).forEach(([field, messages]) => {
          if (Array.isArray(messages)) {
            messages.forEach(msg => toast.error(`${field}: ${msg}`));
          } else {
            toast.error(messages);
          }
        });
      } else {
        toast.error('Failed to update sweet');
      }
    },
  });
};

/**
 * Hook for deleting a sweet
 * @returns {Object} Mutation functions and state
 */
export const useDeleteSweet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => sweetAPI.delete(id),
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries(['sweet', id]);
      
      // Invalidate sweets list
      queryClient.invalidateQueries(['sweets']);
      toast.success(SUCCESS_MESSAGES.SWEET_DELETED);
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to delete sweet');
    },
  });
};

/**
 * Hook for purchasing a sweet
 * @returns {Object} Mutation functions and state
 */
export const usePurchaseSweet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, quantity }) => sweetAPI.purchase(id, quantity),
    onSuccess: (data, variables) => {
      // Update specific sweet cache
      queryClient.setQueryData(['sweet', variables.id], data.sweet);
      
      // Invalidate sweets list
      queryClient.invalidateQueries(['sweets']);
      toast.success(SUCCESS_MESSAGES.PURCHASE_SUCCESS);
    },
    onError: (error) => {
      const message = error.response?.data?.detail || 
                     error.response?.data?.error || 
                     'Purchase failed';
      toast.error(message);
    },
  });
};

/**
 * Hook for restocking a sweet
 * @returns {Object} Mutation functions and state
 */
export const useRestockSweet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, quantity }) => sweetAPI.restock(id, quantity),
    onSuccess: (data, variables) => {
      // Update specific sweet cache
      queryClient.setQueryData(['sweet', variables.id], data.sweet);
      
      // Invalidate sweets list
      queryClient.invalidateQueries(['sweets']);
      toast.success(SUCCESS_MESSAGES.RESTOCK_SUCCESS);
    },
    onError: (error) => {
      const message = error.response?.data?.detail || 
                     error.response?.data?.error || 
                     'Restock failed';
      toast.error(message);
    },
  });
};

/**
 * Hook for searching sweets
 * @param {Object} searchParams - Search parameters
 * @param {Object} options - Query options
 * @returns {Object} Query results
 */
export const useSearchSweets = (searchParams = {}, options = {}) => {
  return useQuery({
    queryKey: ['sweets', 'search', searchParams],
    queryFn: () => sweetAPI.search(searchParams),
    enabled: Object.keys(searchParams).length > 0,
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook for fetching sweet categories
 * @returns {Object} Query results
 */
export const useSweetCategories = () => {
  return useQuery({
    queryKey: ['sweet-categories'],
    queryFn: sweetAPI.getCategories,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

/**
 * Hook for fetching sweet statistics
 * @returns {Object} Query results
 */
export const useSweetStats = () => {
  return useQuery({
    queryKey: ['sweet-stats'],
    queryFn: sweetAPI.getStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook for fetching featured sweets
 * @returns {Object} Query results
 */
export const useFeaturedSweets = () => {
  return useQuery({
    queryKey: ['sweets', 'featured'],
    queryFn: sweetAPI.getFeatured,
    staleTime: 2 * 60 * 1000,
  });
};

/**
 * Hook for fetching low stock sweets
 * @returns {Object} Query results
 */
export const useLowStockSweets = () => {
  return useQuery({
    queryKey: ['sweets', 'low-stock'],
    queryFn: sweetAPI.getLowStock,
    staleTime: 2 * 60 * 1000,
  });
};

/**
 * Hook for fetching out of stock sweets
 * @returns {Object} Query results
 */
export const useOutOfStockSweets = () => {
  return useQuery({
    queryKey: ['sweets', 'out-of-stock'],
    queryFn: sweetAPI.getOutOfStock,
    staleTime: 2 * 60 * 1000,
  });
};

/**
 * Hook for bulk operations
 * @returns {Object} Mutation functions and state
 */
export const useBulkOperations = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => sweetAPI.bulkOperations(data),
    onSuccess: () => {
      // Invalidate all sweets queries
      queryClient.invalidateQueries(['sweets']);
      toast.success('Bulk operation completed successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Bulk operation failed');
    },
  });
};