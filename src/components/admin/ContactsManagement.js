import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getContactMessages, updateContactMessage, deleteContactMessage } from '../../redux/actions/contactActions';
import { LOADING_STATES } from '../../utils/constants';

const ContactsManagement = () => {
  const dispatch = useDispatch();
  const { contacts = [], status, error } = useSelector(state => state.contact);
  const { isAuthenticated } = useSelector(state => state.auth);
  
  const [selectedContact, setSelectedContact] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getContactMessages());
    }
  }, [dispatch, isAuthenticated]);

  // Calculate real-time stats from contacts array
  const contactStats = {
    total: contacts.length,
    unread: contacts.filter(c => !c.isRead).length,
    replied: contacts.filter(c => c.status === 'replied').length,
    thisWeek: contacts.filter(c => {
      const contactDate = new Date(c.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return contactDate >= weekAgo;
    }).length
  };

  const handleViewContact = async (contact) => {
    setSelectedContact(contact);
    setShowModal(true);
    
    // Mark as read if not already read
    if (!contact.isRead) {
      try {
        await dispatch(updateContactMessage(contact._id, { isRead: true }));
        // Refresh the contacts list
        dispatch(getContactMessages());
      } catch (error) {
        console.error('Error marking as read:', error);
      }
    }
  };

  const handleMarkAsRead = async (contactId, event) => {
    event.stopPropagation();
    try {
      await dispatch(updateContactMessage(contactId, { isRead: true }));
      dispatch(getContactMessages());
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAsUnread = async (contactId, event) => {
    event.stopPropagation();
    try {
      await dispatch(updateContactMessage(contactId, { isRead: false }));
      dispatch(getContactMessages());
    } catch (error) {
      console.error('Error marking as unread:', error);
    }
  };

  const handleReply = async (contactId) => {
    try {
      await dispatch(updateContactMessage(contactId, { 
        status: 'replied',
        isRead: true,
        repliedAt: new Date()
      }));
      dispatch(getContactMessages());
      setShowModal(false);
    } catch (error) {
      console.error('Error marking as replied:', error);
    }
  };

  const handleDelete = async (contactId, event) => {
    if (event) event.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this contact message? This action cannot be undone.')) {
      try {
        const result = await dispatch(deleteContactMessage(contactId));
        if (result.success !== false) {
          dispatch(getContactMessages());
          if (selectedContact && selectedContact._id === contactId) {
            setShowModal(false);
          }
        }
      } catch (error) {
        console.error('Error deleting contact:', error);
      }
    }
  };

  // Filter and sort contacts
  const filteredContacts = contacts
    .filter(contact => {
      // Status filter
      if (filterStatus === 'unread' && contact.isRead) return false;
      if (filterStatus === 'read' && !contact.isRead) return false;
      if (filterStatus === 'replied' && contact.status !== 'replied') return false;
      
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          contact.name?.toLowerCase().includes(searchLower) ||
          contact.email?.toLowerCase().includes(searchLower) ||
          contact.subject?.toLowerCase().includes(searchLower) ||
          contact.message?.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'unread':
          return (!a.isRead && b.isRead) ? -1 : (a.isRead && !b.isRead) ? 1 : 0;
        default:
          return 0;
      }
    });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 text-6xl mb-4">🔒</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Access Denied
        </h3>
        <p className="text-red-500">Please login as admin to manage contacts.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Contact Messages
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage contact form submissions and inquiries
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <span className="text-2xl">📧</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Messages</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {contactStats.total}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <span className="text-2xl">🔴</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Unread</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {contactStats.unread}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Replied</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {contactStats.replied}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <span className="text-2xl">📅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This Week</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {contactStats.thisWeek}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search Messages
              </label>
              <input
                type="text"
                placeholder="Search by name, email, subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Filter by Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Messages</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
                <option value="replied">Replied</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sort by
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name A-Z</option>
                <option value="unread">Unread First</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {status === LOADING_STATES.LOADING && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading messages...</p>
        </div>
      )}

      {/* Error State */}
      {status === LOADING_STATES.FAILED && (
        <div className="text-center py-8">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Failed to load messages
          </h3>
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => dispatch(getContactMessages())}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Messages List */}
      {status !== LOADING_STATES.LOADING && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          {filteredContacts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {searchTerm || filterStatus !== 'all' ? 'No matching messages' : 'No messages yet'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Contact form submissions will appear here.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredContacts.map((contact) => (
                <div
                  key={contact._id}
                  className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                    !contact.isRead ? 'bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500' : ''
                  }`}
                  onClick={() => handleViewContact(contact)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                          {contact.name || 'No Name'}
                        </h3>
                        {!contact.isRead && (
                          <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                        {contact.status === 'replied' && (
                          <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs rounded-full">
                            Replied
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {contact.email || 'No Email'}
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        {contact.subject || 'No Subject'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {contact.message || 'No Message'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {formatDate(contact.createdAt)}
                      </p>
                    </div>
                    
                    <div className="ml-4 flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          contact.isRead ? handleMarkAsUnread(contact._id, e) : handleMarkAsRead(contact._id, e);
                        }}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        title={contact.isRead ? 'Mark as unread' : 'Mark as read'}
                      >
                        {contact.isRead ? '📖' : '📧'}
                      </button>
                      <button
                        onClick={(e) => handleDelete(contact._id, e)}
                        className="p-2 text-red-400 hover:text-red-600"
                        title="Delete message"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Contact Detail Modal */}
      {showModal && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-2xl w-full mx-4 my-8">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Contact Message Details
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <p className="text-gray-900 dark:text-white">{selectedContact.name || 'No Name'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <a 
                  href={`mailto:${selectedContact.email}`}
                  className="text-blue-500 hover:text-blue-600"
                >
                  {selectedContact.email || 'No Email'}
                </a>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Subject
                </label>
                <p className="text-gray-900 dark:text-white">{selectedContact.subject || 'No Subject'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Message
                </label>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                    {selectedContact.message || 'No Message'}
                  </p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Received
                </label>
                <p className="text-gray-600 dark:text-gray-400">
                  {formatDate(selectedContact.createdAt)}
                </p>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    selectedContact.isRead 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {selectedContact.isRead ? 'Read' : 'Unread'}
                  </span>
                  {selectedContact.status === 'replied' && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm">
                      Replied
                    </span>
                  )}
                </div>
                
                <div className="flex space-x-3">
                  <a
                    href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    onClick={() => handleReply(selectedContact._id)}
                  >
                    📧 Reply
                  </a>
                  <button
                    onClick={() => handleDelete(selectedContact._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactsManagement;
