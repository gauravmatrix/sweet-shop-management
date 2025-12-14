/**
 * Utility Helper Functions
 * Reusable functions used throughout the application
 */

import { format, formatDistance, parseISO } from 'date-fns';
import { SWEET_CATEGORIES, CURRENCY, STOCK_STATUS, DATE_FORMATS } from './constants';

/**
 * Format price with currency symbol
 * @param {number} price - The price to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted price string
 */
export const formatPrice = (price, decimals = 2) => {
  if (price === null || price === undefined || isNaN(price)) {
    return `${CURRENCY.SYMBOL}0.00`;
  }
  
  const formattedPrice = parseFloat(price).toFixed(decimals);
  return `${CURRENCY.SYMBOL}${formattedPrice}`;
};

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @param {string} formatStr - Date format string
 * @returns {string} Formatted date
 */
export const formatDate = (date, formatStr = DATE_FORMATS.DISPLAY) => {
  if (!date) return 'N/A';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr);
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid Date';
  }
};

/**
 * Get relative time (e.g., "2 hours ago")
 * @param {string|Date} date - Date to calculate relative time from
 * @returns {string} Relative time string
 */
export const getRelativeTime = (date) => {
  if (!date) return 'N/A';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatDistance(dateObj, new Date(), { addSuffix: true });
  } catch (error) {
    console.error('Relative time error:', error);
    return 'N/A';
  }
};

/**
 * Get category display information
 * @param {string} categoryValue - Category value
 * @returns {Object} Category object with label, color, and icon
 */
export const getCategoryInfo = (categoryValue) => {
  const category = SWEET_CATEGORIES.find(cat => cat.value === categoryValue);
  return category || { 
    value: categoryValue, 
    label: categoryValue?.charAt(0).toUpperCase() + categoryValue?.slice(1) || 'Unknown',
    color: '#9CA3AF',
    icon: '🍭'
  };
};

/**
 * Get stock status based on quantity
 * @param {number} quantity - Current stock quantity
 * @returns {Object} Stock status object
 */
export const getStockStatus = (quantity) => {
  if (quantity > 10) return STOCK_STATUS.AVAILABLE;
  if (quantity > 0 && quantity <= 10) return STOCK_STATUS.LOW_STOCK;
  return STOCK_STATUS.OUT_OF_STOCK;
};

/**
 * Calculate total value of inventory
 * @param {number} price - Price per unit
 * @param {number} quantity - Quantity in stock
 * @returns {number} Total value
 */
export const calculateTotalValue = (price, quantity) => {
  return parseFloat(price) * parseInt(quantity);
};

/**
 * Debounce function for performance optimization
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function for performance optimization
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Deep clone an object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.reduce((arr, item, i) => {
    arr[i] = deepClone(item);
    return arr;
  }, []);
  if (typeof obj === 'object') return Object.keys(obj).reduce((newObj, key) => {
    newObj[key] = deepClone(obj[key]);
    return newObj;
  }, {});
  return obj;
};

/**
 * Safe JSON parse with error handling
 * @param {string} str - JSON string to parse
 * @param {any} defaultValue - Default value if parsing fails
 * @returns {any} Parsed value or default
 */
export const safeJsonParse = (str, defaultValue = null) => {
  try {
    return JSON.parse(str);
  } catch (error) {
    console.error('JSON parse error:', error);
    return defaultValue;
  }
};

/**
 * Generate unique ID
 * @returns {string} Unique ID
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {boolean} True if valid
 */
export const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Format file size
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Create query string from object
 * @param {Object} params - Query parameters
 * @returns {string} Query string
 */
export const createQueryString = (params) => {
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => queryParams.append(key, item));
      } else {
        queryParams.append(key, value);
      }
    }
  });
  
  return queryParams.toString();
};

/**
 * Get initials from name
 * @param {string} name - Full name
 * @returns {string} Initials
 */
export const getInitials = (name) => {
  if (!name) return 'U';
  
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2);
};

/**
 * Calculate percentage
 * @param {number} value - Current value
 * @param {number} total - Total value
 * @returns {number} Percentage
 */
export const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

/**
 * Sleep/wait function
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Promise that resolves after ms
 */
export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Capitalize first letter of each word
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalizeWords = (str) => {
  if (!str) return '';
  return str.replace(/\b\w/g, char => char.toUpperCase());
};