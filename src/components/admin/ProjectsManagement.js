import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addProject, updateProject, deleteProject, fetchProjects } from '../../redux/actions/projectActions';
import { LOADING_STATES } from '../../utils/constants';

const ProjectsManagement = () => {
  const dispatch = useDispatch();
  const { projects = [], status, error } = useSelector(state => state.projects || {});
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Separated image upload state
  const [imageUploadState, setImageUploadState] = useState({
    isUploading: false,
    progress: { current: 0, total: 0 },
    error: null,
    dragActive: false
  });
  
  // Updated formData to match new schema
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    category: 'Web Development',
    status: 'Not Started',
    featured: false,
    startDate: '',
    endDate: '',
    technologies: [],
    githubUrl: '',
    liveUrl: '',
    image: '',
    images: [],
    challenges: []
  });

  useEffect(() => {
    if (status === LOADING_STATES.IDLE) {
      dispatch(fetchProjects());
    }
  }, [dispatch, status]);

  // SEPARATED IMAGE UPLOAD FUNCTIONALITY
  const ImageUploadService = {
    async uploadImages(files) {
      if (!files || files.length === 0) return { successful: [], failed: [] };

      const validFiles = [];
      const errors = [];

      // Validate files
      for (const file of files) {
        if (!file.type.startsWith('image/')) {
          errors.push(`${file.name} is not a valid image file`);
          continue;
        }
        if (file.size > 5 * 1024 * 1024) {
          errors.push(`${file.name} is too large (max 5MB)`);
          continue;
        }
        validFiles.push(file);
      }

      if (errors.length > 0) {
        throw new Error(`Validation errors:\n${errors.join('\n')}`);
      }

      if (validFiles.length === 0) {
        throw new Error('No valid files to upload');
      }

      // Upload files in parallel
      const uploadPromises = validFiles.map(async (file, index) => {
        try {
          const formDataUpload = new FormData();
          formDataUpload.append('image', file);

          const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000/api'}/projects/upload-image`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            },
            body: formDataUpload,
          });

          // Check if response is HTML (error page) instead of JSON
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('text/html')) {
            const htmlText = await response.text();
            console.error('HTML Error Response:', htmlText);
            throw new Error(`Server returned HTML error page instead of JSON. Status: ${response.status}`);
          }

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to upload ${file.name}`);
          }

          const data = await response.json();
          
          // Update progress
          setImageUploadState(prev => ({
            ...prev,
            progress: { ...prev.progress, current: prev.progress.current + 1 }
          }));
          
          return {
            success: true,
            url: data.data?.url || data.url,
            filename: file.name
          };
        } catch (error) {
          console.error(`Upload error for ${file.name}:`, error);
          return {
            success: false,
            error: error.message,
            filename: file.name
          };
        }
      });

      const results = await Promise.all(uploadPromises);
      
      const successful = results.filter(result => result.success);
      const failed = results.filter(result => !result.success);

      return {
        successful: successful.map(r => r.url),
        failed: failed.map(r => ({ filename: r.filename, error: r.error })),
        totalUploaded: successful.length,
        totalFailed: failed.length
      };
    }
  };

  const handleImageUpload = async (files) => {
    if (!files || files.length === 0) return;

    setImageUploadState(prev => ({
      ...prev,
      isUploading: true,
      error: null,
      progress: { current: 0, total: files.length }
    }));

    try {
      const result = await ImageUploadService.uploadImages(files);

      if (result.successful.length > 0) {
        setFormData(prev => ({
          ...prev,
          image: prev.image || result.successful[0],
          images: [...prev.images, ...result.successful]
        }));
      }

      if (result.failed.length > 0) {
        const errorMessage = `${result.failed.length} image(s) failed to upload:\n${
          result.failed.map(f => `• ${f.filename}: ${f.error}`).join('\n')
        }`;
        setImageUploadState(prev => ({ ...prev, error: errorMessage }));
      }

    } catch (error) {
      setImageUploadState(prev => ({ ...prev, error: error.message }));
    } finally {
      setImageUploadState(prev => ({
        ...prev,
        isUploading: false,
        progress: { current: 0, total: 0 }
      }));
    }
  };

  // SEPARATED PROJECT UPDATE FUNCTIONALITY
  const ProjectService = {
    async createProject(projectData) {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000/api'}/projects/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
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
    },

    async updateProject(projectData) {
      const { _id, ...updateData } = projectData;
      
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000/api'}/projects/${_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
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
    },

    async deleteProject(projectId) {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000/api'}/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete project');
      }

      return await response.json();
    },

    async toggleFeatured(projectId, featured) {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000/api'}/projects/${projectId}/featured`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({ 
          featured,
          updatedAt: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update featured status');
      }

      return await response.json();
    }
  };

  // Image upload handlers
  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    handleImageUpload(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setImageUploadState(prev => ({ ...prev, dragActive: true }));
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setImageUploadState(prev => ({ ...prev, dragActive: false }));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setImageUploadState(prev => ({ ...prev, dragActive: false }));
    const files = Array.from(e.dataTransfer.files);
    handleImageUpload(files);
  };

  const removeImage = (indexToRemove) => {
    setFormData(prev => {
      const newImages = prev.images.filter((_, index) => index !== indexToRemove);
      return {
        ...prev,
        images: newImages,
        image: prev.image === prev.images[indexToRemove] 
          ? (newImages.length > 0 ? newImages[0] : '') 
          : prev.image
      };
    });
  };

  const setMainImage = (imageUrl) => {
    setFormData(prev => ({
      ...prev,
      image: imageUrl
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTechnologiesChange = (e) => {
    const value = e.target.value;
    const techArray = value.split(',').map(tech => tech.trim()).filter(tech => tech.length > 0);
    setFormData(prev => ({
      ...prev,
      technologies: techArray
    }));
  };

  // Handle challenges input
  const handleChallengesChange = (e) => {
    const value = e.target.value;
    const challengesArray = value.split('\n').map(challenge => challenge.trim()).filter(challenge => challenge.length > 0);
    setFormData(prev => ({
      ...prev,
      challenges: challengesArray
    }));
  };

  // SEPARATED SUBMIT HANDLER
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Updated validation for new required fields
    if (!formData.title.trim()) {
      alert('Project title is required');
      return;
    }

    if (!formData.description.trim()) {
      alert('Project description is required');
      return;
    }

    if (!formData.startDate) {
      alert('Start date is required');
      return;
    }

    if (!formData.endDate) {
      alert('End date is required');
      return;
    }

    if (!formData.githubUrl.trim()) {
      alert('GitHub URL is required');
      return;
    }

    if (!formData.liveUrl.trim()) {
      alert('Live URL is required');
      return;
    }

    if (formData.technologies.length === 0) {
      alert('At least one technology is required');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const projectData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        shortDescription: formData.shortDescription.trim(),
        category: formData.category,
        status: formData.status,
        featured: Boolean(formData.featured),
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        technologies: Array.isArray(formData.technologies) 
          ? formData.technologies 
          : formData.technologies.split(',').map(t => t.trim()).filter(t => t),
        githubUrl: formData.githubUrl.trim(),
        liveUrl: formData.liveUrl.trim(),
        image: formData.image,
        images: formData.images,
        challenges: formData.challenges,
      };

      let result;
      if (editingProject) {
        // Update using separated service
        result = await ProjectService.updateProject({ 
          ...projectData, 
          _id: editingProject._id,
          createdAt: editingProject.createdAt
        });
        await dispatch(updateProject({ ...projectData, _id: editingProject._id }));
      } else {
        // Create using separated service
        result = await ProjectService.createProject(projectData);
        await dispatch(addProject(projectData));
      }

      if (result.success !== false) {
        resetForm();
        setIsModalOpen(false);
        // Refresh projects list
        setTimeout(() => {
          dispatch(fetchProjects(true));
        }, 500);
      } else {
        throw new Error(result.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error saving project:', error);
      alert(`Failed to ${editingProject ? 'update' : 'create'} project: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      shortDescription: '',
      category: 'Web Development',
      status: 'Not Started',
      featured: false,
      startDate: '',
      endDate: '',
      technologies: [],
      githubUrl: '',
      liveUrl: '',
      image: '',
      images: [],
      challenges: []
    });
    setEditingProject(null);
    setImageUploadState({
      isUploading: false,
      progress: { current: 0, total: 0 },
      error: null,
      dragActive: false
    });
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title || '',
      description: project.description || '',
      shortDescription: project.shortDescription || '',
      category: project.category || 'Web Development',
      status: project.status || 'Not Started',
      featured: Boolean(project.featured),
      startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
      endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
      technologies: Array.isArray(project.technologies) ? project.technologies : [],
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      image: project.image || '',
      images: Array.isArray(project.images) ? project.images : [],
      challenges: Array.isArray(project.challenges) ? project.challenges : []
    });
    setIsModalOpen(true);
  };

  // SEPARATED DELETE HANDLER
  const handleDelete = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        await ProjectService.deleteProject(projectId);
        await dispatch(deleteProject(projectId));
        setTimeout(() => {
          dispatch(fetchProjects(true));
        }, 500);
      } catch (error) {
        console.error('Error deleting project:', error);
        alert(`Failed to delete project: ${error.message}`);
      }
    }
  };

  // SEPARATED FEATURED TOGGLE
  const toggleFeatured = async (project) => {
    try {
      await ProjectService.toggleFeatured(project._id, !project.featured);
      const updatedProject = {
        ...project,
        featured: !project.featured,
        updatedAt: new Date().toISOString(),
      };
      await dispatch(updateProject(updatedProject));
      setTimeout(() => {
        dispatch(fetchProjects(true));
      }, 500);
    } catch (error) {
      console.error('Error toggling featured status:', error);
      alert(`Failed to update featured status: ${error.message}`);
    }
  };

  // Calculate project duration
  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return '';
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return `${diffDays} days`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months`;
    return `${Math.ceil(diffDays / 365)} years`;
  };

  const totalProjects = Array.isArray(projects) ? projects.length : 0;
  const featuredProjects = Array.isArray(projects) ? projects.filter(p => p.featured).length : 0;
  const completedProjects = Array.isArray(projects) ? projects.filter(p => p.status === 'Completed').length : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Enhanced Header with Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Projects Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your portfolio projects with comprehensive project details
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="mt-4 sm:mt-0 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 font-medium flex items-center shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <span className="mr-2">✨</span>
            Add New Project
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="flex items-center">
              <span className="text-2xl mr-3">📁</span>
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total Projects</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{totalProjects}</p>
              </div>
            </div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <div className="flex items-center">
              <span className="text-2xl mr-3">⭐</span>
              <div>
                <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">Featured</p>
                <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{featuredProjects}</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="flex items-center">
              <span className="text-2xl mr-3">✅</span>
              <div>
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">Completed</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">{completedProjects}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {status === LOADING_STATES.LOADING && (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading projects...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {status === LOADING_STATES.FAILED && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-8">
          <div className="flex items-center">
            <span className="text-2xl mr-3">❌</span>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-1">Error Loading Projects</h3>
              <p className="text-red-700 dark:text-red-400">{error}</p>
            </div>
            <button 
              onClick={() => dispatch(fetchProjects(true))}
              className="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Enhanced Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(projects) && projects.map((project) => (
          <div key={project._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            {/* Project Image */}
            <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="w-full h-full flex items-center justify-center" style={{display: project.image ? 'none' : 'flex'}}>
                <div className="text-center">
                  <span className="text-6xl text-gray-400 mb-2 block">📷</span>
                  <p className="text-gray-500 text-sm">No Image</p>
                </div>
              </div>
              
              {/* Status Badge */}
              <div className="absolute top-3 left-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${
                  project.status === 'Completed' ? 'bg-green-500 text-white' :
                  project.status === 'In Progress' ? 'bg-yellow-500 text-black' :
                  'bg-gray-500 text-white'
                }`}>
                  {project.status}
                </span>
              </div>

              {/* Featured Badge */}
              {project.featured && (
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 bg-yellow-500 text-white rounded-full text-xs font-semibold shadow-lg flex items-center">
                    <span className="mr-1">⭐</span>
                    Featured
                  </span>
                </div>
              )}
              
              {/* Action Buttons Overlay */}
              <div className="absolute bottom-3 right-3 flex space-x-2">
                <button
                  onClick={() => toggleFeatured(project)}
                  className={`p-2 rounded-full transition-all duration-200 shadow-lg ${
                    project.featured 
                      ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                      : 'bg-white/90 text-gray-600 hover:bg-yellow-100'
                  }`}
                  title={project.featured ? 'Remove from featured' : 'Add to featured'}
                >
                  {project.featured ? '⭐' : '☆'}
                </button>
                <button
                  onClick={() => handleEdit(project)}
                  className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-200 shadow-lg"
                  title="Edit project"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(project._id)}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200 shadow-lg"
                  title="Delete project"
                >
                  🗑️
                </button>
              </div>
            </div>
            
            {/* Project Info */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
                {project.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                {project.shortDescription || project.description}
              </p>
              
              {/* Project Duration */}
              {project.startDate && project.endDate && (
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-3">
                  <span className="mr-1">⏱️</span>
                  <span>{calculateDuration(project.startDate, project.endDate)}</span>
                </div>
              )}
              
              {/* Technologies */}
              {project.technologies && project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.technologies.slice(0, 3).map((tech, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full">
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>
              )}
              
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center">
                  <span className="mr-1">📁</span>
                  {project.category || 'Web Development'}
                </span>
                <span className="flex items-center">
                  <span className="mr-1">🖼️</span>
                  {project.images ? project.images.length : 0} images
                </span>
              </div>
              
              {/* External Links */}
              <div className="flex space-x-2 mt-4">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors text-center text-sm"
                >
                  GitHub
                </a>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center text-sm"
                >
                  Live Demo
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {Array.isArray(projects) && projects.length === 0 && status !== LOADING_STATES.LOADING && (
        <div className="text-center py-16">
          <div className="text-8xl mb-6">🚀</div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            No projects yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Start building your portfolio by creating your first project with comprehensive details.
          </p>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <span className="mr-2">✨</span>
            Create Your First Project
          </button>
        </div>
      )}

      {/* Modal with Updated Form Fields */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white dark:bg-gray-800 p-6 border-b border-gray-200 dark:border-gray-700 z-10">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                  <span className="mr-2">{editingProject ? '✏️' : '✨'}</span>
                  {editingProject ? 'Edit Project' : 'Create New Project'}
                </h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-8">
              {/* SEPARATED IMAGE UPLOAD SECTION */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <span className="mr-2">🖼️</span>
                  Project Images
                </h3>
                
                {/* Upload Area */}
                <div
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                    imageUploadState.dragActive 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105' 
                      : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    id="image-upload"
                    multiple
                    accept="image/*"
                    onChange={handleFileInputChange}
                    disabled={imageUploadState.isUploading}
                    className="hidden"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    {imageUploadState.isUploading ? (
                      <div className="space-y-4">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500"></div>
                        <div className="text-lg font-medium text-gray-700 dark:text-gray-300">
                          Uploading Images...
                        </div>
                        {imageUploadState.progress.total > 0 && (
                          <div className="w-64 bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                              style={{ width: `${(imageUploadState.progress.current / imageUploadState.progress.total) * 100}%` }}
                            ></div>
                          </div>
                        )}
                        <p className="text-sm text-gray-500">
                          {imageUploadState.progress.current} of {imageUploadState.progress.total} images uploaded
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="text-6xl">📷</div>
                        <div className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                          Upload Project Images
                        </div>
                        <div className="text-gray-500 dark:text-gray-400 space-y-1">
                          <p>Drag & drop images here, or click to select files</p>
                          <p className="text-sm">Maximum 5MB per file • JPG, PNG, GIF, WebP supported</p>
                        </div>
                      </div>
                    )}
                  </label>
                </div>

                {/* Upload Error Display */}
                {imageUploadState.error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <span className="text-red-500 mr-2">⚠️</span>
                      <div className="flex-1">
                        <h4 className="text-red-800 font-semibold mb-1">Upload Error</h4>
                        <pre className="text-red-700 text-sm whitespace-pre-wrap">{imageUploadState.error}</pre>
                      </div>
                      <button
                        type="button"
                        onClick={() => setImageUploadState(prev => ({ ...prev, error: null }))}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}

                {/* Enhanced Image Preview */}
                {(formData.image || formData.images.length > 0) && (
                  <div className="space-y-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                      <span className="mr-2">🖼️</span>
                      Project Images ({formData.images.length})
                    </h4>
                    
                    {/* Main Image */}
                    {formData.image && (
                      <div className="space-y-3">
                        <label className="block text-sm font-semibold text-green-600 dark:text-green-400 flex items-center">
                          <span className="mr-1">⭐</span>
                          Main Display Image
                        </label>
                        <div className="relative w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden shadow-lg">
                          <img
                            src={formData.image}
                            alt="Main project"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 left-3">
                            <span className="px-3 py-1 bg-green-500 text-white text-xs rounded-full font-semibold shadow-lg">
                              Main Image
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                            className="absolute top-3 right-3 w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center justify-center shadow-lg"
                            title="Remove main image"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Image Gallery */}
                    {formData.images.length > 0 && (
                      <div className="space-y-3">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                          <span className="mr-1">🖼️</span>
                          All Images ({formData.images.length})
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {formData.images.map((imageUrl, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
                                <img
                                  src={imageUrl}
                                  alt={`Project ${index + 1}`}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                />
                              </div>
                              
                              {/* Image Controls */}
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center space-x-2">
                                {imageUrl !== formData.image && (
                                  <button
                                    type="button"
                                    onClick={() => setMainImage(imageUrl)}
                                    className="px-3 py-1 bg-green-500 text-white text-xs rounded-full hover:bg-green-600 transition-colors shadow-lg"
                                    title="Set as main image"
                                  >
                                    ⭐ Main
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="w-6 h-6 bg-red-500 text-white rounded-full hover:bg-red-600 text-xs transition-colors flex items-center justify-center shadow-lg"
                                  title="Remove image"
                                >
                                  ✕
                                </button>
                              </div>

                              {/* Main Image Indicator */}
                              {imageUrl === formData.image && (
                                <div className="absolute top-2 left-2">
                                  <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full font-semibold shadow-lg">
                                    Main
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* FORM FIELDS - Updated to match new schema */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                      placeholder="Enter project title"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                    >
                      <option value="Web Development">🌐 Web Development</option>
                      <option value="Mobile App">📱 Mobile App</option>
                      <option value="Desktop App">🖥️ Desktop App</option>
                      <option value="E-commerce">🛒 E-commerce</option>
                      <option value="Portfolio">💼 Portfolio</option>
                      <option value="Landing Page">📄 Landing Page</option>
                      <option value="API">🔗 API</option>
                      <option value="Tool">🛠️ Tool</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Short Description
                    </label>
                    <input
                      type="text"
                      name="shortDescription"
                      value={formData.shortDescription}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                      placeholder="Brief description for project cards"
                      maxLength={150}
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {formData.shortDescription.length}/150 characters
                    </div>
                  </div>

                  {/* NEW: Date Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Start Date *
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        End Date *
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                      >
                        <option value="Not Started">⏳ Not Started</option>
                        <option value="In Progress">🚧 In Progress</option>
                        <option value="Completed">✅ Completed</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-center">
                      <label className="flex items-center cursor-pointer bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors">
                        <input
                          type="checkbox"
                          name="featured"
                          checked={formData.featured}
                          onChange={handleInputChange}
                          className="w-5 h-5 text-yellow-600 rounded focus:ring-yellow-500 mr-3"
                        />
                        <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-300 flex items-center">
                          <span className="mr-2">⭐</span>
                          Featured Project
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Full Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="6"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors resize-none"
                      placeholder="Detailed project description, features, and objectives"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Technologies Used *
                    </label>
                    <input
                      type="text"
                      name="technologies"
                      value={Array.isArray(formData.technologies) ? formData.technologies.join(', ') : formData.technologies}
                      onChange={handleTechnologiesChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                      placeholder="React, Node.js, MongoDB, Express, Tailwind CSS"
                      required
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      Separate technologies with commas (at least one required)
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        GitHub Repository URL *
                      </label>
                      <input
                        type="url"
                        name="githubUrl"
                        value={formData.githubUrl}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                        placeholder="https://github.com/username/repository"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Live Demo URL *
                      </label>
                      <input
                        type="url"
                        name="liveUrl"
                        value={formData.liveUrl}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                        placeholder="https://your-project.com"
                        required
                      />
                    </div>
                  </div>

                  {/* NEW: Challenges Field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Project Challenges
                    </label>
                    <textarea
                      value={Array.isArray(formData.challenges) ? formData.challenges.join('\n') : formData.challenges}
                      onChange={handleChallengesChange}
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors resize-none"
                      placeholder="List key challenges faced during development (one per line)"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      Enter each challenge on a new line
                    </div>
                  </div>
                </div>
              </div>

              {/* FORM ACTIONS */}
              <div className="flex justify-end space-x-4 pt-8 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="px-6 py-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || imageUploadState.isUploading}
                  className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center shadow-lg hover:shadow-xl"
                >
                  {(isSubmitting || imageUploadState.isUploading) ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {imageUploadState.isUploading ? 'Uploading...' : 'Saving...'}
                    </>
                  ) : (
                    <>
                      <span className="mr-2">{editingProject ? '💾' : '✨'}</span>
                      {editingProject ? 'Update Project' : 'Create Project'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsManagement;
