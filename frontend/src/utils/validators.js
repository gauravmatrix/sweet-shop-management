/**
 * Form Validation Utilities
 * Contains validation functions for form inputs
 */

import * as yup from 'yup';
import { VALIDATION_RULES, FORM_LIMITS, ERROR_MESSAGES } from './constants';

/**
 * Yup schema for user registration
 */
export const registerSchema = yup.object().shape({
  email: yup
    .string()
    .required(ERROR_MESSAGES.REQUIRED)
    .email(ERROR_MESSAGES.INVALID_EMAIL)
    .max(100, ERROR_MESSAGES.MAX_LENGTH(100)),
  
  username: yup
    .string()
    .required(ERROR_MESSAGES.REQUIRED)
    .min(FORM_LIMITS.USERNAME_MIN, ERROR_MESSAGES.MIN_LENGTH(FORM_LIMITS.USERNAME_MIN))
    .max(FORM_LIMITS.USERNAME_MAX, ERROR_MESSAGES.MAX_LENGTH(FORM_LIMITS.USERNAME_MAX))
    .matches(VALIDATION_RULES.USERNAME, ERROR_MESSAGES.INVALID_USERNAME),
  
  password: yup
    .string()
    .required(ERROR_MESSAGES.REQUIRED)
    .min(FORM_LIMITS.PASSWORD_MIN, ERROR_MESSAGES.MIN_LENGTH(FORM_LIMITS.PASSWORD_MIN))
    .max(FORM_LIMITS.PASSWORD_MAX, ERROR_MESSAGES.MAX_LENGTH(FORM_LIMITS.PASSWORD_MAX))
    .matches(VALIDATION_RULES.PASSWORD, ERROR_MESSAGES.INVALID_PASSWORD),
  
  password_confirm: yup
    .string()
    .required(ERROR_MESSAGES.REQUIRED)
    .oneOf([yup.ref('password'), null], ERROR_MESSAGES.PASSWORD_MISMATCH),
  
  first_name: yup
    .string()
    .max(50, ERROR_MESSAGES.MAX_LENGTH(50)),
  
  last_name: yup
    .string()
    .max(50, ERROR_MESSAGES.MAX_LENGTH(50)),
});

/**
 * Yup schema for user login
 */
export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required(ERROR_MESSAGES.REQUIRED)
    .email(ERROR_MESSAGES.INVALID_EMAIL),
  
  password: yup
    .string()
    .required(ERROR_MESSAGES.REQUIRED),
});

/**
 * Yup schema for sweet creation/update
 */
export const sweetSchema = yup.object().shape({
  name: yup
    .string()
    .required(ERROR_MESSAGES.REQUIRED)
    .min(FORM_LIMITS.NAME_MIN, ERROR_MESSAGES.MIN_LENGTH(FORM_LIMITS.NAME_MIN))
    .max(FORM_LIMITS.NAME_MAX, ERROR_MESSAGES.MAX_LENGTH(FORM_LIMITS.NAME_MAX))
    .trim(),
  
  description: yup
    .string()
    .max(FORM_LIMITS.DESCRIPTION_MAX, ERROR_MESSAGES.MAX_LENGTH(FORM_LIMITS.DESCRIPTION_MAX))
    .trim()
    .nullable(),
  
  category: yup
    .string()
    .required(ERROR_MESSAGES.REQUIRED)
    .oneOf(['chocolate', 'candy', 'cake', 'cookie', 'dessert', 'indian'], 'Please select a valid category'),
  
  price: yup
    .number()
    .required(ERROR_MESSAGES.REQUIRED)
    .min(FORM_LIMITS.PRICE_MIN, ERROR_MESSAGES.MIN_VALUE(FORM_LIMITS.PRICE_MIN))
    .max(FORM_LIMITS.PRICE_MAX, ERROR_MESSAGES.MAX_VALUE(FORM_LIMITS.PRICE_MAX))
    .typeError(ERROR_MESSAGES.INVALID_PRICE),
  
  quantity: yup
    .number()
    .required(ERROR_MESSAGES.REQUIRED)
    .min(FORM_LIMITS.QUANTITY_MIN, ERROR_MESSAGES.MIN_VALUE(FORM_LIMITS.QUANTITY_MIN))
    .max(FORM_LIMITS.QUANTITY_MAX, ERROR_MESSAGES.MAX_VALUE(FORM_LIMITS.QUANTITY_MAX))
    .integer('Quantity must be a whole number')
    .typeError(ERROR_MESSAGES.INVALID_QUANTITY),
  
  calories: yup
    .number()
    .min(0, 'Calories cannot be negative')
    .max(10000, 'Calories seem too high')
    .nullable()
    .typeError('Please enter a valid number for calories'),
  
  is_featured: yup
    .boolean()
    .default(false),
});

/**
 * Yup schema for profile update
 */
export const profileSchema = yup.object().shape({
  email: yup
    .string()
    .email(ERROR_MESSAGES.INVALID_EMAIL)
    .max(100, ERROR_MESSAGES.MAX_LENGTH(100)),
  
  username: yup
    .string()
    .min(FORM_LIMITS.USERNAME_MIN, ERROR_MESSAGES.MIN_LENGTH(FORM_LIMITS.USERNAME_MIN))
    .max(FORM_LIMITS.USERNAME_MAX, ERROR_MESSAGES.MAX_LENGTH(FORM_LIMITS.USERNAME_MAX))
    .matches(VALIDATION_RULES.USERNAME, ERROR_MESSAGES.INVALID_USERNAME),
  
  first_name: yup
    .string()
    .max(50, ERROR_MESSAGES.MAX_LENGTH(50))
    .nullable(),
  
  last_name: yup
    .string()
    .max(50, ERROR_MESSAGES.MAX_LENGTH(50))
    .nullable(),
  
  phone_number: yup
    .string()
    .matches(VALIDATION_RULES.PHONE, 'Please enter a valid phone number')
    .nullable(),
});

/**
 * Yup schema for password change
 */
export const passwordChangeSchema = yup.object().shape({
  old_password: yup
    .string()
    .required('Current password is required'),
  
  new_password: yup
    .string()
    .required('New password is required')
    .min(FORM_LIMITS.PASSWORD_MIN, ERROR_MESSAGES.MIN_LENGTH(FORM_LIMITS.PASSWORD_MIN))
    .max(FORM_LIMITS.PASSWORD_MAX, ERROR_MESSAGES.MAX_LENGTH(FORM_LIMITS.PASSWORD_MAX))
    .matches(VALIDATION_RULES.PASSWORD, ERROR_MESSAGES.INVALID_PASSWORD)
    .notOneOf([yup.ref('old_password'), null], 'New password must be different from old password'),
  
  new_password_confirm: yup
    .string()
    .required('Please confirm your new password')
    .oneOf([yup.ref('new_password'), null], 'Passwords do not match'),
});

/**
 * Yup schema for purchase
 */
export const purchaseSchema = yup.object().shape({
  quantity: yup
    .number()
    .required('Quantity is required')
    .min(1, 'Minimum purchase quantity is 1')
    .max(100, 'Maximum purchase quantity is 100')
    .integer('Quantity must be a whole number')
    .typeError('Please enter a valid quantity'),
});

/**
 * Yup schema for restock
 */
export const restockSchema = yup.object().shape({
  quantity: yup
    .number()
    .required('Quantity is required')
    .min(1, 'Minimum restock quantity is 1')
    .max(1000, 'Maximum restock quantity is 1000')
    .integer('Quantity must be a whole number')
    .typeError('Please enter a valid quantity'),
  
  reason: yup
    .string()
    .max(200, 'Reason cannot exceed 200 characters')
    .nullable(),
});

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateEmail = (email) => {
  if (!email) return ERROR_MESSAGES.REQUIRED;
  if (!VALIDATION_RULES.EMAIL.test(email)) return ERROR_MESSAGES.INVALID_EMAIL;
  return null;
};

/**
 * Validate password
 * @param {string} password - Password to validate
 * @returns {string|null} Error message or null if valid
 */
export const validatePassword = (password) => {
  if (!password) return ERROR_MESSAGES.REQUIRED;
  if (password.length < FORM_LIMITS.PASSWORD_MIN) {
    return ERROR_MESSAGES.MIN_LENGTH(FORM_LIMITS.PASSWORD_MIN);
  }
  if (!VALIDATION_RULES.PASSWORD.test(password)) {
    return ERROR_MESSAGES.INVALID_PASSWORD;
  }
  return null;
};

/**
 * Validate username
 * @param {string} username - Username to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateUsername = (username) => {
  if (!username) return ERROR_MESSAGES.REQUIRED;
  if (username.length < FORM_LIMITS.USERNAME_MIN) {
    return ERROR_MESSAGES.MIN_LENGTH(FORM_LIMITS.USERNAME_MIN);
  }
  if (!VALIDATION_RULES.USERNAME.test(username)) {
    return ERROR_MESSAGES.INVALID_USERNAME;
  }
  return null;
};

/**
 * Validate price
 * @param {number|string} price - Price to validate
 * @returns {string|null} Error message or null if valid
 */
export const validatePrice = (price) => {
  if (!price && price !== 0) return ERROR_MESSAGES.REQUIRED;
  
  const numPrice = parseFloat(price);
  if (isNaN(numPrice)) return ERROR_MESSAGES.INVALID_PRICE;
  if (numPrice < FORM_LIMITS.PRICE_MIN) {
    return ERROR_MESSAGES.MIN_VALUE(FORM_LIMITS.PRICE_MIN);
  }
  if (numPrice > FORM_LIMITS.PRICE_MAX) {
    return ERROR_MESSAGES.MAX_VALUE(FORM_LIMITS.PRICE_MAX);
  }
  return null;
};

/**
 * Validate quantity
 * @param {number|string} quantity - Quantity to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateQuantity = (quantity) => {
  if (!quantity && quantity !== 0) return ERROR_MESSAGES.REQUIRED;
  
  const numQuantity = parseInt(quantity);
  if (isNaN(numQuantity)) return ERROR_MESSAGES.INVALID_QUANTITY;
  if (numQuantity < FORM_LIMITS.QUANTITY_MIN) {
    return ERROR_MESSAGES.MIN_VALUE(FORM_LIMITS.QUANTITY_MIN);
  }
  if (numQuantity > FORM_LIMITS.QUANTITY_MAX) {
    return ERROR_MESSAGES.MAX_VALUE(FORM_LIMITS.QUANTITY_MAX);
  }
  if (!Number.isInteger(numQuantity)) {
    return 'Quantity must be a whole number';
  }
  return null;
};

/**
 * Validate sweet name
 * @param {string} name - Sweet name to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateSweetName = (name) => {
  if (!name) return ERROR_MESSAGES.REQUIRED;
  if (name.length < FORM_LIMITS.NAME_MIN) {
    return ERROR_MESSAGES.MIN_LENGTH(FORM_LIMITS.NAME_MIN);
  }
  if (name.length > FORM_LIMITS.NAME_MAX) {
    return ERROR_MESSAGES.MAX_LENGTH(FORM_LIMITS.NAME_MAX);
  }
  return null;
};

/**
 * Validate form data against schema
 * @param {Object} data - Form data
 * @param {yup.Schema} schema - Yup schema
 * @returns {Promise<Object>} Validated data or throws error
 */
export const validateForm = async (data, schema) => {
  try {
    return await schema.validate(data, { abortEarly: false });
  } catch (error) {
    const errors = {};
    if (error.inner) {
      error.inner.forEach(err => {
        errors[err.path] = err.message;
      });
    }
    throw errors;
  }
};

/**
 * Get validation errors for form
 * @param {Object} errors - Error object
 * @param {string} field - Field name
 * @returns {string} Error message or empty string
 */
export const getFieldError = (errors, field) => {
  return errors?.[field] || '';
};

/**
 * Check if form has any errors
 * @param {Object} errors - Error object
 * @returns {boolean} True if has errors
 */
export const hasFormErrors = (errors) => {
  return errors && Object.keys(errors).length > 0;
};

export default {
  registerSchema,
  loginSchema,
  sweetSchema,
  profileSchema,
  passwordChangeSchema,
  purchaseSchema,
  restockSchema,
  validateEmail,
  validatePassword,
  validateUsername,
  validatePrice,
  validateQuantity,
  validateSweetName,
  validateForm,
  getFieldError,
  hasFormErrors,
};