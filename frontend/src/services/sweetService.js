import api from './api';
import toast from 'react-hot-toast';

// Sweet Service - All sweet-related API calls
const sweetService = {
  /**
   * Get all sweets with optional filters
   */
  getAllSweets: async (params = {}) => {
    try {
      const response = await api.get('/sweets/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching sweets:', error);
      toast.error('Failed to load sweets');
      throw error;
    }
  },

  /**
   * Get a single sweet by ID
   */
  getSweetById: async (id) => {
    try {
      const response = await api.get(`/sweets/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching sweet ${id}:`, error);
      toast.error('Sweet not found');
      throw error;
    }
  },

  /**
   * Create a new sweet (Admin only)
   */
  createSweet: async (sweetData) => {
    try {
      const response = await api.post('/sweets/', sweetData);
      toast.success('Sweet created successfully! 🍬');
      return response.data;
    } catch (error) {
      console.error('Error creating sweet:', error);
      
      // Show detailed error messages
      if (error.response?.data) {
        Object.entries(error.response.data).forEach(([field, errors]) => {
          if (Array.isArray(errors)) {
            errors.forEach(err => toast.error(`${field}: ${err}`));
          } else {
            toast.error(`${field}: ${errors}`);
          }
        });
      } else {
        toast.error('Failed to create sweet');
      }
      
      throw error;
    }
  },

  /**
   * Update an existing sweet (Admin only)
   */
  updateSweet: async (id, sweetData) => {
    try {
      const response = await api.put(`/sweets/${id}/`, sweetData);
      toast.success('Sweet updated successfully! ✨');
      return response.data;
    } catch (error) {
      console.error(`Error updating sweet ${id}:`, error);
      
      if (error.response?.data) {
        Object.entries(error.response.data).forEach(([field, errors]) => {
          if (Array.isArray(errors)) {
            errors.forEach(err => toast.error(`${field}: ${err}`));
          } else {
            toast.error(`${field}: ${errors}`);
          }
        });
      } else {
        toast.error('Failed to update sweet');
      }
      
      throw error;
    }
  },

  /**
   * Delete a sweet (Admin only)
   */
  deleteSweet: async (id) => {
    try {
      await api.delete(`/sweets/${id}/`);
      toast.success('Sweet deleted successfully');
      return true;
    } catch (error) {
      console.error(`Error deleting sweet ${id}:`, error);
      
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to delete sweet');
      }
      
      throw error;
    }
  },

  /**
   * Purchase a sweet
   */
  purchaseSweet: async (id, quantity) => {
    try {
      const response = await api.post(`/sweets/${id}/purchase/`, { quantity });
      toast.success(`Purchased ${quantity} item(s) successfully! 🛍️`);
      return response.data;
    } catch (error) {
      console.error(`Error purchasing sweet ${id}:`, error);
      
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else if (error.response?.data?.quantity) {
        toast.error(error.response.data.quantity[0]);
      } else {
        toast.error('Failed to purchase sweet');
      }
      
      throw error;
    }
  },

  /**
   * Restock a sweet (Admin only)
   */
  restockSweet: async (id, quantity, reason = '') => {
    try {
      const data = { quantity };
      if (reason) data.reason = reason;
      
      const response = await api.post(`/sweets/${id}/restock/`, data);
      toast.success(`Restocked ${quantity} item(s) successfully! 📦`);
      return response.data;
    } catch (error) {
      console.error(`Error restocking sweet ${id}:`, error);
      
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else if (error.response?.data?.quantity) {
        toast.error(error.response.data.quantity[0]);
      } else {
        toast.error('Failed to restock sweet');
      }
      
      throw error;
    }
  },

  /**
   * Search sweets with advanced filters
   */
  searchSweets: async (filters = {}) => {
    try {
      const response = await api.get('/sweets/search/advanced/', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error searching sweets:', error);
      toast.error('Search failed');
      throw error;
    }
  },

  /**
   * Get all sweet categories
   */
  getCategories: async () => {
    try {
      const response = await api.get('/categories/');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Don't show toast for this, as it's not critical
      return [];
    }
  },

  /**
   * Get sweet statistics
   */
  getStats: async () => {
    try {
      const response = await api.get('/stats/');
      return response.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load statistics');
      throw error;
    }
  },

  /**
   * Get featured sweets
   */
  getFeaturedSweets: async () => {
    try {
      const response = await api.get('/sweets/featured/');
      return response.data;
    } catch (error) {
      console.error('Error fetching featured sweets:', error);
      // Don't show toast for this
      return { results: [] };
    }
  },

  /**
   * Get low stock sweets
   */
  getLowStockSweets: async () => {
    try {
      const response = await api.get('/sweets/low_stock/');
      return response.data;
    } catch (error) {
      console.error('Error fetching low stock sweets:', error);
      return [];
    }
  },

  /**
   * Get out of stock sweets
   */
  getOutOfStockSweets: async () => {
    try {
      const response = await api.get('/sweets/out_of_stock/');
      return response.data;
    } catch (error) {
      console.error('Error fetching out of stock sweets:', error);
      return [];
    }
  },

  /**
   * Bulk operations on sweets (Admin only)
   */
  bulkOperations: async (operation, sweetIds, quantity = 0) => {
    try {
      const response = await api.post('/bulk/sweets/', {
        operation,
        sweet_ids: sweetIds,
        quantity
      });
      
      toast.success(response.data.message || 'Bulk operation successful');
      return response.data;
    } catch (error) {
      console.error('Error in bulk operation:', error);
      
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Bulk operation failed');
      }
      
      throw error;
    }
  },

  /**
   * Get dashboard data
   */
  getDashboardData: async () => {
    try {
      const response = await api.get('/dashboard/');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      
      // If 403 (not admin), return empty data
      if (error.response?.status === 403) {
        return {
          today: new Date().toISOString().split('T')[0],
          alerts: { low_stock: 0, out_of_stock: 0 },
          inventory_value: 0,
          total_sweets: 0,
          total_available: 0
        };
      }
      
      toast.error('Failed to load dashboard');
      throw error;
    }
  },
};

export default sweetService;