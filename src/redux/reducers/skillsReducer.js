import { createSlice } from '@reduxjs/toolkit';
import { LOADING_STATES } from '../../utils/constants';

const initialState = {
  status: LOADING_STATES.IDLE,
  skills: [],
  skillStats: {},
  error: null,
  lastUpdated: null,
  totalSkills: 0,
  totalCategories: 0,
};

const skillsSlice = createSlice({
  name: 'skills',
  initialState,
  reducers: {
    fetchSkillsRequest: (state) => {
      state.status = LOADING_STATES.LOADING;
      state.error = null;
    },
    fetchSkillsSuccess: (state, action) => {
      state.status = LOADING_STATES.SUCCEEDED;
      
      const skillsData = Array.isArray(action.payload) ? action.payload : [];
      
      state.skills = skillsData;
      state.error = null;
      state.lastUpdated = new Date().toISOString();
      
      state.totalSkills = state.skills.reduce((total, category) => {
        return total + (Array.isArray(category.items) ? category.items.length : 0);
      }, 0);
      state.totalCategories = state.skills.length;
    },
    fetchSkillsFailure: (state, action) => {
      state.status = LOADING_STATES.FAILED;
      state.error = action.payload;
    },
    
    addSkillRequest: (state) => {
      state.status = LOADING_STATES.LOADING;
      state.error = null;
    },
    addSkillSuccess: (state, action) => {
      state.status = LOADING_STATES.SUCCEEDED;
      const newSkill = action.payload;
      const categoryIndex = state.skills.findIndex(cat => cat.category === newSkill.category);
      
      if (categoryIndex >= 0) {
        if (!Array.isArray(state.skills[categoryIndex].items)) {
          state.skills[categoryIndex].items = [];
        }
        state.skills[categoryIndex].items.push(newSkill);
      } else {
        state.skills.push({
          category: newSkill.category,
          icon: newSkill.icon || '🔧',
          items: [newSkill]
        });
      }
      
      state.totalSkills = state.skills.reduce((total, category) => {
        return total + (Array.isArray(category.items) ? category.items.length : 0);
      }, 0);
      state.totalCategories = state.skills.length;
      
      state.error = null;
      state.lastUpdated = new Date().toISOString();
    },
    addSkillFailure: (state, action) => {
      state.status = LOADING_STATES.FAILED;
      state.error = action.payload;
    },
    
    updateSkillRequest: (state) => {
      state.status = LOADING_STATES.LOADING;
      state.error = null;
    },
    updateSkillSuccess: (state, action) => {
      state.status = LOADING_STATES.SUCCEEDED;
      const updatedSkill = action.payload;
      
      state.skills.forEach(category => {
        if (Array.isArray(category.items)) {
          const skillIndex = category.items.findIndex(skill => skill._id === updatedSkill._id);
          if (skillIndex >= 0) {
            category.items[skillIndex] = {
              ...category.items[skillIndex],
              ...updatedSkill,
              updatedAt: new Date().toISOString()
            };
          }
        }
      });
      
      state.error = null;
      state.lastUpdated = new Date().toISOString();
    },
    updateSkillFailure: (state, action) => {
      state.status = LOADING_STATES.FAILED;
      state.error = action.payload;
    },
    
    deleteSkillRequest: (state) => {
      state.status = LOADING_STATES.LOADING;
      state.error = null;
    },
    deleteSkillSuccess: (state, action) => {
      state.status = LOADING_STATES.SUCCEEDED;
      const skillId = action.payload;
      
      state.skills.forEach(category => {
        if (Array.isArray(category.items)) {
          category.items = category.items.filter(skill => skill._id !== skillId);
        }
      });
      
      state.skills = state.skills.filter(category => 
        Array.isArray(category.items) && category.items.length > 0
      );
      
      state.totalSkills = state.skills.reduce((total, category) => {
        return total + (Array.isArray(category.items) ? category.items.length : 0);
      }, 0);
      state.totalCategories = state.skills.length;
      
      state.error = null;
      state.lastUpdated = new Date().toISOString();
    },
    deleteSkillFailure: (state, action) => {
      state.status = LOADING_STATES.FAILED;
      state.error = action.payload;
    },
    
    fetchSkillStatsRequest: (state) => {
      state.error = null;
    },
    fetchSkillStatsSuccess: (state, action) => {
      state.skillStats = {
        ...action.payload,
        lastUpdated: new Date().toISOString()
      };
      state.error = null;
    },
    fetchSkillStatsFailure: (state, action) => {
      state.error = action.payload;
    },
    
    updateSkillOrder: (state, action) => {
      const { categoryIndex, oldIndex, newIndex } = action.payload;
      
      if (state.skills[categoryIndex] && Array.isArray(state.skills[categoryIndex].items)) {
        const items = state.skills[categoryIndex].items;
        const [movedItem] = items.splice(oldIndex, 1);
        items.splice(newIndex, 0, movedItem);
      }
    },
    
    toggleSkillActive: (state, action) => {
      const { skillId, isActive } = action.payload;
      
      state.skills.forEach(category => {
        if (Array.isArray(category.items)) {
          const skillIndex = category.items.findIndex(skill => skill._id === skillId);
          if (skillIndex >= 0) {
            category.items[skillIndex].isActive = isActive;
            category.items[skillIndex].updatedAt = new Date().toISOString();
          }
        }
      });
    },
    
    updateCategoryIcon: (state, action) => {
      const { category, icon } = action.payload;
      const categoryIndex = state.skills.findIndex(cat => cat.category === category);
      
      if (categoryIndex >= 0) {
        state.skills[categoryIndex].icon = icon;
      }
    },
    
    resetSkills: (state) => {
      state.status = LOADING_STATES.IDLE;
      state.skills = [];
      state.skillStats = {};
      state.error = null;
      state.lastUpdated = null;
      state.totalSkills = 0;
      state.totalCategories = 0;
    },
    
    setSkillsLoading: (state, action) => {
      state.status = action.payload ? LOADING_STATES.LOADING : LOADING_STATES.IDLE;
    },
  },
});

export const {
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
  fetchSkillStatsFailure,
  updateSkillOrder,
  toggleSkillActive,
  updateCategoryIcon,
  resetSkills,
  setSkillsLoading,
} = skillsSlice.actions;

export default skillsSlice.reducer;
