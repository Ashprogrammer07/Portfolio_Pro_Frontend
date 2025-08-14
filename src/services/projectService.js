const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const getAuthToken = () => {
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
};

export class ProjectService {
  static async createProject(projectData) {
    try {
      const response = await fetch(`${API_URL}/projects/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({
          ...projectData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create project');
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Failed to create project: ${error.message}`);
    }
  }

  static async updateProject(projectData) {
    try {
      const { _id, ...updateData } = projectData;
      
      const response = await fetch(`${API_URL}/projects/${_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({
          ...updateData,
          updatedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update project');
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Failed to update project: ${error.message}`);
    }
  }

  static async deleteProject(projectId) {
    try {
      const response = await fetch(`${API_URL}/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete project');
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Failed to delete project: ${error.message}`);
    }
  }
}
