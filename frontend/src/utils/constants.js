/**
 * Application Constants
 * Contains all static values used throughout the application
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
};

// Sweet Categories
export const SWEET_CATEGORIES = [
  { value: 'chocolate', label: 'Chocolate', color: '#7B3F00', icon: '🍫' },
  { value: 'candy', label: 'Candy', color: '#FF4081', icon: '🍬' },
  { value: 'cake', label: 'Cake', color: '#FF9800', icon: '🎂' },
  { value: 'cookie', label: 'Cookie', color: '#8D6E63', icon: '🍪' },
  { value: 'dessert', label: 'Dessert', color: '#2196F3', icon: '🍧' },
  { value: 'indian', label: 'Indian Sweet', color: '#F44336', icon: '🥠' },
];

// Stock Status
export const STOCK_STATUS = {
  AVAILABLE: { label: 'In Stock', color: '#10B981', badge: 'success' },
  LOW_STOCK: { label: 'Low Stock', color: '#F59E0B', badge: 'warning' },
  OUT_OF_STOCK: { label: 'Out of Stock', color: '#EF4444', badge: 'error' },
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  SUPER_ADMIN: 'superadmin',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'sweet_shop_token',
  REFRESH_TOKEN: 'sweet_shop_refresh_token',
  USER_DATA: 'sweet_shop_user_data',
  THEME: 'sweet_shop_theme',
  CART: 'sweet_shop_cart',
};

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  USERNAME: /^[a-zA-Z0-9_]{3,30}$/,
  PHONE: /^[\+]?[1-9][\d]{0,15}$/,
  PRICE: /^\d+(\.\d{1,2})?$/,
  QUANTITY: /^\d+$/,
};

// Form Field Limits
export const FORM_LIMITS = {
  NAME_MIN: 2,
  NAME_MAX: 200,
  DESCRIPTION_MAX: 1000,
  PRICE_MIN: 0.01,
  PRICE_MAX: 1000000,
  QUANTITY_MIN: 0,
  QUANTITY_MAX: 1000000,
  PASSWORD_MIN: 8,
  PASSWORD_MAX: 128,
  USERNAME_MIN: 3,
  USERNAME_MAX: 30,
};

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PASSWORD: 'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character',
  PASSWORD_MISMATCH: 'Passwords do not match',
  INVALID_USERNAME: 'Username must be 3-30 characters and can only contain letters, numbers and underscores',
  INVALID_PRICE: 'Please enter a valid price',
  INVALID_QUANTITY: 'Quantity must be a positive number',
  MIN_LENGTH: (min) => `Must be at least ${min} characters`,
  MAX_LENGTH: (max) => `Cannot exceed ${max} characters`,
  MIN_VALUE: (min) => `Value must be at least ${min}`,
  MAX_VALUE: (max) => `Value cannot exceed ${max}`,
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  NOT_FOUND: 'Resource not found',
  SERVER_ERROR: 'Server error. Please try again later.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Login successful! Welcome back! 🍬',
  REGISTER: 'Account created successfully! Welcome to Sweet Shop! 🎉',
  LOGOUT: 'Logged out successfully',
  SWEET_CREATED: 'Sweet added successfully! 🍰',
  SWEET_UPDATED: 'Sweet updated successfully! ✨',
  SWEET_DELETED: 'Sweet deleted successfully! 🗑️',
  PURCHASE_SUCCESS: 'Purchase successful! Enjoy your sweet! 🛍️',
  RESTOCK_SUCCESS: 'Restock completed successfully! 📦',
  PROFILE_UPDATED: 'Profile updated successfully! 👤',
  PASSWORD_CHANGED: 'Password changed successfully! 🔒',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  MAX_PAGE_SIZE: 100,
};

// Sorting Options
export const SORT_OPTIONS = [
  { value: 'name', label: 'Name (A-Z)', field: 'name', order: 'asc' },
  { value: '-name', label: 'Name (Z-A)', field: 'name', order: 'desc' },
  { value: 'price', label: 'Price (Low to High)', field: 'price', order: 'asc' },
  { value: '-price', label: 'Price (High to Low)', field: 'price', order: 'desc' },
  { value: 'quantity', label: 'Quantity (Low to High)', field: 'quantity', order: 'asc' },
  { value: '-quantity', label: 'Quantity (High to Low)', field: 'quantity', order: 'desc' },
  { value: 'created_at', label: 'Newest First', field: 'created_at', order: 'desc' },
  { value: '-created_at', label: 'Oldest First', field: 'created_at', order: 'asc' },
];

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy hh:mm a',
  API: 'yyyy-MM-dd',
  API_WITH_TIME: "yyyy-MM-dd'T'HH:mm:ss",
  TIME: 'hh:mm a',
  RELATIVE: 'relative', // for date-fns formatDistance
};

// Theme Colors
export const THEME_COLORS = {
  PRIMARY: '#FF6B8B',
  SECONDARY: '#4ECDC4',
  ACCENT: '#FFD166',
  DARK: '#2A2D43',
  LIGHT: '#F7F9FC',
  SUCCESS: '#10B981',
  ERROR: '#EF4444',
  WARNING: '#F59E0B',
  INFO: '#3B82F6',
};

// Currency
export const CURRENCY = {
  SYMBOL: '₹',
  CODE: 'INR',
  NAME: 'Indian Rupee',
  DECIMAL_PLACES: 2,
};

// Feature Flags (for future features)
export const FEATURE_FLAGS = {
  ENABLE_ADVANCED_SEARCH: true,
  ENABLE_EXPORT: true,
  ENABLE_BULK_OPERATIONS: true,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_DARK_MODE: false,
  ENABLE_OFFLINE_MODE: false,
};

// Application Info
export const APP_INFO = {
  NAME: process.env.REACT_APP_APP_NAME || 'Sweet Shop Management',
  VERSION: process.env.REACT_APP_VERSION || '1.0.0',
  DESCRIPTION: 'A sweet shop management system for inventory and sales',
  AUTHOR: 'Sweet Shop Team',
  COPYRIGHT: `© ${new Date().getFullYear()} Sweet Shop Management. All rights reserved.`,
};