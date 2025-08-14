
// Action Types
export const PROJECT_ACTIONS = {
  FETCH_PROJECTS_REQUEST: 'FETCH_PROJECTS_REQUEST',
  FETCH_PROJECTS_SUCCESS: 'FETCH_PROJECTS_SUCCESS',
  FETCH_PROJECTS_FAILURE: 'FETCH_PROJECTS_FAILURE',
  
  ADD_PROJECT_REQUEST: 'ADD_PROJECT_REQUEST',
  ADD_PROJECT_SUCCESS: 'ADD_PROJECT_SUCCESS',
  ADD_PROJECT_FAILURE: 'ADD_PROJECT_FAILURE',
  
  UPDATE_PROJECT_REQUEST: 'UPDATE_PROJECT_REQUEST',
  UPDATE_PROJECT_SUCCESS: 'UPDATE_PROJECT_SUCCESS',
  UPDATE_PROJECT_FAILURE: 'UPDATE_PROJECT_FAILURE',
  
  DELETE_PROJECT_REQUEST: 'DELETE_PROJECT_REQUEST',
  DELETE_PROJECT_SUCCESS: 'DELETE_PROJECT_SUCCESS',
  DELETE_PROJECT_FAILURE: 'DELETE_PROJECT_FAILURE',
  
  UPLOAD_IMAGES_REQUEST: 'UPLOAD_IMAGES_REQUEST',
  UPLOAD_IMAGES_SUCCESS: 'UPLOAD_IMAGES_SUCCESS',
  UPLOAD_IMAGES_FAILURE: 'UPLOAD_IMAGES_FAILURE',
  
  FETCH_FEATURED_PROJECTS_REQUEST: 'FETCH_FEATURED_PROJECTS_REQUEST',
  FETCH_FEATURED_PROJECTS_SUCCESS: 'FETCH_FEATURED_PROJECTS_SUCCESS',
  FETCH_FEATURED_PROJECTS_FAILURE: 'FETCH_FEATURED_PROJECTS_FAILURE',
  
  FETCH_PROJECT_STATS_REQUEST: 'FETCH_PROJECT_STATS_REQUEST',
  FETCH_PROJECT_STATS_SUCCESS: 'FETCH_PROJECT_STATS_SUCCESS',
  FETCH_PROJECT_STATS_FAILURE: 'FETCH_PROJECT_STATS_FAILURE'
};

// Helper function to get auth token
const getadminToken = () => {
  return localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
};

// Helper function to get API URL
const getApiUrl = () => {
  return process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
};

// Fetch all projects
export const fetchProjects = () => async (dispatch) => {
  try {
    dispatch({ type: PROJECT_ACTIONS.FETCH_PROJECTS_REQUEST });
    
    const response = await fetch(`${getApiUrl()}/projects`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch projects');
    }
    
    dispatch({ 
      type: PROJECT_ACTIONS.FETCH_PROJECTS_SUCCESS, 
      payload: data.data || []
    });
    
    return data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    dispatch({ 
      type: PROJECT_ACTIONS.FETCH_PROJECTS_FAILURE, 
      payload: error.message 
    });
    throw error;
  }
};

// Fetch single project by ID
export const fetchProjectById = (projectId) => async (dispatch) => {
  try {
    dispatch({ type: PROJECT_ACTIONS.FETCH_PROJECTS_REQUEST });
    
    const response = await fetch(`${getApiUrl()}/projects/${projectId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch project');
    }
    
    return data.data;
  } catch (error) {
    console.error('Error fetching project:', error);
    dispatch({ 
      type: PROJECT_ACTIONS.FETCH_PROJECTS_FAILURE, 
      payload: error.message 
    });
    throw error;
  }
};

// Upload project images
export const uploadProjectImages = (files) => async (dispatch) => {
  try {
    dispatch({ type: PROJECT_ACTIONS.UPLOAD_IMAGES_REQUEST });
    
    const formData = new FormData();
    
    // Append multiple files
    if (Array.isArray(files)) {
      files.forEach(file => {
        formData.append('images', file);
      });
    } else {
      formData.append('images', files);
    }
    
    const token = getadminToken();
    
    const response = await fetch(`${getApiUrl()}/projects/upload-images`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        // Don't set Content-Type for FormData, let browser handle it
      },
      body: formData,
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to upload images');
    }
    
    dispatch({ 
      type: PROJECT_ACTIONS.UPLOAD_IMAGES_SUCCESS, 
      payload: data.data 
    });
    
    return data.data; // Return array of image URLs
  } catch (error) {
    console.error('Error uploading images:', error);
    dispatch({ 
      type: PROJECT_ACTIONS.UPLOAD_IMAGES_FAILURE, 
      payload: error.message 
    });
    throw error;
  }
};

// Add new project
export const addProject = (projectData) => async (dispatch) => {
  try {
    dispatch({ type: PROJECT_ACTIONS.ADD_PROJECT_REQUEST });
    
    // Format data for backend
    const formattedData = {
      ...projectData,
      featured: Boolean(projectData.featured),
      technologies: Array.isArray(projectData.technologies) 
        ? projectData.technologies 
        : typeof projectData.technologies === 'string' 
          ? projectData.technologies.split(',').map(t => t.trim()).filter(t => t)
          : [],
      challenges: Array.isArray(projectData.challenges) 
        ? projectData.challenges 
        : typeof projectData.challenges === 'string' 
          ? projectData.challenges.split(',').map(c => c.trim()).filter(c => c)
          : [],
      status: projectData.status || 'Completed',
      category: projectData.category || 'Web Development',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const token = getadminToken();
    
    const response = await fetch(`${getApiUrl()}/projects/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(formattedData),
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to add project');
    }
    
    dispatch({ 
      type: PROJECT_ACTIONS.ADD_PROJECT_SUCCESS, 
      payload: data.data 
    });
    
    return data;
  } catch (error) {
    console.error('Error adding project:', error);
    dispatch({ 
      type: PROJECT_ACTIONS.ADD_PROJECT_FAILURE, 
      payload: error.message 
    });
    throw error;
  }
};

// Update project
export const updateProject = (projectData) => async (dispatch) => {
  try {
    dispatch({ type: PROJECT_ACTIONS.UPDATE_PROJECT_REQUEST });
    
    const { _id, ...updateData } = projectData;
    
    // Format data for backend
    const formattedData = {
      ...updateData,
      featured: Boolean(updateData.featured),
      technologies: Array.isArray(updateData.technologies) 
        ? updateData.technologies 
        : typeof updateData.technologies === 'string' 
          ? updateData.technologies.split(',').map(t => t.trim()).filter(t => t)
          : [],
      challenges: Array.isArray(updateData.challenges) 
        ? updateData.challenges 
        : typeof updateData.challenges === 'string' 
          ? updateData.challenges.split(',').map(c => c.trim()).filter(c => c)
          : [],
      updatedAt: new Date().toISOString(),
    };

    const token = getadminToken();
    
    const response = await fetch(`${getApiUrl()}/projects/${_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(formattedData),
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to update project');
    }
    
    dispatch({ 
      type: PROJECT_ACTIONS.UPDATE_PROJECT_SUCCESS, 
      payload: data.data 
    });
    
    return data;
  } catch (error) {
    console.error('Error updating project:', error);
    dispatch({ 
      type: PROJECT_ACTIONS.UPDATE_PROJECT_FAILURE, 
      payload: error.message 
    });
    throw error;
  }
};

// Delete project
export const deleteProject = (projectId) => async (dispatch) => {
  try {
    dispatch({ type: PROJECT_ACTIONS.DELETE_PROJECT_REQUEST });

    const token = getadminToken();
    
    const response = await fetch(`${getApiUrl()}/projects/${projectId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to delete project');
    }
    
    dispatch({ 
      type: PROJECT_ACTIONS.DELETE_PROJECT_SUCCESS, 
      payload: projectId 
    });
    
    return data;
  } catch (error) {
    console.error('Error deleting project:', error);
    dispatch({ 
      type: PROJECT_ACTIONS.DELETE_PROJECT_FAILURE, 
      payload: error.message 
    });
    throw error;
  }
};

// Fetch featured projects
export const fetchFeaturedProjects = () => async (dispatch) => {
  try {
    dispatch({ type: PROJECT_ACTIONS.FETCH_FEATURED_PROJECTS_REQUEST });
    
    const response = await fetch(`${getApiUrl()}/projects/featured`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch featured projects');
    }
    
    dispatch({ 
      type: PROJECT_ACTIONS.FETCH_FEATURED_PROJECTS_SUCCESS, 
      payload: data.data || []
    });
    
    return data;
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    dispatch({ 
      type: PROJECT_ACTIONS.FETCH_FEATURED_PROJECTS_FAILURE, 
      payload: error.message 
    });
    throw error;
  }
};

// Fetch projects by category
export const fetchProjectsByCategory = (category) => async (dispatch) => {
  try {
    dispatch({ type: PROJECT_ACTIONS.FETCH_PROJECTS_REQUEST });
    
    const response = await fetch(`${getApiUrl()}/projects/category/${encodeURIComponent(category)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch projects by category');
    }
    
    dispatch({ 
      type: PROJECT_ACTIONS.FETCH_PROJECTS_SUCCESS, 
      payload: data.data || []
    });
    
    return data;
  } catch (error) {
    console.error('Error fetching projects by category:', error);
    dispatch({ 
      type: PROJECT_ACTIONS.FETCH_PROJECTS_FAILURE, 
      payload: error.message 
    });
    throw error;
  }
};

// Fetch projects by status
export const fetchProjectsByStatus = (status) => async (dispatch) => {
  try {
    dispatch({ type: PROJECT_ACTIONS.FETCH_PROJECTS_REQUEST });
    
    const response = await fetch(`${getApiUrl()}/projects/status/${encodeURIComponent(status)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch projects by status');
    }
    
    dispatch({ 
      type: PROJECT_ACTIONS.FETCH_PROJECTS_SUCCESS, 
      payload: data.data || []
    });
    
    return data;
  } catch (error) {
    console.error('Error fetching projects by status:', error);
    dispatch({ 
      type: PROJECT_ACTIONS.FETCH_PROJECTS_FAILURE, 
      payload: error.message 
    });
    throw error;
  }
};

// Fetch project statistics (Admin only)
export const fetchProjectStats = () => async (dispatch) => {
  try {
    dispatch({ type: PROJECT_ACTIONS.FETCH_PROJECT_STATS_REQUEST });

    const token = getadminToken();
    
    const response = await fetch(`${getApiUrl()}/projects/admin/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch project statistics');
    }
    
    dispatch({ 
      type: PROJECT_ACTIONS.FETCH_PROJECT_STATS_SUCCESS, 
      payload: data.data 
    });
    
    return data;
  } catch (error) {
    console.error('Error fetching project stats:', error);
    dispatch({ 
      type: PROJECT_ACTIONS.FETCH_PROJECT_STATS_FAILURE, 
      payload: error.message 
    });
    throw error;
  }
};

// Create project with images (Combined action)
export const createProjectWithImages = (projectData, imageFiles) => async (dispatch) => {
  try {
    let imageUrls = [];
    
    // First upload images if provided
    if (imageFiles && imageFiles.length > 0) {
      imageUrls = await dispatch(uploadProjectImages(imageFiles));
    }
    
    // Then create project with image URLs
    const projectWithImages = {
      ...projectData,
      image: imageUrls[0] || projectData.image || null,
      images: imageUrls.length > 0 ? imageUrls : projectData.images || [],
      originalImage: imageUrls[0] || projectData.originalImage || null,
    };
    
    return await dispatch(addProject(projectWithImages));
  } catch (error) {
    console.error('Error creating project with images:', error);
    throw error;
  }
};

// Update project with new images (Combined action)
export const updateProjectWithImages = (projectData, newImageFiles) => async (dispatch) => {
  try {
    let newImageUrls = [];
    
    // Upload new images if provided
    if (newImageFiles && newImageFiles.length > 0) {
      newImageUrls = await dispatch(uploadProjectImages(newImageFiles));
    }
    
    // Combine existing and new images
    const existingImages = projectData.images || [];
    const allImages = [...existingImages, ...newImageUrls];
    
    const projectWithImages = {
      ...projectData,
      image: projectData.image || allImages[0] || null,
      images: allImages,
      originalImage: projectData.originalImage || allImages[0] || null,
    };
    
    return await dispatch(updateProject(projectWithImages));
  } catch (error) {
    console.error('Error updating project with images:', error);
    throw error;
  }
};

// Bulk operations
export const bulkDeleteProjects = (projectIds) => async (dispatch) => {
  try {
    const results = await Promise.allSettled(
      projectIds.map(id => dispatch(deleteProject(id)))
    );
    
    const successful = results.filter(result => result.status === 'fulfilled').length;
    const failed = results.filter(result => result.status === 'rejected').length;
    
    return {
      successful,
      failed,
      total: projectIds.length
    };
  } catch (error) {
    console.error('Error in bulk delete:', error);
    throw error;
  }
};

// Toggle project featured status
export const toggleProjectFeatured = (projectId, currentFeaturedStatus) => async (dispatch) => {
  try {
    const project = await dispatch(fetchProjectById(projectId));
    
    const updatedProject = {
      ...project,
      featured: !currentFeaturedStatus,
      updatedAt: new Date().toISOString(),
    };
    
    return await dispatch(updateProject(updatedProject));
  } catch (error) {
    console.error('Error toggling featured status:', error);
    throw error;
  }
};

// Search projects
export const searchProjects = (searchTerm) => async (dispatch) => {
  try {
    dispatch({ type: PROJECT_ACTIONS.FETCH_PROJECTS_REQUEST });
    
    const response = await fetch(`${getApiUrl()}/projects?search=${encodeURIComponent(searchTerm)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to search projects');
    }
    
    dispatch({ 
      type: PROJECT_ACTIONS.FETCH_PROJECTS_SUCCESS, 
      payload: data.data || []
    });
    
    return data;
  } catch (error) {
    console.error('Error searching projects:', error);
    dispatch({ 
      type: PROJECT_ACTIONS.FETCH_PROJECTS_FAILURE, 
      payload: error.message 
    });
    throw error;
  }
};

// Export all actions
const projectActions = {
  fetchProjects,
  fetchProjectById,
  addProject,
  updateProject,
  deleteProject,
  uploadProjectImages,
  fetchFeaturedProjects,
  fetchProjectsByCategory,
  fetchProjectsByStatus,
  fetchProjectStats,
  createProjectWithImages,
  updateProjectWithImages,
  bulkDeleteProjects,
  toggleProjectFeatured,
  searchProjects,
  PROJECT_ACTIONS
};