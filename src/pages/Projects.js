import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProjects } from '../redux/actions/projectActions';
import { motion, AnimatePresence } from 'framer-motion';
import { LOADING_STATES } from '../utils/constants';

const Projects = () => {
  const dispatch = useDispatch();
  const { projects, status, error } = useSelector(state => state.projects);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  
  // Advanced filtering states
  const [statusFilter, setStatusFilter] = useState('all');
  const [techFilter, setTechFilter] = useState('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  useEffect(() => {
    if (status === LOADING_STATES.IDLE) {
      dispatch(fetchProjects());
    }
  }, [status, dispatch]);

  // Enhanced filtering logic with multiple categories
  const filteredProjects = projects.filter(project => {
    // Category filter
    const matchesCategory = filter === 'all' || project.category === filter;
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    
    // Technology filter
    const matchesTech = techFilter === 'all' || 
      (project.technologies && project.technologies.some(tech => 
        tech.toLowerCase().includes(techFilter.toLowerCase())
      ));
    
    // Search term filter (searches in title, description, and category)
    const matchesSearch = 
      project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.technologies?.some(tech => 
        tech.toLowerCase().includes(searchTerm.toLowerCase())
      );

    return matchesCategory && matchesStatus && matchesTech && matchesSearch;
  });

  // Get unique categories
  const categories = ['all', ...new Set(projects.map(p => p.category).filter(Boolean))];
  
  // Get unique statuses
  const statuses = ['all', ...new Set(projects.map(p => p.status).filter(Boolean))];
  
  // Get unique technologies (flatten and deduplicate)
  const allTechnologies = projects.reduce((acc, project) => {
    if (project.technologies) {
      acc.push(...project.technologies);
    }
    return acc;
  }, []);
  const technologies = ['all', ...new Set(allTechnologies)];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const openProjectModal = (project) => {
    setSelectedProject(project);
    document.body.style.overflow = 'hidden';
  };

  const closeProjectModal = () => {
    setSelectedProject(null);
    document.body.style.overflow = 'unset';
  };

  // Clear all filters
  const clearFilters = () => {
    setFilter('all');
    setStatusFilter('all');
    setTechFilter('all');
    setSearchTerm('');
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeProjectModal();
      }
    };

    if (selectedProject) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [selectedProject]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            My Projects
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            A showcase of my work, featuring web applications, mobile apps, and innovative solutions
          </p>
        </motion.div>

        {/* Enhanced Search and Filter Section */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
            
            {/* Search Bar and Advanced Toggle */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search by project name, description, or technology..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </div>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    ✕
                  </button>
                )}
              </div>
              
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  showAdvancedFilters
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                ⚙️ Filters {showAdvancedFilters ? '▼' : '▶'}
              </button>
            </div>

            {/* Category Filter (Always Visible) */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Category</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setFilter(category)}
                    className={`px-4 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                      filter === category
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                    {category !== 'all' && (
                      <span className="ml-1 text-xs opacity-75">
                        ({projects.filter(p => p.category === category).length})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced Filters (Collapsible) */}
            <AnimatePresence>
              {showAdvancedFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-gray-200 dark:border-gray-600 pt-4"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    
                    {/* Status Filter */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Status</h3>
                      <div className="flex flex-wrap gap-2">
                        {statuses.map((status) => (
                          <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                              statusFilter === status
                                ? 'bg-green-500 text-white shadow-md'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-green-100 dark:hover:bg-green-900/30'
                            }`}
                          >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Technology Filter */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Technology</h3>
                      <div className="relative">
                        <select
                          value={techFilter}
                          onChange={(e) => setTechFilter(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                        >
                          {technologies.slice(0, 20).map((tech) => (
                            <option key={tech} value={tech}>
                              {tech === 'all' ? 'All Technologies' : tech}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Clear Filters Button */}
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Active Filters Summary */}
            {(filter !== 'all' || statusFilter !== 'all' || techFilter !== 'all' || searchTerm) && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Active Filters:</span>
                    {filter !== 'all' && (
                      <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                        Category: {filter}
                      </span>
                    )}
                    {statusFilter !== 'all' && (
                      <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                        Status: {statusFilter}
                      </span>
                    )}
                    {techFilter !== 'all' && (
                      <span className="px-2 py-1 bg-purple-500 text-white text-xs rounded-full">
                        Tech: {techFilter}
                      </span>
                    )}
                    {searchTerm && (
                      <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded-full">
                        Search: "{searchTerm}"
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {filteredProjects.length} of {projects.length} projects
                  </span>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Loading State */}
        {status === LOADING_STATES.LOADING && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300 text-lg">Loading projects...</p>
          </div>
        )}

        {/* Error State */}
        {status === LOADING_STATES.FAILED && (
          <div className="text-center py-16">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Failed to load projects
            </h3>
            <p className="text-red-500 mb-6">{error}</p>
            <button
              onClick={() => dispatch(fetchProjects())}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Projects Grid */}
        {status !== LOADING_STATES.LOADING && (
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project, index) => (
                <motion.div
                  key={project._id || index}
                  className="group bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-gray-100 dark:border-gray-700 cursor-pointer"
                  variants={itemVariants}
                  onClick={() => openProjectModal(project)}
                >
                  {/* Project Image with Original Preview */}
                  <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-600 overflow-hidden">
                    {project.image || project.images?.[0] ? (
                      <img 
                        src={project.originalImage || project.image || project.images[0]} 
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => {
                          // Fallback if original image fails to load
                          e.target.src = project.image || project.images[0];
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-6xl text-white/80">💻</span>
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        project.status === 'Completed' 
                          ? 'bg-green-500 text-white'
                          : project.status === 'In Progress'
                          ? 'bg-yellow-500 text-white'
                          : 'bg-gray-500 text-white'
                      }`}>
                        {project.status || 'Completed'}
                      </span>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
                        {project.category || 'General'}
                      </span>
                    </div>

                    {/* Featured Badge */}
                    {project.featured && (
                      <div className="absolute bottom-4 left-4">
                        <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full">
                          ⭐ Featured
                        </span>
                      </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">Click to View Details</span>
                    </div>
                  </div>

                  {/* Project Content */}
                  <div className="p-6">
                    <div className="mb-3">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {project.title || 'Untitled Project'}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                        {project.shortDescription || project.description || 'No description available'}
                      </p>
                    </div>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies?.slice(0, 3).map((tech, techIndex) => (
                        <span 
                          key={techIndex}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies?.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                          +{project.technologies.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Action Links */}
                    <div className="flex space-x-3" onClick={(e) => e.stopPropagation()}>
                      {(project.githubUrl || project.githubLink) && (
                        <a
                          href={project.githubUrl || project.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white text-center rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                        >
                          <i class="fab fa-github"></i> Code
                        </a>
                      )}
                      {(project.liveUrl || project.liveLink) && (
                        <a
                          href={project.liveUrl || project.liveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all text-sm font-medium"
                        >
                          🌐 Demo
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                className="col-span-full text-center py-16"
                variants={itemVariants}
              >
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No projects found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No projects match your current filters.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Clear Filters
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>

      {/* Enhanced Project Modal */}
      <ProjectModal 
        project={selectedProject} 
        isOpen={!!selectedProject} 
        onClose={closeProjectModal} 
      />
    </div>
  );
};

// Complete Project Modal Component with Enhanced Image Preview
const ProjectModal = ({ project, isOpen, onClose }) => {
  if (!project) return null;

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: 'spring', duration: 0.5 }
    },
    exit: { opacity: 0, scale: 0.8, y: 50 }
  };

  // Get the highest quality image available
  const getOriginalImage = () => {
    return project.originalImage || 
           project.fullSizeImage || 
           project.image || 
           project.images?.[0] || 
           null;
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate duration if both dates exist
  const calculateDuration = () => {
    if (!project.startDate || !project.endDate) return null;
    const start = new Date(project.startDate);
    const end = new Date(project.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const months = Math.floor(diffDays / 30);
    const days = diffDays % 30;
    return months > 0 ? `${months} months, ${days} days` : `${diffDays} days`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header with Enhanced Original Image */}
            <div className="relative">
              <div className="h-72 bg-gradient-to-br from-blue-400 to-purple-600 overflow-hidden rounded-t-3xl">
                {getOriginalImage() ? (
                  <img 
                    src={getOriginalImage()} 
                    alt={project.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                    loading="lazy"
                    onClick={() => window.open(getOriginalImage(), '_blank')}
                    onError={(e) => {
                      // Fallback hierarchy
                      if (e.target.src !== project.image) {
                        e.target.src = project.image;
                      }
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-9xl text-white/80">💻</span>
                  </div>
                )}
                
                {/* Click to view full image overlay */}
                {getOriginalImage() && (
                  <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer"
                       onClick={() => window.open(getOriginalImage(), '_blank')}>
                    <span className="text-white font-semibold text-lg bg-black/50 px-4 py-2 rounded-lg">
                      🔍 Click to view full image
                    </span>
                  </div>
                )}
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
              >
                ✕
              </button>

              {/* Status and Featured Badges */}
              <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                <span className={`px-4 py-2 text-sm font-semibold rounded-full backdrop-blur-sm ${
                  project.status === 'Completed' 
                    ? 'bg-green-500/90 text-white'
                    : project.status === 'In Progress'
                    ? 'bg-yellow-500/90 text-white'
                    : project.status === 'Planning'
                    ? 'bg-blue-500/90 text-white'
                    : 'bg-gray-500/90 text-white'
                }`}>
                  {project.status || 'Completed'}
                </span>
                
                {project.featured && (
                  <span className="px-4 py-2 bg-yellow-500/90 text-white text-sm font-semibold rounded-full backdrop-blur-sm">
                    ⭐ Featured
                  </span>
                )}
                
                {project.category && (
                  <span className="px-4 py-2 bg-purple-500/90 text-white text-sm font-semibold rounded-full backdrop-blur-sm">
                    {project.category}
                  </span>
                )}
              </div>

              {/* Project Title Overlay */}
              <div className="absolute bottom-6 left-6 right-6">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
                  {project.title || 'Untitled Project'}
                </h1>
                {project.shortDescription && (
                  <p className="text-xl text-white/90 drop-shadow-md">
                    {project.shortDescription}
                  </p>
                )}
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              
              {/* Project Overview Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <span className="mr-3">📋</span>
                  Project Overview
                </h2>
                
                {project.description && (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Description</h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                      {project.description}
                    </p>
                  </div>
                )}

                {/* Project Metadata Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center">
                    <div className="text-2xl mb-2">📅</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Start Date</div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {formatDate(project.startDate)}
                    </div>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center">
                    <div className="text-2xl mb-2">🏁</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">End Date</div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {formatDate(project.endDate)}
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 text-center">
                    <div className="text-2xl mb-2">⏱️</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Duration</div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {calculateDuration() || 'Ongoing'}
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 text-center">
                    <div className="text-2xl mb-2">👥</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Team Size</div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {project.teamSize || 'Solo'}
                    </div>
                  </div>
                </div>

                {/* Additional Project Details */}
                <div className="grid md:grid-cols-2 gap-6">
                  {project.role && (
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                        <span className="mr-2">🎯</span>
                        My Role
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300">{project.role}</p>
                    </div>
                  )}
                  
                  {project.client && (
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                        <span className="mr-2">🏢</span>
                        Client
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300">{project.client}</p>
                    </div>
                  )}
                  
                  {project.budget && (
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                        <span className="mr-2">💰</span>
                        Budget
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300">{project.budget}</p>
                    </div>
                  )}
                  
                  {project.platform && (
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                        <span className="mr-2">📱</span>
                        Platform
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300">{project.platform}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Technologies Section */}
              {project.technologies?.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <span className="mr-3">⚙️</span>
                    Technologies Used
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {project.technologies.map((tech, index) => (
                      <span 
                        key={index}
                        className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-800 dark:text-blue-300 rounded-xl font-medium border border-blue-200 dark:border-blue-700 hover:scale-105 transition-transform"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Enhanced Project Gallery with Original Images */}
              {project.images?.length > 1 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <span className="mr-3">🖼️</span>
                    Project Gallery
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {project.images.map((image, index) => (
                      <div key={index} className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 group cursor-pointer"
                           onClick={() => window.open(image, '_blank')}>
                        <img 
                          src={image}
                          alt={`${project.title} screenshot ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <span className="text-white text-sm bg-black/50 px-3 py-1 rounded">
                            🔍 View Full Size
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                {(project.githubUrl || project.githubLink) && (
                  <a
                    href={project.githubUrl || project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-6 py-4 bg-gray-900 dark:bg-gray-700 text-white text-center rounded-xl hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors font-semibold flex items-center justify-center"
                  >
                    <span className="mr-3 text-2xl"><i class="fab fa-github"></i></span>
                    View Source Code
                  </a>
                )}
                {(project.liveUrl || project.liveLink) && (
                  <a
                    href={project.liveUrl || project.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-semibold flex items-center justify-center shadow-lg hover:shadow-xl"
                  >
                    <span className="mr-3 text-2xl">🌐</span>
                    View Live Demo
                  </a>
                )}
                {project.caseStudyUrl && (
                  <a
                    href={project.caseStudyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-6 py-4 bg-green-600 text-white text-center rounded-xl hover:bg-green-700 transition-colors font-semibold flex items-center justify-center"
                  >
                    <span className="mr-3 text-2xl">📖</span>
                    Read Case Study
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Projects;
