import api, { authService } from './api';

// Extended authentication service with additional utilities
export const authServiceExtended = {
  // Basic auth operations
  ...authService,
  
  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },
  
  // Get current user from localStorage
  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  },
  
  // Store user data
  storeUserData: (userData) => {
    try {
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  },
  
  // Clear user data
  clearUserData: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  },
  
  // Validate email format
  validateEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  // Validate password strength
  validatePassword: (password) => {
    const errors = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },
  
  // Check if passwords match
  validatePasswordMatch: (password, confirmPassword) => {
    return password === confirmPassword;
  },
  
  // Format user for display
  formatUserName: (user) => {
    if (!user) return '';
    
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    
    return user.username || user.email?.split('@')[0] || 'User';
  },
  
  // Get user role label
  getUserRole: (user) => {
    if (!user) return 'Guest';
    
    if (user.is_superuser) return 'Super Admin';
    if (user.is_admin) return 'Admin';
    if (user.is_staff) return 'Staff';
    
    return 'User';
  },
  
  // Get user initials for avatar
  getUserInitials: (user) => {
    if (!user) return 'U';
    
    const name = authServiceExtended.formatUserName(user);
    const initials = name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
    
    return initials || 'U';
  },
  
  // Check if user has permission
  hasPermission: (user, permission) => {
    if (!user) return false;
    
    switch (permission) {
      case 'admin':
        return user.is_admin || user.is_superuser;
      case 'staff':
        return user.is_staff || user.is_admin || user.is_superuser;
      case 'create_sweets':
        return user.is_admin || user.is_superuser;
      case 'delete_sweets':
        return user.is_admin || user.is_superuser;
      case 'restock':
        return user.is_admin || user.is_superuser;
      case 'manage_users':
        return user.is_admin || user.is_superuser;
      default:
        return false;
    }
  },
  
  // Refresh token manually
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await api.post('/auth/refresh/', {
        refresh: refreshToken
      });
      
      const { access } = response.data;
      localStorage.setItem('token', access);
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      
      return { success: true, token: access };
    } catch (error) {
      console.error('Token refresh failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Failed to refresh token' 
      };
    }
  },
  
  // Verify token
  verifyToken: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, error: 'No token found' };
      }
      
      const response = await api.post('/auth/verify/', { token });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Token verification failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Token verification failed' 
      };
    }
  },
  
  // Get user permissions array
  getUserPermissions: (user) => {
    if (!user) return [];
    
    const permissions = ['view_sweets', 'purchase_sweets'];
    
    if (user.is_staff || user.is_admin || user.is_superuser) {
      permissions.push('view_dashboard', 'view_reports');
    }
    
    if (user.is_admin || user.is_superuser) {
      permissions.push(
        'create_sweets',
        'edit_sweets',
        'delete_sweets',
        'restock_sweets',
        'manage_users',
        'view_audit_logs'
      );
    }
    
    return permissions;
  },
  
  // Check if user can access route
  canAccessRoute: (user, route) => {
    if (!user) {
      // Public routes
      const publicRoutes = ['/', '/login', '/register'];
      return publicRoutes.includes(route);
    }
    
    // Admin routes
    const adminRoutes = ['/admin/dashboard', '/admin/sweets', '/admin/users'];
    if (adminRoutes.includes(route)) {
      return user.is_admin || user.is_superuser;
    }
    
    // Protected routes (authenticated users only)
    const protectedRoutes = ['/dashboard', '/sweets', '/profile'];
    if (protectedRoutes.includes(route)) {
      return true;
    }
    
    return false;
  }
};

export default authServiceExtended;