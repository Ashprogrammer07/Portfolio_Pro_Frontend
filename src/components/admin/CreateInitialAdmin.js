import React, { useState } from 'react';
import { adminAPI } from '../../services/api';

const CreateInitialAdmin = ({ onAdminCreated }) => {
  const [formData, setFormData] = useState({
    name: 'Portfolio Admin',
    email: 'admin@portfolio.com',
    password: 'admin123'
  });
  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    setMessage('');

    try {
      const response = await adminAPI.createInitial(formData);
      setMessage('✅ Admin account created successfully!');
      if (onAdminCreated) onAdminCreated();
    } catch (error) {
      setMessage('❌ ' + (error.message || 'Failed to create admin account'));
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        Create Initial Admin Account
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Admin Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Admin Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Admin Password
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isCreating}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            isCreating 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
        >
          {isCreating ? 'Creating Admin...' : 'Create Admin Account'}
        </button>

        {message && (
          <div className={`p-3 rounded-lg text-center ${
            message.includes('✅') 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateInitialAdmin;
