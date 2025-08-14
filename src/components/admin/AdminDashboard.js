import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/reducers/authReducer';
import { fetchProjects, fetchProjectStats } from '../../redux/actions/projectActions';
import { getContactMessages, getContactStats } from '../../redux/actions/contactActions';
import { fetchSkills, fetchSkillStats } from '../../redux/actions/skillsActions';
import SkillsManagement from './SkillsManagement';
import ProjectsManagement from './ProjectsManagement';
import ContactsManagement from './ContactsManagement';
import { LOADING_STATES } from '../../utils/constants';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { projects = [], status: projectsStatus } = useSelector(state => state.projects || {});
  const { skills = [], status: skillsStatus, skillStats = {} } = useSelector(state => state.skills || {});
  const { contacts = [], status: contactsStatus } = useSelector(state => state.contact || {});
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [refreshInterval, setRefreshInterval] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchAllData = async () => {
        setIsInitialLoading(true);
        try {
          await Promise.allSettled([
            dispatch(fetchProjects()),
            dispatch(fetchSkills()),
            dispatch(getContactMessages({ force: true })),
            dispatch(fetchProjectStats()),
            dispatch(fetchSkillStats()),
            dispatch(getContactStats())
          ]);
          setLastUpdated(new Date());
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        } finally {
          setIsInitialLoading(false);
        }
      };

      fetchAllData();

      const interval = setInterval(() => {
        fetchAllData();
      }, 5 * 60 * 1000);
      setRefreshInterval(interval);

      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    }
  }, [isAuthenticated, dispatch]);

  const dashboardCounts = useMemo(() => {
    console.log('Calculating dashboard counts:', {
      projects: projects.length,
      skills: skills.length,
      contacts: contacts.length
    });

    const totalProjects = Array.isArray(projects) ? projects.length : 0;
    const completedProjects = Array.isArray(projects) 
      ? projects.filter(p => p.status === 'Completed' || p.status === 'completed').length : 0;
    const inProgressProjects = Array.isArray(projects) 
      ? projects.filter(p => p.status === 'In Progress' || p.status === 'in-progress').length : 0;
    const featuredProjects = Array.isArray(projects) 
      ? projects.filter(p => p.featured === true).length : 0;
    
    const totalSkills = Array.isArray(skills) 
      ? skills.reduce((total, category) => {
          return total + (Array.isArray(category?.items) ? category.items.length : 0);
        }, 0) 
      : 0;
    const skillCategories = Array.isArray(skills) ? skills.length : 0;
    
    const totalContacts = Array.isArray(contacts) ? contacts.length : 0;
    const unreadContacts = Array.isArray(contacts) 
      ? contacts.filter(c => !c.isRead && !c.read).length : 0;
    const repliedContacts = Array.isArray(contacts) 
      ? contacts.filter(c => c.status === 'replied' || c.isReplied).length : 0;
    const pendingContacts = Array.isArray(contacts) 
      ? contacts.filter(c => c.status === 'pending' || (!c.status && !c.isReplied)).length : 0;

    const recentProjects = Array.isArray(projects) 
      ? projects.filter(p => {
          if (!p.createdAt) return false;
          const projectDate = new Date(p.createdAt);
          const monthAgo = new Date();
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return projectDate >= monthAgo;
        }).length : 0;

    const recentContacts = Array.isArray(contacts) 
      ? contacts.filter(c => {
          if (!c.createdAt) return false;
          const contactDate = new Date(c.createdAt);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return contactDate >= weekAgo;
        }).length : 0;

    const completionRate = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;
    const responseRate = totalContacts > 0 ? Math.round((repliedContacts / totalContacts) * 100) : 0;

    return {
      totalProjects,
      completedProjects,
      inProgressProjects,
      featuredProjects,
      totalSkills,
      skillCategories,
      totalContacts,
      unreadContacts,
      repliedContacts,
      pendingContacts,
      recentProjects,
      recentContacts,
      completionRate,
      responseRate
    };
  }, [projects, skills, contacts]);

  const isAnyLoading = [projectsStatus, skillsStatus, contactsStatus].some(
    status => status === LOADING_STATES.LOADING
  );

  const handleLogout = () => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
    }
    dispatch(logout());
    navigate('/admin/login');
  };

  const handleRefreshData = async () => {
    setIsInitialLoading(true);
    try {
      await Promise.allSettled([
        dispatch(fetchProjects()),
        dispatch(fetchSkills()),
        dispatch(getContactMessages({ force: true })),
        dispatch(fetchProjectStats()),
        dispatch(fetchSkillStats()),
        dispatch(getContactStats())
      ]);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsInitialLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Authenticating...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: '📊',
      count: null
    },
    { 
      id: 'projects', 
      label: 'Projects', 
      icon: '📁',
      count: dashboardCounts.totalProjects,
      badge: dashboardCounts.inProgressProjects > 0 ? 'active' : null
    },
    { 
      id: 'skills', 
      label: 'Skills', 
      icon: '🛠️',
      count: dashboardCounts.totalSkills
    },
    { 
      id: 'contacts', 
      label: 'Messages', 
      icon: '📧',
      count: dashboardCounts.unreadContacts,
      badge: dashboardCounts.unreadContacts > 0 ? 'urgent' : null
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Welcome back, {user?.name || user?.email || 'Admin'}!
                {dashboardCounts.unreadContacts > 0 && (
                  <span className="ml-2 text-red-500">
                    • {dashboardCounts.unreadContacts} unread message{dashboardCounts.unreadContacts !== 1 ? 's' : ''}
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-4 text-sm">
                <span className="flex items-center text-green-600 dark:text-green-400">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                  Online
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  Updated: {lastUpdated.toLocaleTimeString()}
                </span>
                <button
                  onClick={handleRefreshData}
                  disabled={isInitialLoading}
                  className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50"
                  title="Refresh data"
                >
                  {isInitialLoading ? '⏳' : '🔄'}
                </button>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.count !== null && tab.count >= 0 && (
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    tab.badge === 'urgent' && tab.count > 0
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : tab.badge === 'active' && tab.count > 0
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : tab.count > 0
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {activeTab === 'dashboard' && (
          <div>
            {(isInitialLoading || isAnyLoading) && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Loading Dashboard Data
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Fetching latest data from database...
                </p>
              </div>
            )}

            {!isInitialLoading && !isAnyLoading && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center">
                      <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <span className="text-3xl">📁</span>
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Total Projects
                        </p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                          {dashboardCounts.totalProjects}
                        </p>
                        <div className="flex items-center space-x-4 text-xs mt-1">
                          <span className="text-green-600 dark:text-green-400">
                            ✅ {dashboardCounts.completedProjects} completed
                          </span>
                          <span className="text-yellow-600 dark:text-yellow-400">
                            ⏳ {dashboardCounts.inProgressProjects} active
                          </span>
                        </div>
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${dashboardCounts.completionRate}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">{dashboardCounts.completionRate}% completion rate</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center">
                      <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                        <span className="text-3xl">🛠️</span>
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Skills
                        </p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                          {dashboardCounts.totalSkills}
                        </p>
                        <div className="flex items-center space-x-4 text-xs mt-1">
                          <span className="text-blue-600 dark:text-blue-400">
                            📁 {dashboardCounts.skillCategories} categories
                          </span>
                          <span className="text-purple-600 dark:text-purple-400">
                            ⭐ {skillStats.featuredSkills || 0} featured
                          </span>
                        </div>
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${(skillStats.averageSkillLevel || 0) * 10}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">
                            {Math.round((skillStats.averageSkillLevel || 0) * 10)}% avg proficiency
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center">
                      <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                        <span className="text-3xl">📧</span>
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Messages
                        </p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                          {dashboardCounts.totalContacts}
                        </p>
                        <div className="flex items-center space-x-4 text-xs mt-1">
                          <span className="text-red-600 dark:text-red-400">
                            {dashboardCounts.unreadContacts} unread
                          </span>
                          <span className="text-green-600 dark:text-green-400">
                            {dashboardCounts.repliedContacts} replied
                          </span>
                        </div>
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${dashboardCounts.responseRate}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">{dashboardCounts.responseRate}% response rate</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center">
                      <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                        <span className="text-3xl">⭐</span>
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Featured
                        </p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                          {dashboardCounts.featuredProjects}
                        </p>
                        <p className="text-xs text-purple-600 dark:text-purple-400">
                          projects highlighted
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Recent Projects ({dashboardCounts.totalProjects})
                        </h2>
                        <button 
                          onClick={() => setActiveTab('projects')}
                          className="text-blue-500 hover:text-blue-600 text-sm"
                        >
                          View All
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        {Array.isArray(projects) && [...projects]
                          .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
                          .slice(0, 5)
                          .map((project, index) => (
                          <div key={project._id || index} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
                            <div className="flex items-center space-x-3">
                              <span className={`w-3 h-3 rounded-full ${
                                project.status === 'Completed' ? 'bg-green-500' :
                                project.status === 'In Progress' ? 'bg-yellow-500' : 'bg-gray-400'
                              }`}></span>
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {project.title || 'Untitled Project'}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {project.category || 'No Category'} • {project.status || 'No Status'}
                                </p>
                                {project.createdAt && (
                                  <p className="text-xs text-gray-400">
                                    Created: {new Date(project.createdAt).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {project.featured && <span className="text-yellow-500 text-sm">⭐</span>}
                              <span className="text-xs text-gray-400">
                                {Array.isArray(project.technologies) ? project.technologies.length : 0} techs
                              </span>
                            </div>
                          </div>
                        ))}
                        {(!Array.isArray(projects) || projects.length === 0) && (
                          <div className="text-center py-8">
                            <p className="text-gray-500 dark:text-gray-400">No projects yet</p>
                            <button 
                              onClick={() => setActiveTab('projects')}
                              className="mt-2 text-blue-500 hover:text-blue-600 text-sm"
                            >
                              Create your first project
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Recent Messages ({dashboardCounts.totalContacts})
                        </h2>
                        <button 
                          onClick={() => setActiveTab('contacts')}
                          className="text-blue-500 hover:text-blue-600 text-sm"
                        >
                          View All
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        {Array.isArray(contacts) && [...contacts]
                          .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
                          .slice(0, 5)
                          .map((contact, index) => (
                          <div key={contact._id || index} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
                            <div className="flex items-center space-x-3">
                              <span className={`w-3 h-3 rounded-full ${
                                !contact.isRead ? 'bg-blue-500' : 'bg-gray-400'
                              }`}></span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                  {contact.name || 'No Name'}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                  {contact.subject || contact.message?.substring(0, 30) + '...' || 'No Subject'}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {contact.email}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-xs text-gray-400">
                                {contact.createdAt ? new Date(contact.createdAt).toLocaleDateString() : 'N/A'}
                              </span>
                              {contact.status === 'replied' && (
                                <span className="block text-xs text-green-500">✓ Replied</span>
                              )}
                              {!contact.isRead && (
                                <span className="block text-xs text-blue-500">● New</span>
                              )}
                            </div>
                          </div>
                        ))}
                        {(!Array.isArray(contacts) || contacts.length === 0) && (
                          <div className="text-center py-8">
                            <p className="text-gray-500 dark:text-gray-400">No messages yet</p>
                            <p className="mt-1 text-xs text-gray-400">
                              Messages from your contact form will appear here
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Quick Actions
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <button 
                        onClick={() => setActiveTab('projects')}
                        className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors text-left group"
                      >
                        <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform">📝</span>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Manage Projects</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {dashboardCounts.totalProjects} total • {dashboardCounts.featuredProjects} featured
                        </p>
                        <div className="mt-2 text-xs text-gray-500">
                          {dashboardCounts.recentProjects} added this month
                        </div>
                      </button>

                      <button 
                        onClick={() => setActiveTab('skills')}
                        className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors text-left group"
                      >
                        <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform">🛠️</span>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Manage Skills</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {dashboardCounts.totalSkills} skills • {dashboardCounts.skillCategories} categories
                        </p>
                        <div className="mt-2 text-xs text-gray-500">
                          {skillStats.recentSkills || 0} added this month
                        </div>
                      </button>

                      <button 
                        onClick={() => setActiveTab('contacts')}
                        className="p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/40 transition-colors text-left group"
                      >
                        <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform">📧</span>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">View Messages</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {dashboardCounts.unreadContacts} unread • {dashboardCounts.totalContacts} total
                        </p>
                        <div className="mt-2 text-xs text-gray-500">
                          {dashboardCounts.recentContacts} this week
                        </div>
                      </button>

                      <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-left">
                        <span className="text-3xl mb-3 block">📈</span>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Portfolio Stats</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {dashboardCounts.completionRate}% completion rate
                        </p>
                        <div className="mt-2 text-xs text-gray-500">
                          {dashboardCounts.responseRate}% response rate
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'projects' && <ProjectsManagement />}
        {activeTab === 'skills' && <SkillsManagement />}
        {activeTab === 'contacts' && <ContactsManagement />}
      </main>
    </div>
  );
};

export default AdminDashboard;
