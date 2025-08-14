import axios from 'axios';
import {
  sendContactStart,
  sendContactSuccess,
  sendContactFailure,
  fetchContactsRequest,
  fetchContactsSuccess,
  fetchContactsFailure,
  fetchContactStatsSuccess,
  updateContactRequest,
  updateContactSuccess,
  updateContactFailure,
  deleteContactRequest,
  deleteContactSuccess,
  deleteContactFailure,
  resetContactForm,
} from '../reducers/contactReducer';

// API Base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create axios instance for contact
const contactAPI = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
contactAPI.interceptors.request.use(
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
contactAPI.interceptors.response.use(
  (response) => {
    // ✅ Improved: Better response handling
    if (response.data.success) {
      return response.data;
    }
    return response.data;
  },
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
const contactAPIService = {
  send: (data) => contactAPI.post('/contact/submit', data),
  getAll: (params) => contactAPI.get('/contact/admin', { params }),
  getById: (id) => contactAPI.get(`/contact/${id}`),
  update: (id, data) => contactAPI.put(`/contact/${id}`, data),
  delete: (id) => contactAPI.delete(`/contact/${id}`),
  getStats: () => contactAPI.get('/contact/admin/stats'), // ✅ Fixed: Correct path
};

// ✅ Enhanced: getContactMessages now properly updates Redux state
export const getContactMessages = (params = {}) => async (dispatch) => {
  try {
    dispatch(fetchContactsRequest()); // ✅ Use correct action
    const response = await contactAPIService.getAll(params);
    
    // Extract contacts data correctly
    const contacts = response?.data || [];
    
    // ✅ Dispatch to store in Redux state (this was missing!)
    dispatch(fetchContactsSuccess(contacts));
    
    return { success: true, data: contacts };
  } catch (error) {
    const errorMessage = error.message || 'Failed to load contact messages';
    dispatch(fetchContactsFailure(errorMessage));
    return { success: false, error: errorMessage };
  }
};

// ✅ Enhanced: getContactStats now properly updates Redux state
export const getContactStats = () => async (dispatch) => {
  try {
    const response = await contactAPIService.getStats();
    const stats = response?.data || {};
    
    // ✅ Store stats in Redux state (this was missing!)
    dispatch(fetchContactStatsSuccess(stats));
    
    return { success: true, data: stats };
  } catch (error) {
    const errorMessage = error.message || 'Failed to load contact statistics';
    console.error('Contact stats error:', error);
    return { success: false, error: errorMessage };
  }
};

// ✅ Enhanced: updateContactMessage now properly updates Redux state
export const updateContactMessage = (id, updateData) => async (dispatch) => {
  try {
    dispatch(updateContactRequest());
    const response = await contactAPIService.update(id, updateData);
    const updatedContact = response?.data || response;
    
    // ✅ Update in Redux state (this was missing!)
    dispatch(updateContactSuccess(updatedContact));
    
    return { success: true, data: updatedContact };
  } catch (error) {
    const errorMessage = error.message || 'Failed to update contact message';
    dispatch(updateContactFailure(errorMessage));
    return { success: false, error: errorMessage };
  }
};

// ✅ Enhanced: deleteContactMessage now properly updates Redux state
export const deleteContactMessage = (id) => async (dispatch) => {
  try {
    dispatch(deleteContactRequest());
    await contactAPIService.delete(id);
    
    // ✅ Remove from Redux state (this was missing!)
    dispatch(deleteContactSuccess(id));
    
    return { success: true };
  } catch (error) {
    const errorMessage = error.message || 'Failed to delete contact message';
    dispatch(deleteContactFailure(errorMessage));
    return { success: false, error: errorMessage };
  }
};

// ✅ Enhanced: getContactMessage for single message
export const getContactMessage = (id) => async (dispatch) => {
  try {
    dispatch(fetchContactsRequest());
    const response = await contactAPIService.getById(id);
    const contact = response?.data || response;
    dispatch(fetchContactsSuccess([contact])); // Store as array for consistency
    return { success: true, data: contact };
  } catch (error) {
    const errorMessage = error.message || 'Failed to load contact message';
    dispatch(fetchContactsFailure(errorMessage));
    return { success: false, error: errorMessage };
  }
};

// Contact form submission (unchanged but improved error handling)
export const sendContactForm = (formData) => async (dispatch) => {
  try {
    dispatch(sendContactStart());
    const response = await contactAPIService.send(formData);
    const message = response?.message || 'Message sent successfully!';
    dispatch(sendContactSuccess(message));
    
    // ✅ Refresh contact list after new submission
    dispatch(getContactMessages());
    
  } catch (error) {
    let errorMessage = 'Failed to send message';
    if (error.response) {
      errorMessage = error.response.data?.message || 
                    error.response.data?.error || 
                    `Server error: ${error.response.status}`;
    } else if (error.request) {
      errorMessage = 'Network error. Please check your internet connection and try again.';
    } else {
      errorMessage = error.message || 'An unexpected error occurred';
    }
    console.error('Contact form error:', error);
    dispatch(sendContactFailure(errorMessage));
  }
};

// Clear contact form
export const clearContactForm = () => (dispatch) => {
  dispatch(resetContactForm());
};

// ✅ New: Bulk actions for better dashboard management
export const markAsRead = (id) => async (dispatch) => {
  return dispatch(updateContactMessage(id, { isRead: true, read: true }));
};

export const markAsUnread = (id) => async (dispatch) => {
  return dispatch(updateContactMessage(id, { isRead: false, read: false }));
};

export const markAsReplied = (id) => async (dispatch) => {
  return dispatch(updateContactMessage(id, { status: 'replied' }));
};

// ✅ New: Refresh all contact data (useful for dashboard)
export const refreshContactData = () => async (dispatch) => {
  try {
    await Promise.all([
      dispatch(getContactMessages()),
      dispatch(getContactStats())
    ]);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
