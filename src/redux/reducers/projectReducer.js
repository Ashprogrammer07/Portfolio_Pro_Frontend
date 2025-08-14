// In your projectReducer.js
import { PROJECT_ACTIONS } from '../actions/projectActions';

const initialState = {
  projects: [],
  status: 'idle',
  error: null,
  projectStats: {},
  featuredProjects: []
};

const projectReducer = (state = initialState, action) => {
  switch (action.type) {
    case PROJECT_ACTIONS.FETCH_PROJECTS_REQUEST:
    case PROJECT_ACTIONS.ADD_PROJECT_REQUEST:
    case PROJECT_ACTIONS.UPDATE_PROJECT_REQUEST:
    case PROJECT_ACTIONS.DELETE_PROJECT_REQUEST:
    case PROJECT_ACTIONS.UPLOAD_IMAGES_REQUEST:
      return {
        ...state,
        status: 'loading',
        error: null
      };
      
    case PROJECT_ACTIONS.FETCH_PROJECTS_SUCCESS:
      return {
        ...state,
        status: 'succeeded',
        projects: action.payload,
        error: null
      };
      
    case PROJECT_ACTIONS.ADD_PROJECT_SUCCESS:
      return {
        ...state,
        status: 'succeeded',
        projects: [...state.projects, action.payload],
        error: null
      };
      
    case PROJECT_ACTIONS.UPDATE_PROJECT_SUCCESS:
      return {
        ...state,
        status: 'succeeded',
        projects: state.projects.map(project => 
          project._id === action.payload._id ? action.payload : project
        ),
        error: null
      };
      
    case PROJECT_ACTIONS.DELETE_PROJECT_SUCCESS:
      return {
        ...state,
        status: 'succeeded',
        projects: state.projects.filter(project => project._id !== action.payload),
        error: null
      };

    case PROJECT_ACTIONS.FETCH_PROJECTS_FAILURE:
    case PROJECT_ACTIONS.ADD_PROJECT_FAILURE:
    case PROJECT_ACTIONS.UPDATE_PROJECT_FAILURE:
    case PROJECT_ACTIONS.DELETE_PROJECT_FAILURE:
    case PROJECT_ACTIONS.UPLOAD_IMAGES_FAILURE:
      return {
        ...state,
        status: 'failed',
        error: action.payload
      };
      
    default:
      return state;
  }
};

export default projectReducer;
