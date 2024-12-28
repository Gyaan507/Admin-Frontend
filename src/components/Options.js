import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaBuilding, FaIndustry, FaUserTie, FaBriefcase, FaGraduationCap } from 'react-icons/fa';
import ComplexNavbar from '../common/ComplexNavbar';
import DefaultSidebar from '../common/DefaultSidebar';
import '../App.css';

const Options = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Departments');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [updateItemName, setUpdateItemName] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [newItemName, setNewItemName] = useState('');

  const managementItems = [
    { title: 'Departments', icon: FaBuilding, apiPath: 'departments/departments/', updatePath: 'departments/departments', deletePath: 'departments/departments' },
    { title: 'Industries', icon: FaIndustry, apiPath: 'industries/', updatePath: 'industries', deletePath: 'industries' },
    { title: 'Roles', icon: FaUserTie, apiPath: 'role', updatePath: 'role', deletePath: 'role' },
    { title: 'Job Types', icon: FaBriefcase, apiPath: 'job_types/', updatePath: 'job_types', deletePath: 'job_types' },
    { title: 'Specializations', icon: FaGraduationCap, apiPath: 'specializations/', updatePath: 'specializations', deletePath: 'specializations' }
  ];

  const getApiDetails = () => {
    return managementItems.find(item => item.title === activeTab) || {};
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const { apiPath } = getApiDetails();
      console.log(`Fetching ${activeTab} from: http://127.0.0.1:8000/api/${apiPath}`);
      const response = await axios.get(`http://127.0.0.1:8000/api/${apiPath}`);
      console.log(`${activeTab} data:`, response.data);
      
      // Ensure that the response data is always an array
      const itemsArray = Array.isArray(response.data) ? response.data : [response.data];
      setItems(itemsArray);
    } catch (error) {
      console.error(`Error fetching ${activeTab}:`, error);
      showNotification(`Error fetching ${activeTab}: ${error.message}`, 'error');
      setItems([]); // Set items to an empty array in case of error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [activeTab]);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 5000);
  };

  const handleAdd = async () => {
    if (!newItemName.trim()) {
      showNotification('Name cannot be empty.', 'warning');
      return;
    }
    setLoading(true);
    try {
      const { apiPath } = getApiDetails();
      console.log(`Adding new ${activeTab.slice(0, -1)} to: http://127.0.0.1:8000/api/${apiPath}`);
      console.log('Payload:', { name: newItemName.trim() });
      const response = await axios.post(
        `http://127.0.0.1:8000/api/${apiPath}`,
        { name: newItemName.trim() }
      );
      console.log(`${activeTab.slice(0, -1)} added:`, response.data);
      setItems(prevItems => [...prevItems, response.data]);
      setNewItemName('');
      showNotification(`${activeTab.slice(0, -1)} added successfully!`, 'success');
    } catch (error) {
      console.error(`Error adding ${activeTab.toLowerCase()}:`, error);
      showNotification(`Error adding ${activeTab.toLowerCase()}: ${error.response?.data?.detail || error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClick = (item) => {
    setSelectedItem(item);
    setUpdateItemName(item.name);
    setShowUpdateModal(true);
  };

  const handleUpdate = async () => {
    if (!updateItemName.trim()) {
      showNotification('Name cannot be empty.', 'warning');
      return;
    }

    try {
      const { updatePath } = getApiDetails();
      console.log(`Updating ${activeTab.slice(0, -1)} at: http://127.0.0.1:8000/api/${updatePath}/${selectedItem.id}`);
      console.log('Payload:', { name: updateItemName.trim() });
      const response = await axios.put(
        `http://127.0.0.1:8000/api/${updatePath}/${selectedItem.id}`,
        { name: updateItemName.trim() }
      );
      console.log(`${activeTab.slice(0, -1)} updated:`, response.data);
      setItems(prevItems => prevItems.map(item => (item.id === selectedItem.id ? response.data : item)));
      showNotification('Item updated successfully!', 'success');
      setShowUpdateModal(false);
    } catch (error) {
      console.error(`Error updating ${activeTab.toLowerCase()}:`, error);
      showNotification(`Error updating item: ${error.response?.data?.detail || error.message}`, 'error');
    }
  };

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      const { deletePath } = getApiDetails();
      console.log(`Deleting ${activeTab.slice(0, -1)} at: http://127.0.0.1:8000/api/${deletePath}/${selectedItem.id}`);
      await axios.delete(`http://127.0.0.1:8000/api/${deletePath}/${selectedItem.id}`);
      console.log(`${activeTab.slice(0, -1)} deleted successfully`);
      setItems(prevItems => prevItems.filter(item => item.id !== selectedItem.id));
      showNotification('Item deleted successfully!', 'success');
      setShowDeleteModal(false);
    } catch (error) {
      console.error(`Error deleting ${activeTab.toLowerCase()}:`, error);
      showNotification(`Error deleting item: ${error.response?.data?.detail || error.message}`, 'error');
    }
  };

  return (
    <div>
      <ComplexNavbar />
      <div className="page-container">
        <DefaultSidebar />
        <div className="option-main-content">
          <div className="option-center-wrapper">
            <div className="option-container">
              <div className="option-header">
                <h1>Manage {activeTab}</h1>
                <div className="search-add-container">
                  <input
                    type="text"
                    placeholder={`Add a new ${activeTab.slice(0, -1).toLowerCase()}`}
                    className="option-input"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                  />
                  <button
                    className="option-add-button"
                    onClick={handleAdd}
                    disabled={loading}
                  >
                    {loading ? 'Switching...' : 'Add'}
                  </button>
                </div>
              </div>
              
              <div className="option-tabs-container">
                <div className="option-tabs">
                  {managementItems.map((item) => (
                    <div
                      key={item.title}
                      className={`option-tab ${activeTab === item.title ? 'active' : ''}`}
                      onClick={() => setActiveTab(item.title)}
                    >
                      <div className="option-tab-content">
                        <div className="option-tab-icon">
                          <item.icon />
                        </div>
                        <h2>{item.title}</h2>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Items List */}
              {Array.isArray(items) && items.length > 0 ? (
                <div className="items-list">
                  {items.map((item) => (
                    <div key={item.id} className="item-row">
                      <span>{item.name}</span>
                      <div>
                        <button onClick={() => handleUpdateClick(item)}>Edit</button>
                        <button onClick={() => handleDeleteClick(item)}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No items found. Add a new {activeTab.slice(0, -1).toLowerCase()} to get started.</p>
              )}

              {/* Update Modal */}
              {showUpdateModal && (
                <div className="modal-overlay">
                  <div className="modal-content">
                    <h2>Update Item</h2>
                    <input
                      type="text"
                      value={updateItemName}
                      onChange={(e) => setUpdateItemName(e.target.value)}
                      className="modal-input"
                    />
                    <div className="modal-buttons">
                      <button onClick={handleUpdate}>Update</button>
                      <button onClick={() => setShowUpdateModal(false)}>Cancel</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Delete Confirmation Modal */}
              {showDeleteModal && (
                <div className="modal-overlay">
                  <div className="modal-content">
                    <h2>Confirm Delete</h2>
                    <p>Are you sure you want to delete this item?</p>
                    <div className="modal-buttons">
                      <button onClick={handleDelete}>Yes, Delete</button>
                      <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Notification */}
              {notification.message && (
                <div className={`notification ${notification.type}`}>
                  {notification.message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Options;

