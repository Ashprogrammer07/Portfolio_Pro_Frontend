import { 
  fetchSkillsRequest,
  fetchSkillsSuccess,
  fetchSkillsFailure,
  addSkillRequest,
  addSkillSuccess,
  addSkillFailure,
  updateSkillRequest,
  updateSkillSuccess,
  updateSkillFailure,
  deleteSkillRequest,
  deleteSkillSuccess,
  deleteSkillFailure,
  fetchSkillStatsRequest,
  fetchSkillStatsSuccess,
  fetchSkillStatsFailure
} from '../reducers/skillsReducer';

import { LOADING_STATES } from '../../utils/constants';

const getAuthToken = () => {
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
};

const getApiUrl = () => {
  return process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
};

export const fetchSkills = (force = false) => async (dispatch, getState) => {
  try {
    const currentStatus = getState().skills?.status;
    
    if (currentStatus === LOADING_STATES.LOADING && !force) {
      return { success: true, data: getState().skills?.skills || [] };
    }
    
    dispatch(fetchSkillsRequest());
    
    const response = await fetch(`${getApiUrl()}/skills?timestamp=${Date.now()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch skills');
    }
    
    const skillsData = Array.isArray(data.data) ? data.data : [];
    
    dispatch(fetchSkillsSuccess(skillsData));
    
    return { success: true, data: skillsData };
  } catch (error) {
    console.error('Error fetching skills:', error);
    dispatch(fetchSkillsFailure(error.message));
    return { success: false, error: error.message };
  }
};

export const addSkill = (skillData) => async (dispatch) => {
  try {
    dispatch(addSkillRequest());

    const token = getAuthToken();
    
    const response = await fetch(`${getApiUrl()}/skills/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({
        ...skillData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }),
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to add skill');
    }
    
    dispatch(addSkillSuccess(data.data));
    
    return { success: true, data };
  } catch (error) {
    console.error('Error adding skill:', error);
    dispatch(addSkillFailure(error.message));
    return { success: false, error: error.message };
  }
};

export const updateSkill = (skillData) => async (dispatch) => {
  try {
    dispatch(updateSkillRequest());
    
    const { _id, ...updateData } = skillData;
    const token = getAuthToken();
    
    const response = await fetch(`${getApiUrl()}/skills/${_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({
        ...updateData,
        updatedAt: new Date().toISOString()
      }),
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to update skill');
    }
    
    dispatch(updateSkillSuccess(data.data));
    
    return { success: true, data };
  } catch (error) {
    console.error('Error updating skill:', error);
    dispatch(updateSkillFailure(error.message));
    return { success: false, error: error.message };
  }
};

export const deleteSkill = (skillId) => async (dispatch) => {
  try {
    dispatch(deleteSkillRequest());

    const token = getAuthToken();
    
    const response = await fetch(`${getApiUrl()}/skills/${skillId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to delete skill');
    }
    
    dispatch(deleteSkillSuccess(skillId));
    
    return { success: true, data };
  } catch (error) {
    console.error('Error deleting skill:', error);
    dispatch(deleteSkillFailure(error.message));
    return { success: false, error: error.message };
  }
};

export const fetchSkillStats = () => async (dispatch) => {
  try {
    dispatch(fetchSkillStatsRequest());

    const token = getAuthToken();
    
    const response = await fetch(`${getApiUrl()}/skills/admin/stats?timestamp=${Date.now()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch skill statistics');
    }
    
    dispatch(fetchSkillStatsSuccess(data.data));
    
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching skill stats:', error);
    dispatch(fetchSkillStatsFailure(error.message));
    return { success: false, error: error.message };
  }
};
