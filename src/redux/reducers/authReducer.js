import { createSlice } from '@reduxjs/toolkit';
import { LOADING_STATES } from '../../utils/constants';

const initialState = {
  user: null,
  token: localStorage.getItem('adminToken'),
  isAuthenticated: false,
  status: LOADING_STATES.IDLE,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Login actions
    loginStart: (state) => {
      state.status = LOADING_STATES.LOADING;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.status = LOADING_STATES.SUCCEEDED;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      // Store token in localStorage
      localStorage.setItem('adminToken', action.payload.token);
    },
    loginFailure: (state, action) => {
      state.status = LOADING_STATES.FAILED;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = action.payload;
      // Remove token from localStorage
      localStorage.removeItem('adminToken');
    },
    
    // Logout action
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.status = LOADING_STATES.IDLE;
      state.error = null;
      // Remove token from localStorage
      localStorage.removeItem('adminToken');
    },
    
    // Clear errors
    clearError: (state) => {
      state.error = null;
    },
    
    // Set user from token (for auto-login)
    setUser: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
  setUser,
} = authSlice.actions;

export default authSlice.reducer;
