import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSkills } from '../redux/actions/skillsActions';
import { LOADING_STATES } from '../utils/constants';

const Skills = () => {
  const dispatch = useDispatch();
  const { skills, status, error } = useSelector(state => state.skills);

  useEffect(() => {
    if (status === LOADING_STATES.IDLE) {
      dispatch(fetchSkills());
    }
  }, [status, dispatch]);

  // Default skills if none loaded from backend
  const defaultSkills = [
    {
      id: 1,
      category: "Frontend Development",
      icon: "🎨",
      items: [
        { name: "React", level: 95, color: "bg-blue-500" },
        { name: "JavaScript", level: 90, color: "bg-yellow-500" },
        { name: "TypeScript", level: 85, color: "bg-blue-600" },
        { name: "Vue.js", level: 80, color: "bg-green-500" },
        { name: "HTML/CSS", level: 95, color: "bg-orange-500" },
        { name: "Tailwind CSS", level: 90, color: "bg-cyan-500" },
      ]
    },
    {
      id: 2,
      category: "Backend Development",
      icon: "⚙️",
      items: [
        { name: "Node.js", level: 90, color: "bg-green-600" },
        { name: "Express.js", level: 85, color: "bg-gray-600" },
        { name: "Python", level: 80, color: "bg-blue-400" },
        { name: "MongoDB", level: 85, color: "bg-green-500" },
        { name: "PostgreSQL", level: 80, color: "bg-blue-700" },
        { name: "REST APIs", level: 90, color: "bg-purple-500" },
      ]
    }
  ];

  // Use skills from Redux or default skills
  const displaySkills = skills.length > 0 ? skills : defaultSkills;

  const certifications = [
    {
      name: "Full Stack Web Development",
      issuer: "Devtown",
      date: "2025",
      icon: "☁️"
    },
    {
      name: "React Developer Certification",
      issuer: "Codechef",
      date: "2025",
      icon: "⚛️"
    },
    {
      name: "JavaScript Algorithms",
      issuer: "freeCodeCamp",
      date: "2025",
      icon: "🏆"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            My Skills
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A comprehensive overview of my technical expertise and proficiency levels
          </p>
        </div>

        {/* Loading State */}
        {status === LOADING_STATES.LOADING && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-300 mt-4">Loading skills...</p>
          </div>
        )}

        {/* Error State */}
        {status === LOADING_STATES.FAILED && (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => dispatch(fetchSkills())}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Skills Categories */}
        <div className="space-y-12 mb-16">
          {displaySkills.map((category, categoryIndex) => (
            <div key={category.id || categoryIndex} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-8">
                <span className="text-3xl mr-4">{category.icon}</span>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{category.category}</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {category.items && category.items.map((skill, skillIndex) => (
                  <div key={skillIndex} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="inline-block px-5 py-2 text-base font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full shadow-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300">
  {skill.name}
</span>



                      
                    </div>
                   
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Certifications */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Certifications & Achievements
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {certifications.map((cert, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">{cert.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{cert.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-2">{cert.issuer}</p>
                <span className="text-blue-500 text-sm">{cert.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Summary */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Collaborate?</h2>
          <p className="text-lg mb-6 opacity-90">
            With expertise across the full development stack, I'm ready to bring your ideas to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors transform hover:scale-105"
            >
              Start a Project
            </a>
            <a
              href="/projects"
              className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105"
            >
              View My Work
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skills;
