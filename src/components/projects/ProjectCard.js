import React from 'react';
import { truncateText, formatDate } from '../../utils/helpers';

const ProjectCard = ({ project, onClick }) => {
  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
      onClick={() => onClick && onClick(project)}
    >
      {/* Project Image */}
      {(project.image || project.images?.[0]) && (
        <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-t-lg overflow-hidden">
          <img 
            src={project.image || project.images[0]} 
            alt={project.title}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
        </div>
      )}
      
      {/* Project Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {project.title}
          </h3>
          {project.status && (
            <span className={`px-2 py-1 text-xs rounded-full ${
              project.status === 'Completed' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : project.status === 'In Progress'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            }`}>
              {project.status}
            </span>
          )}
        </div>

        {/* Category */}
        {project.category && (
          <div className="mb-3">
            <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm px-2 py-1 rounded">
              {project.category}
            </span>
          </div>
        )}
        
        <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
          {truncateText(project.shortDescription || project.description, 120)}
        </p>
        
        {/* Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.slice(0, 4).map((tech, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm rounded-full"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm rounded-full">
                +{project.technologies.length - 4} more
              </span>
            )}
          </div>
        )}
        
        {/* Project Links */}
        <div className="flex justify-between items-center">
          <div className="flex space-x-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                Live Demo
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                GitHub
              </a>
            )}
          </div>
          
          {project.createdAt && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(project.createdAt)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
