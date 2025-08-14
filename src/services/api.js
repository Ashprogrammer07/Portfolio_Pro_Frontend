import axios from 'axios';

// API Base URL - matching your backend port
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create main axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle responses and errors consistently
api.interceptors.response.use(
  (response) => {
    // Your backend returns: { success: true, data: [...], message: "..." }
    return response.data;
  },
  (error) => {
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        error.message || 
                        'Something went wrong';
    
    console.error('API Error:', errorMessage);
    
    // Return structured error object
    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      response: error.response,
    });
  }
);

// ===========================
// PROJECT API ENDPOINTS
// ===========================
export const projectsAPI = {
  // GET /api/projects - Get all projects
  getAll: () => api.get('/projects'),
  
  // GET /api/projects/:id - Get single project
  getById: (id) => api.get(`/projects/${id}`),
  
  // POST /api/projects/create - Create new project (Admin only)
  create: (formData) => {
    const config = { 
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30000 // Longer timeout for file uploads
    };
    return api.post('/projects/create', formData, config);
  },
  
  // PUT /api/projects/:id - Update project (Admin only)
  update: (id, data) => api.put(`/projects/${id}`, data),
  
  // DELETE /api/projects/:id - Delete project (Admin only)
  delete: (id) => api.delete(`/projects/${id}`),
  
  // Additional filtering endpoints (if implemented in backend)
  getFeatured: () => api.get('/projects?featured=true'),
  getByCategory: (category) => api.get(`/projects?category=${encodeURIComponent(category)}`),
  getByStatus: (status) => api.get(`/projects?status=${encodeURIComponent(status)}`),
};

// ===========================
// CONTACT API ENDPOINTS
// ===========================
export const contactAPI = {
  // POST /api/contact/submit - Send contact form
  send: (data) => api.post('/contact/submit', data),
  
  // Admin endpoints for contact management
  getAll: (params) => api.get('/contact/admin', { params }),
  getById: (id) => api.get(`/contact/${id}`),
  update: (id, data) => api.put(`/contact/${id}`, data),
  delete: (id) => api.delete(`/contact/${id}`),
  getStats: () => api.get('/contact/stats'),
  
  // Mark contact as read/unread
  markAsRead: (id) => api.put(`/contact/${id}`, { isRead: true }),
  markAsUnread: (id) => api.put(`/contact/${id}`, { isRead: false }),
};

// ===========================
// ADMIN API ENDPOINTS
// ===========================
export const adminAPI = {
  // POST /api/admin/login - Admin login
  login: (credentials) => api.post('/admin/login', credentials),
  
  // Admin profile management
  getProfile: (id) => api.get(`/admin/profile/${id}`),
  updateProfile: (data) => api.put('/admin/profile', data),
  changePassword: (data) => api.put('/admin/change-password', data),
  
  // Dashboard and statistics
  getDashboard: () => api.get('/admin/dashboard'),
  getStats: () => api.get('/admin/stats'),
  
  // Initial admin creation
  createInitial: (data) => api.post('/admin/createinitial', data),
  
  // Token verification (if implemented)
  verifyToken: () => api.get('/admin/verify'),
};

// ===========================
// FILE UPLOAD UTILITIES
// ===========================
export const uploadAPI = {
  // Upload single image
  uploadSingle: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload/single', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  // Upload multiple images
  uploadMultiple: (files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });
    return api.post('/upload/multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
};

// ===========================
// UTILITY FUNCTIONS
// ===========================

// Get file URL helper
export const getFileUrl = (filename) => {
  return `${process.env.REACT_APP_SERVER_URL || 'http://localhost:8000'}/uploads/${filename}`;
};

// Error handler utility
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    return {
      type: 'server',
      message: error.response.data?.message || 'Server error occurred',
      status: error.response.status
    };
  } else if (error.request) {
    // Request made but no response
    return {
      type: 'network',
      message: 'Network error - please check your connection and ensure the backend is running on port 8000',
      status: null
    };
  } else {
    // Something else happened
    return {
      type: 'unknown',
      message: error.message || 'An unexpected error occurred',
      status: null
    };
  }
};

// API health check
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: handleApiError(error) };
  }
};

// ===========================
// EXPORTS
// ===========================

// Default export for general use
export default api;

// Named exports for specific features
export {
  projectsAPI as projects,
  contactAPI as contacts, 
  adminAPI as admin,
  uploadAPI as uploads
};

// Alternative usage patterns for flexibility
export const apiService = {
  projects: projectsAPI,
  contacts: contactAPI,
  admin: adminAPI,
  uploads: uploadAPI,
  utils: {
    getFileUrl,
    handleApiError,
    healthCheck
  }
};
// Add this to your existing API service
export const skillsAPI = {
  getAll: () => api.get('/skills/'),
  create: (data) => api.post('/skills/create', data),
  update: (id, data) => api.put(`/skills/${id}`, data),
  delete: (id) => api.delete(`/skills/${id}`),
};

