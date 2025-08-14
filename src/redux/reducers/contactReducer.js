import { createSlice } from '@reduxjs/toolkit';
import { LOADING_STATES } from '../../utils/constants';

const initialState = {
  status: LOADING_STATES.IDLE,
  message: null,
  error: null,
  contacts: [], // ✅ Add contacts array to store message data
  contactStats: {}, // ✅ Add stats object for dashboard
};

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    // Send contact form
    sendContactStart: (state) => {
      state.status = LOADING_STATES.LOADING;
      state.error = null;
      state.message = null;
    },
    sendContactSuccess: (state, action) => {
      state.status = LOADING_STATES.SUCCEEDED;
      state.message = action.payload;
    },
    sendContactFailure: (state, action) => {
      state.status = LOADING_STATES.FAILED;
      state.error = action.payload;
    },
    
    // ✅ Add missing actions for contact management
    fetchContactsRequest: (state) => {
      state.status = LOADING_STATES.LOADING;
      state.error = null;
    },
    fetchContactsSuccess: (state, action) => {
      state.status = LOADING_STATES.SUCCEEDED;
      state.contacts = action.payload; // Store contacts data
      state.error = null;
    },
    fetchContactsFailure: (state, action) => {
      state.status = LOADING_STATES.FAILED;
      state.error = action.payload;
    },
    
    // Contact stats management
    fetchContactStatsSuccess: (state, action) => {
      state.contactStats = action.payload; // Store stats data
    },
    
    // Update single contact
    updateContactRequest: (state) => {
      state.status = LOADING_STATES.LOADING;
      state.error = null;
    },
    updateContactSuccess: (state, action) => {
      state.status = LOADING_STATES.SUCCEEDED;
      state.contacts = state.contacts.map(contact => 
        contact._id === action.payload._id ? action.payload : contact
      );
      state.error = null;
    },
    updateContactFailure: (state, action) => {
      state.status = LOADING_STATES.FAILED;
      state.error = action.payload;
    },
    
    // Delete contact
    deleteContactRequest: (state) => {
      state.status = LOADING_STATES.LOADING;
      state.error = null;
    },
    deleteContactSuccess: (state, action) => {
      state.status = LOADING_STATES.SUCCEEDED;
      state.contacts = state.contacts.filter(contact => contact._id !== action.payload);
      state.error = null;
    },
    deleteContactFailure: (state, action) => {
      state.status = LOADING_STATES.FAILED;
      state.error = action.payload;
    },
    
    // Reset contact form
    resetContactForm: (state) => {
      state.status = LOADING_STATES.IDLE;
      state.message = null;
      state.error = null;
    },

    // ✅ Add action to clear contacts (useful for logout)
    clearContacts: (state) => {
      state.contacts = [];
      state.contactStats = {};
      state.status = LOADING_STATES.IDLE;
      state.error = null;
      state.message = null;
    },
  },
});

export const {
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
  clearContacts,
} = contactSlice.actions;

export default contactSlice.reducer;
