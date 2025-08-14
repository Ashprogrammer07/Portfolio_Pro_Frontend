import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProjects } from '../../redux/actions/projectActions';
import ProjectCard from './ProjectCard';
import { LOADING_STATES } from '../../utils/constants';

const ProjectList = () => {
  const dispatch = useDispatch();
  const { projects, status, error } = useSelector(state => state.projects);
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    search: ''
  });

  useEffect(() => {
    if (status === LOADING_STATES.IDLE) {
      dispatch(fetchProjects());
    }
  }, [status, dispatch]);

  const handleProjectClick = (project) => {
    // For now, just log the project. Later we can add modal or routing
    console.log('Project clicked:', project);
    // You can add modal functionality or navigation here
  };

  // Filter projects based on selected filters
  const filteredProjects = projects.filter(project => {
    const matchesCategory = filters.category === 'all' || 
                          (project.category && project.category.toLowerCase() === filters.category.toLowerCase());
    
    const matchesStatus = filters.status === 'all' || 
                         (project.status && project.status.toLowerCase() === filters.status.toLowerCase());
    
    const matchesSearch = filters.search === '' || 
                         project.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                         project.description.toLowerCase().includes(filters.search.toLowerCase()) ||
                         (project.technologies && project.technologies.some(tech => 
                           tech.toLowerCase().includes(filters.search.toLowerCase())
                         ));
    
    return matchesCategory && matchesStatus && matchesSearch;
  });

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Loading state
  if (status === LOADING_STATES.LOADING) {
    return (
      <div>
        {/* Filter skeleton */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse flex-1"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32"></div>
          </div>
        </div>
        
        {/* Projects skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg animate-pulse">
              <div className="h-48 bg-gray-300 dark:bg-gray-600 rounded-t-lg"></div>
              <div className="p-6">
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
                <div className="flex gap-2 mb-4">
                  <div className="h-6 w-16 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                  <div className="h-6 w-20 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (status === LOADING_STATES.FAILED) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Failed to load projects
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
        <button
          onClick={() => dispatch(fetchProjects())}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors transform hover:scale-105"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty state (no projects at all)
  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📂</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No projects found
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Projects will appear here once they're added to the backend.
        </p>
      </div>
    );
  }

  // Success state with filters
  return (
    <div>
      {/* Filters Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search projects..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            />
          </div>
          
          {/* Category Filter */}
          <div>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            >
              <option value="all">All Categories</option>
              <option value="web development">Web Development</option>
              <option value="mobile app">Mobile App</option>
              <option value="desktop app">Desktop App</option>
              <option value="api">API</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          {/* Status Filter */}
          <div>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="in progress">In Progress</option>
              <option value="not started">Not Started</option>
            </select>
          </div>
        </div>

        {/* Filter Results Count */}
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredProjects.length} of {projects.length} projects
          {filters.search && (
            <span> matching "{filters.search}"</span>
          )}
          {filters.category !== 'all' && (
            <span> in {filters.category}</span>
          )}
        </div>
      </div>

      {/* Projects Grid or Filtered Empty State */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No projects match your filters
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Try adjusting your search criteria or filters to see more results.
          </p>
          <button
            onClick={() => setFilters({ category: 'all', status: 'all', search: '' })}
            className="px-4 py-2 text-blue-500 hover:text-blue-600 font-medium"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project._id || project.id}
              project={project}
              onClick={handleProjectClick}
            />
          ))}
        </div>
      )}

      {/* Show more button if you implement pagination later */}
      {projects.length > 0 && (
        <div className="text-center mt-12">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Total: {projects.length} projects loaded
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectList;
