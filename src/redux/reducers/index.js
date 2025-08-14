import { combineReducers } from '@reduxjs/toolkit';
import uiReducer from './uiReducer';
import projectReducer from './projectReducer';
import contactReducer from './contactReducer';
import authReducer from './authReducer';
import skillsReducer from './skillsReducer'; // Add this

const rootReducer = combineReducers({
  ui: uiReducer,
  projects: projectReducer,
  contact: contactReducer,
  auth: authReducer,
  skills: skillsReducer, // Add this
});

export default rootReducer;
