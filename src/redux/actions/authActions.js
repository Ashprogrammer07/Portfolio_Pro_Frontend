import axios from 'axios';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  setUser,
  logout,
  clearError,
} from '../reducers/authReducer';

// API Base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create axios instance for auth
const authAPI = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
authAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
authAPI.interceptors.response.use(
  (response) => response.data.success ? response.data.data : response.data,
  (error) => {
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      response: error.response,
    });
  }
);

// API Service Functions
const adminAPIService = {
  login: (credentials) => authAPI.post('/admin/login', credentials),
  getProfile: (id) => authAPI.get(`/admin/profile/${id}`),
  updateProfile: (data) => authAPI.put('/admin/profile', data),
  changePassword: (data) => authAPI.put('/admin/change-password', data),
  getDashboard: () => authAPI.get('/admin/dashboard'),
  createInitial: (data) => authAPI.post('/admin/createinitial', data),
  verifyToken: () => authAPI.get('/admin/verify'),
};

// Action Creators
export const adminLogin = (credentials) => async (dispatch) => {
  try {
    dispatch(loginStart());
    const response = await adminAPIService.login(credentials);
    
    dispatch(loginSuccess({
      user: response.user,
      token: response.token,
    }));
  } catch (error) {
    let errorMessage = 'Login failed';
    if (error.response) {
      errorMessage = error.response.data?.message || 
                    error.response.data?.error || 
                    `Server error: ${error.response.status}`;
    } else if (error.request) {
      errorMessage = 'Network error. Please check your internet connection and try again.';
    } else {
      errorMessage = error.message || 'An unexpected error occurred';
    }
    console.error('Login error:', error);
    dispatch(loginFailure(errorMessage));
  }
};

export const checkAuthStatus = () => async (dispatch) => {
  const token = localStorage.getItem('adminToken');
  
  if (token) {
    try {
      const response = await adminAPIService.verifyToken();
      dispatch(setUser(response.user));
    } catch (error) {
      localStorage.removeItem('adminToken');
      dispatch(loginFailure('Session expired'));
    }
  }
};

export const getAdminProfile = (id) => async (dispatch) => {
  try {
    const response = await adminAPIService.getProfile(id);
    return { success: true, data: response };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        'Failed to load profile';
    return { success: false, error: errorMessage };
  }
};

export const updateAdminProfile = (data) => async (dispatch) => {
  try {
    const response = await adminAPIService.updateProfile(data);
    dispatch(setUser(response.user));
    return { success: true, data: response };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        'Failed to update profile';
    return { success: false, error: errorMessage };
  }
};

export const changeAdminPassword = (data) => async (dispatch) => {
  try {
    await adminAPIService.changePassword(data);
    return { success: true, message: 'Password changed successfully' };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        'Failed to change password';
    return { success: false, error: errorMessage };
  }
};

export const getDashboardStats = () => async (dispatch) => {
  try {
    const response = await adminAPIService.getDashboard();
    return { success: true, data: response };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        'Failed to load dashboard stats';
    return { success: false, error: errorMessage };
  }
};

export const logoutAdmin = () => (dispatch) => {
  dispatch(logout());
};

export const clearAuthError = () => (dispatch) => {
  dispatch(clearError());
};
