import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

  // Configure axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const fetchUserProfile = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/auth/profile/`);
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      if (error.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        setToken(null);
        setUser(null);
        toast.error('Session expired. Please login again.');
      }
    } finally {
      setLoading(false);
    }
  }, [token, API_URL]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/auth/login/`, {
        email,
        password
      });
      
      const { access, refresh, user: userData } = response.data;
      
      // Store tokens
      localStorage.setItem('token', access);
      localStorage.setItem('refreshToken', refresh);
      setToken(access);
      setUser(userData);
      
      // Configure axios headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      
      // Show success message
      const welcomeMessage = userData.is_admin 
        ? `Welcome Admin ${userData.username}! 👑`
        : `Welcome ${userData.username}! 🍬`;
      toast.success(welcomeMessage);
      
      // Navigate based on role
      if (userData.is_admin) {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
      
      return { success: true, data: userData };
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.non_field_errors?.[0] || 
                          'Login failed. Please check your credentials.';
      toast.error(errorMessage);
      return { 
        success: false, 
        error: errorMessage,
        details: error.response?.data 
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/auth/register/`, {
        email: userData.email,
        username: userData.username,
        password: userData.password,
        password_confirm: userData.passwordConfirm,
        is_admin: userData.isAdmin || false
      });
      
      const { access, refresh, user: newUser } = response.data;
      
      // Store tokens
      localStorage.setItem('token', access);
      localStorage.setItem('refreshToken', refresh);
      setToken(access);
      setUser(newUser);
      
      // Configure axios headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      
      // Show success message
      toast.success(`Account created successfully, ${newUser.username}! 🎉`);
      
      // Navigate based on role
      if (newUser.is_admin) {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
      
      return { success: true, data: newUser };
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle validation errors
      if (error.response?.data) {
        const errors = error.response.data;
        Object.entries(errors).forEach(([field, messages]) => {
          if (Array.isArray(messages)) {
            messages.forEach(message => toast.error(`${field}: ${message}`));
          } else {
            toast.error(`${field}: ${messages}`);
          }
        });
      } else {
        toast.error('Registration failed. Please try again.');
      }
      
      return { 
        success: false, 
        error: error.response?.data || 'Registration failed',
        details: error.response?.data 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint if token exists
      if (token) {
        await axios.post(`${API_URL}/auth/logout/`, {
          refresh: localStorage.getItem('refreshToken')
        });
      }
    } catch (error) {
      console.warn('Logout API error:', error);
      // Continue with client-side logout even if API fails
    } finally {
      // Clear client-side state
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      setToken(null);
      setUser(null);
      delete axios.defaults.headers.common['Authorization'];
      
      toast.success('Logged out successfully');
      navigate('/login');
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      const response = await axios.put(`${API_URL}/auth/profile/update/`, profileData);
      const updatedUser = response.data.user || response.data;
      setUser(updatedUser);
      toast.success('Profile updated successfully! ✨');
      return { success: true, data: updatedUser };
    } catch (error) {
      console.error('Profile update error:', error);
      const errorMessage = error.response?.data?.detail || 
                          'Failed to update profile. Please try again.';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (passwordData) => {
    try {
      setLoading(true);
      await axios.post(`${API_URL}/auth/profile/change-password/`, passwordData);
      toast.success('Password changed successfully! 🔒');
      return { success: true };
    } catch (error) {
      console.error('Password change error:', error);
      const errorMessage = error.response?.data?.old_password?.[0] || 
                          error.response?.data?.detail || 
                          'Failed to change password. Please try again.';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axios.post(`${API_URL}/auth/refresh/`, {
        refresh: refreshToken
      });
      
      const { access } = response.data;
      localStorage.setItem('token', access);
      setToken(access);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      
      return { success: true, token: access };
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Force logout if refresh fails
      logout();
      return { success: false, error: 'Session expired. Please login again.' };
    }
  };

  const isAuthenticated = !!user && !!token;
  const isAdmin = user?.is_admin || false;

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    refreshToken,
    refreshUser: fetchUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};