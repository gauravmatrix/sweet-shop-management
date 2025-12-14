import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and token refresh
api.interceptors.response.use(
  (response) => {
    // You can modify response data here
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried refreshing token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }
        
        const response = await axios.post(`${API_URL}/auth/refresh/`, {
          refresh: refreshToken
        });
        
        const { access } = response.data;
        localStorage.setItem('token', access);
        api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
        originalRequest.headers['Authorization'] = `Bearer ${access}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        console.error('Token refresh failed:', refreshError);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login?session=expired';
        return Promise.reject(refreshError);
      }
    }
    
    // Handle other errors
    if (error.response) {
      // Server responded with error
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          toast.error(data?.detail || 'Bad request. Please check your input.');
          break;
        case 403:
          toast.error('You do not have permission to perform this action.');
          break;
        case 404:
          toast.error('The requested resource was not found.');
          break;
        case 429:
          toast.error('Too many requests. Please try again later.');
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        default:
          toast.error(data?.detail || 'An error occurred.');
      }
    } else if (error.request) {
      // Request was made but no response
      toast.error('Network error. Please check your connection.');
    } else {
      // Something else happened
      toast.error('An unexpected error occurred.');
    }
    
    return Promise.reject(error);
  }
);

// API service functions
export const authService = {
  login: (credentials) => api.post('/auth/login/', credentials),
  register: (userData) => api.post('/auth/register/', userData),
  profile: () => api.get('/auth/profile/'),
  updateProfile: (data) => api.put('/auth/profile/update/', data),
  changePassword: (data) => api.post('/auth/profile/change-password/', data),
  logout: () => api.post('/auth/logout/'),
};

export const sweetService = {
  // Sweet CRUD operations
  getAllSweets: (params = {}) => api.get('/sweets/', { params }),
  getSweet: (id) => api.get(`/sweets/${id}/`),
  createSweet: (data) => api.post('/sweets/', data),
  updateSweet: (id, data) => api.put(`/sweets/${id}/`, data),
  deleteSweet: (id) => api.delete(`/sweets/${id}/`),
  
  // Sweet operations
  purchaseSweet: (id, quantity) => api.post(`/sweets/${id}/purchase/`, { quantity }),
  restockSweet: (id, quantity) => api.post(`/sweets/${id}/restock/`, { quantity }),
  
  // Search and filters
  searchSweets: (params) => api.get('/sweets/search/advanced/', { params }),
  getCategories: () => api.get('/categories/'),
  getFeatured: () => api.get('/sweets/featured/'),
  getLowStock: () => api.get('/sweets/low_stock/'),
  getOutOfStock: () => api.get('/sweets/out_of_stock/'),
  
  // Statistics
  getStats: () => api.get('/stats/'),
  getDashboard: () => api.get('/dashboard/'),
};

export const adminService = {
  // User management
  getUsers: () => api.get('/auth/users/'),
  getUser: (id) => api.get(`/auth/users/${id}/`),
  updateUser: (id, data) => api.put(`/auth/users/${id}/`, data),
  deleteUser: (id) => api.delete(`/auth/users/${id}/`),
  
  // Bulk operations
  bulkOperations: (data) => api.post('/bulk/sweets/', data),
  
  // Reports
  getReports: (type) => api.get(`/reports/${type}/`),
  getAuditLogs: () => api.get('/audit-logs/'),
};

// Utility function for file uploads
export const uploadFile = async (file, endpoint) => {
  const formData = new FormData();
  formData.append('file', file);
  
  return api.post(endpoint, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Export the configured axios instance for custom requests
export default api;