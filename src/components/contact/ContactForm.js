import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { sendContactForm } from '../../redux/actions/contactActions';
import { resetContactForm } from '../../redux/reducers/contactReducer';
import { isValidEmail } from '../../utils/helpers';
import { LOADING_STATES } from '../../utils/constants';

const ContactForm = () => {
  const dispatch = useDispatch();
  const { status, message, error } = useSelector(state => state.contact);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Reset form and status when component mounts
  useEffect(() => {
    dispatch(resetContactForm());
  }, [dispatch]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle input blur (for validation)
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    validateField(name, formData[name]);
  };

  // Validate individual field
  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'name':
        if (!value.trim()) error = 'Name is required';
        else if (value.length < 2) error = 'Name must be at least 2 characters';
        break;
      case 'email':
        if (!value.trim()) error = 'Email is required';
        else if (!isValidEmail(value)) error = 'Please enter a valid email';
        break;
      case 'subject':
        if (!value.trim()) error = 'Subject is required';
        else if (value.length < 3) error = 'Subject must be at least 3 characters';
        break;
      case 'message':
        if (!value.trim()) error = 'Message is required';
        else if (value.length < 10) error = 'Message must be at least 10 characters';
        break;
      default:
        break;
    }
    
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
    
    return !error;
  };

  // Validate entire form
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    Object.keys(formData).forEach(key => {
      if (!validateField(key, formData[key])) {
        isValid = false;
      }
    });
    
    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      subject: true,
      message: true
    });
    
    return isValid;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    dispatch(sendContactForm(formData));
  };

  // Reset form after successful submission
  useEffect(() => {
    if (status === LOADING_STATES.SUCCEEDED) {
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setTouched({});
      setErrors({});
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        dispatch(resetContactForm());
      }, 5000);
    }
  }, [status, dispatch]);

  const isLoading = status === LOADING_STATES.LOADING;

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Success Message */}
        {status === LOADING_STATES.SUCCEEDED && message && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center">
              <span className="text-green-600 dark:text-green-400 text-xl mr-3">✅</span>
              <p className="text-green-800 dark:text-green-300 font-medium">{message}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {status === LOADING_STATES.FAILED && error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center">
              <span className="text-red-600 dark:text-red-400 text-xl mr-3">❌</span>
              <p className="text-red-800 dark:text-red-300 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isLoading}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:bg-gray-800 dark:text-white ${
              touched.name && errors.name 
                ? 'border-red-500 dark:border-red-500' 
                : 'border-gray-300 dark:border-gray-600'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            placeholder="Enter your full name"
          />
          {touched.name && errors.name && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isLoading}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:bg-gray-800 dark:text-white ${
              touched.email && errors.email 
                ? 'border-red-500 dark:border-red-500' 
                : 'border-gray-300 dark:border-gray-600'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            placeholder="Enter your email address"
          />
          {touched.email && errors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
          )}
        </div>

        {/* Subject Field */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Subject *
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isLoading}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:bg-gray-800 dark:text-white ${
              touched.subject && errors.subject 
                ? 'border-red-500 dark:border-red-500' 
                : 'border-gray-300 dark:border-gray-600'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            placeholder="What's this about?"
          />
          {touched.subject && errors.subject && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.subject}</p>
          )}
        </div>

        {/* Message Field */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            value={formData.message}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isLoading}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical dark:bg-gray-800 dark:text-white ${
              touched.message && errors.message 
                ? 'border-red-500 dark:border-red-500' 
                : 'border-gray-300 dark:border-gray-600'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            placeholder="Tell me about your project or how I can help..."
          />
          {touched.message && errors.message && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg transition-all duration-200 ${
              isLoading 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-blue-600 hover:scale-105 active:scale-95'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Sending Message...
              </div>
            ) : (
              'Send Message'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
