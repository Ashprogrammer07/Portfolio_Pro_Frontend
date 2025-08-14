import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSkills, addSkill, updateSkill, deleteSkill, fetchSkillStats } from '../../redux/actions/skillsActions';
import { LOADING_STATES } from '../../utils/constants';

const SkillsManagement = () => {
  const dispatch = useDispatch();
  const { isAuthenticated ,user} = useSelector(state => state.auth);
  const { skills = [], status, error } = useSelector(state => state.skills || {});
  
  const [newSkill, setNewSkill] = useState({
    category: '',
    icon: '',
    name: '',
    level: 5,
    color: 'bg-blue-500',
    description: '',
    yearsOfExperience: 0
  });

  const [editingSkill, setEditingSkill] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const colorOptions = [
    'bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-yellow-500',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-cyan-500',
    'bg-orange-500', 'bg-teal-500', 'bg-emerald-500', 'bg-violet-500'
  ];

  

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchSkills(true));
    }
  }, [dispatch, isAuthenticated]);

  const handleAddSkill = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const skillData = {
        name: newSkill.name.trim(),
        category: newSkill.category.trim(),
        level: parseInt(newSkill.level),
        icon: newSkill.icon || '🔧',
        color: newSkill.color,
        description: newSkill.description.trim(),
        yearsOfExperience: parseInt(newSkill.yearsOfExperience) || 0,
        isActive: true,
        order: 0,
        user
      };

      const result = await dispatch(addSkill(skillData));
      
      if (result.success) {
        setNewSkill({ 
          category: '', 
          icon: '', 
          name: '', 
          level: 5, 
          color: 'bg-blue-500', 
          description: '',
          yearsOfExperience: 0
        });
        setShowAddForm(false);
        
        setTimeout(() => {
          dispatch(fetchSkills(true));
        }, 500);
      } else {
        alert('Failed to add skill: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      alert('Error adding skill. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSkill = async (skillId) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await dispatch(deleteSkill(skillId));
      if (result.success) {
        setTimeout(() => {
          dispatch(fetchSkills(true));
        }, 500);
      } else {
        alert('Failed to delete skill: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      alert('Error deleting skill. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSkill = (skill, category) => {
    setEditingSkill({
      _id: skill._id,
      name: skill.name,
      level: skill.level,
      color: skill.color || 'bg-blue-500',
      category: category.category,
      description: skill.description || '',
      icon: category.icon || '🔧',
      yearsOfExperience: skill.yearsOfExperience || 0
    });
  };

  const handleUpdateSkill = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const updatedSkillData = {
        _id: editingSkill._id,
        name: editingSkill.name.trim(),
        category: editingSkill.category.trim(),
        level: parseInt(editingSkill.level),
        color: editingSkill.color,
        description: editingSkill.description.trim(),
        yearsOfExperience: parseInt(editingSkill.yearsOfExperience) || 0,
        isActive: true
      };

      const result = await dispatch(updateSkill(updatedSkillData));
      
      if (result.success) {
        setEditingSkill(null);
        
        setTimeout(() => {
          dispatch(fetchSkills(true));
        }, 500);
      } else {
        alert('Failed to update skill: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      alert('Error updating skill. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefreshSkills = () => {
    dispatch(fetchSkills(true));
    dispatch(fetchSkillStats());
  };

  const filteredSkills = Array.isArray(skills) ? skills.filter(category => {
    if (filterCategory && category.category !== filterCategory) return false;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return category.category.toLowerCase().includes(searchLower) ||
             category.items?.some(skill => skill.name.toLowerCase().includes(searchLower));
    }
    return true;
  }) : [];

  const allCategories = Array.isArray(skills) ? [...new Set(skills.map(cat => cat.category))] : [];
  const totalSkills = Array.isArray(skills) ? skills.reduce((total, cat) => total + (cat.items?.length || 0), 0) : 0;

  if (!isAuthenticated) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Access denied. Please login as admin.</p>
      </div>
    );
  }

  if (status === LOADING_STATES.LOADING) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Loading skills...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Skills Management
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {totalSkills} total skills across {allCategories.length} categories
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRefreshSkills}
            disabled={isSubmitting || status === LOADING_STATES.LOADING}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            🔄 Refresh
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            disabled={isSubmitting}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            ➕ Add Skill
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <div className="flex justify-between items-center">
            <div>
              <strong>Error:</strong> {error}
            </div>
            <button 
              onClick={handleRefreshSkills} 
              className="ml-4 text-red-800 underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search Skills
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by skill name or category..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filter by Category
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Categories ({allCategories.length})</option>
              {allCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {(showAddForm || editingSkill) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              {editingSkill ? 'Edit Skill' : 'Add New Skill'}
            </h3>
            
            <form onSubmit={editingSkill ? handleUpdateSkill : handleAddSkill} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category *
                  </label>
                  <input
                    type="text"
                    value={editingSkill ? editingSkill.category : newSkill.category}
                    onChange={(e) => editingSkill 
                      ? setEditingSkill({...editingSkill, category: e.target.value})
                      : setNewSkill({...newSkill, category: e.target.value})
                    }
                    placeholder="e.g., Frontend Development"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Skill Name *
                  </label>
                  <input
                    type="text"
                    value={editingSkill ? editingSkill.name : newSkill.name}
                    onChange={(e) => editingSkill 
                      ? setEditingSkill({...editingSkill, name: e.target.value})
                      : setNewSkill({...newSkill, name: e.target.value})
                    }
                    placeholder="e.g., React"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {!editingSkill && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Icon (emoji)
                    </label>
                    <input
                      type="text"
                      value={newSkill.icon}
                      onChange={(e) => setNewSkill({...newSkill, icon: e.target.value})}
                      placeholder="🎨"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={editingSkill ? editingSkill.yearsOfExperience : newSkill.yearsOfExperience}
                    onChange={(e) => editingSkill 
                      ? setEditingSkill({...editingSkill, yearsOfExperience: e.target.value})
                      : setNewSkill({...newSkill, yearsOfExperience: e.target.value})
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={editingSkill ? editingSkill.description : newSkill.description}
                  onChange={(e) => editingSkill 
                    ? setEditingSkill({...editingSkill, description: e.target.value})
                    : setNewSkill({...newSkill, description: e.target.value})
                  }
                  placeholder="Brief description of your experience with this skill"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

             

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color Theme
                </label>
                <div className="flex flex-wrap gap-3">
                  {colorOptions.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => editingSkill 
                        ? setEditingSkill({...editingSkill, color})
                        : setNewSkill({...newSkill, color})
                      }
                      className={`w-10 h-10 rounded-full ${color} border-2 ${
                        (editingSkill ? editingSkill.color : newSkill.color) === color 
                        ? 'border-gray-900 dark:border-white scale-110' 
                        : 'border-transparent hover:scale-105'
                      } transition-all duration-200`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex space-x-4 pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? '⏳ Saving...' : (editingSkill ? 'Update' : 'Add')} Skill
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingSkill(null);
                  }}
                  className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-8">
        {filteredSkills.length > 0 ? (
          filteredSkills.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <span className="text-3xl mr-4">{category.icon || '🔧'}</span>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {category.category}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {category.items?.length || 0} skills
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.isArray(category.items) && category.items.map((skill, skillIndex) => (
                  <div key={skill._id || skillIndex} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {skill.name}
                        </h4>
                       
                        {skill.yearsOfExperience > 0 && (
                          <div className="text-xs text-gray-400 mt-1">
                            {skill.yearsOfExperience} year{skill.yearsOfExperience !== 1 ? 's' : ''} experience
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 ml-2">
                        <button
                          onClick={() => handleEditSkill(skill, category)}
                          className="text-blue-500 hover:text-blue-600 p-1"
                          disabled={isSubmitting}
                          title="Edit skill"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteSkill(skill._id)}
                          className="text-red-500 hover:text-red-600 p-1"
                          disabled={isSubmitting}
                          title="Delete skill"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    
                    {skill.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        {skill.description}
                      </p>
                    )}
                    
                    
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">🛠️</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {searchTerm || filterCategory ? 'No Skills Found' : 'No Skills Yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              {searchTerm || filterCategory 
                ? 'Try adjusting your search or filter criteria.'
                : 'Start building your skills portfolio by adding your first skill.'}
            </p>
            {!searchTerm && !filterCategory && (
              <button
                onClick={() => setShowAddForm(true)}
                className="px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-lg"
              >
                ➕ Add Your First Skill
              </button>
            )}
          </div>
        )}
      </div>

      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-40">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-700 dark:text-gray-300">Processing...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsManagement;
