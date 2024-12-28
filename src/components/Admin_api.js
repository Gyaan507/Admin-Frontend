import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserCog, FaUser, FaEnvelope, FaLock, FaPhone, FaUserShield } from 'react-icons/fa';
import ComplexNavbar from '../common/ComplexNavbar';
import DefaultSidebar from '../common/DefaultSidebar';
import '../App.css';

const Admin_api = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ 
    email: '', 
    first_name: '', 
    last_name: '', 
    password: '', 
    mobile: '', 
    role: 'ADMIN' 
  });
  const [switchUser, setSwitchUser] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [activeTab, setActiveTab] = useState('add'); // 'add' or 'switch'

  useEffect(() => {
    // Get current user from localStorage
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://65.108.241.215:8000/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      showNotification('Error fetching users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 5000);
  };

  const handleInputChange = (e, form) => {
    if (form === 'newUser') {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    } else if (form === 'switchUser') {
      setSwitchUser({ ...switchUser, [e.target.name]: e.target.value });
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://65.108.241.215:8000/api/users', formData);
      setUsers([...users, response.data]);
      setFormData({ email: '', first_name: '', last_name: '', password: '', mobile: '', role: 'ADMIN' });
      showNotification('User added successfully!', 'success');
    } catch (error) {
      console.error('Error adding user:', error);
      showNotification('Error adding user', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Implement switch user logic here
      showNotification('User switched successfully!', 'success');
    } catch (error) {
      console.error('Error switching user:', error);
      showNotification('Error switching user', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <ComplexNavbar />
      <div className="page-container">
        <DefaultSidebar />
        <div className="admin-main-content">
          <div className="admin-header-bar">
            <h1>Admin Panel</h1>
            <div className="current-user-indicator">
              {currentUser?.role === 'ADMIN' ? (
                <FaUserCog className="user-icon admin" />
              ) : (
                <FaUser className="user-icon" />
              )}
              <span>{currentUser?.first_name || 'User'}</span>
              <span className="user-role">({currentUser?.role || 'USER'})</span>
            </div>
          </div>
          <div className="admin-content-wrapper">
            <div className="admin-tabs">
              <button 
                className={`admin-tab ${activeTab === 'add' ? 'active' : ''}`}
                onClick={() => setActiveTab('add')}
              >
                Add User
              </button>
              <button 
                className={`admin-tab ${activeTab === 'switch' ? 'active' : ''}`}
                onClick={() => setActiveTab('switch')}
              >
                Switch User
              </button>
            </div>

            <div className="admin-form-container">
              {activeTab === 'add' ? (
                <div className="admin-form-card">
                  <form onSubmit={handleAddUser} className="admin-form">
                    <div className="admin-form-row">
                      <div className="admin-form-group">
                        <div className="input-icon-wrapper">
                          <FaEnvelope className="input-icon" />
                          <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={(e) => handleInputChange(e, 'newUser')}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="admin-form-row">
                      <div className="admin-form-group">
                        <div className="input-icon-wrapper">
                          <FaUser className="input-icon" />
                          <input
                            type="text"
                            name="first_name"
                            placeholder="First Name"
                            value={formData.first_name}
                            onChange={(e) => handleInputChange(e, 'newUser')}
                            required
                          />
                        </div>
                      </div>
                      <div className="admin-form-group">
                        <div className="input-icon-wrapper">
                          <FaUser className="input-icon" />
                          <input
                            type="text"
                            name="last_name"
                            placeholder="Last Name"
                            value={formData.last_name}
                            onChange={(e) => handleInputChange(e, 'newUser')}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="admin-form-row">
                      <div className="admin-form-group">
                        <div className="input-icon-wrapper">
                          <FaLock className="input-icon" />
                          <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) => handleInputChange(e, 'newUser')}
                            required
                          />
                        </div>
                      </div>
                      <div className="admin-form-group">
                        <div className="input-icon-wrapper">
                          <FaPhone className="input-icon" />
                          <input
                            type="tel"
                            name="mobile"
                            placeholder="Mobile"
                            value={formData.mobile}
                            onChange={(e) => handleInputChange(e, 'newUser')}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="admin-form-row">
                      <div className="admin-form-group full-width">
                        <div className="input-icon-wrapper">
                          <FaUserShield className="input-icon" />
                          <select
                            name="role"
                            value={formData.role}
                            onChange={(e) => handleInputChange(e, 'newUser')}
                            required
                          >
                            <option value="ADMIN">Admin</option>
                            <option value="USER">User</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <button type="submit" className="admin-submit-button" disabled={loading}>
                      {loading ? 'Adding...' : 'Add User'}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="admin-form-card">
                  <form onSubmit={handleSwitchUser} className="admin-form">
                    <div className="admin-form-group">
                      <div className="input-icon-wrapper">
                        <FaEnvelope className="input-icon" />
                        <input
                          type="email"
                          name="email"
                          placeholder="Email"
                          value={switchUser.email}
                          onChange={(e) => handleInputChange(e, 'switchUser')}
                          required
                        />
                      </div>
                    </div>
                    <div className="admin-form-group">
                      <div className="input-icon-wrapper">
                        <FaLock className="input-icon" />
                        <input
                          type="password"
                          name="password"
                          placeholder="Password"
                          value={switchUser.password}
                          onChange={(e) => handleInputChange(e, 'switchUser')}
                          required
                        />
                      </div>
                    </div>
                    <button type="submit" className="admin-submit-button" disabled={loading}>
                      {loading ? 'Switching...' : 'Switch User'}
                    </button>
                  </form>
                </div>
              )}
            </div>

            {notification.message && (
              <div className={`notification ${notification.type}`}>
                {notification.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin_api;

