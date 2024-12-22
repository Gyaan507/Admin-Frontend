import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import DefaultSidebar from '../common/DefaultSidebar';
import ComplexNavbar from '../common/ComplexNavbar';
import CenterCard from '../common/CenterCard';
import '../App.css';

const Role = () => {
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [activeMenuItem, setActiveMenuItem] = useState("");

  const location = useLocation();

  useEffect(() => {
    if (location.state?.activeMenuItem) {
      setActiveMenuItem(location.state.activeMenuItem);
    }
  }, [location]);
  
  useEffect(() => {
    fetchRoles();
  }, []);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 3000);
  };

  const fetchRoles = () => {
    setLoading(true);
    axios
      .get("http://127.0.0.1:8000/api/role")
      .then((response) => {
        setRoles(Array.isArray(response.data) ? response.data : []);
      })
      .catch((error) => {
        console.error("Error fetching roles:", error);
        showNotification("Error fetching roles.", "error");
        setRoles([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleAdd = () => {
    if (!newRoleName.trim()) {
      showNotification("Role name cannot be empty.", "warning");
      return;
    }

    setLoading(true);
    const newRole = { name: newRoleName.trim() };

    axios
      .post("http://127.0.0.1:8000/api/role/", newRole)
      .then((response) => {
        showNotification("Role added successfully!", "success");
        setRoles([...roles, response.data]);
        setNewRoleName("");
        setShowModal(false);
      })
      .catch((error) => {
        showNotification("Error adding role.", "error");
        console.error("Error adding role:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleUpdate = (id) => {
    const roleToUpdate = roles.find(role => role.id === id);
    const newName = prompt('Enter new role name:', roleToUpdate.name);
    
    if (!newName || !newName.trim()) return;

    const updatedRole = { name: newName.trim() };
    
    axios
      .put(`http://127.0.0.1:8000/api/role/${id}`, updatedRole)
      .then((response) => {
        showNotification("Role updated successfully!", "success");
        setRoles(roles.map(role =>
          role.id === id ? response.data : role
        ));
      })
      .catch((error) => {
        showNotification("Error updating role.", "error");
        console.error("Error updating role:", error);
      });
  };

  const confirmDelete = (id) => {
    setRoleToDelete(id);
    setShowConfirmDialog(true);
  };

  const handleDelete = (id) => {
    setRoleToDelete(id);
    confirmDelete(id);
  };

  const executeDelete = () => {
    if (!roleToDelete) return;

    axios
      .delete(`http://127.0.0.1:8000/api/role/${roleToDelete}`)
      .then(() => {
        showNotification("Role deleted successfully!", "success");
        setRoles(roles.filter(role => role.id !== roleToDelete));
      })
      .catch((error) => {
        console.error("Error deleting role:", error);
        showNotification("Failed to delete role.", "error");
      })
      .finally(() => {
        setShowConfirmDialog(false);
        setRoleToDelete(null);
      });
  };

  const fetchRoleById = async (id) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/role/${id}`);
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching role by ID:", error);
      showNotification("Failed to fetch role details.", "error");
    }
  };

  return (
    <div>
      <ComplexNavbar />
      <div className="page-container">
        <DefaultSidebar />
        <div className="main-content">
          {notification.message && (
            <div className={`notification ${notification.type}`}>
              {notification.message}
            </div>
          )}
          
          <div className="header-section">
            <button 
              className="add-button"
              onClick={() => setShowModal(true)}
              disabled={loading}
            >
              {loading ? "Loading..." : "Add Role"}
            </button>
            <h1 className="section-title">Role Management</h1>
          </div>

          <div className="grid-layout">
            {Array.isArray(roles) && roles.map(role => (
              <CenterCard
                key={role.id}
                item={role}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Add New Role</h2>
            <input
              type="text"
              className="modal-input"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              placeholder="Enter role name"
              disabled={loading}
            />
            <div className="modal-buttons">
              <button 
                className="modal-add-button" 
                onClick={handleAdd}
                disabled={loading}
              >
                {loading ? "Adding..." : "Add"}
              </button>
              <button 
                className="modal-cancel-button"
                onClick={() => setShowModal(false)}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmDialog && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Confirm Delete</h2>
            <p>Are you sure you want to delete this role?</p>
            <div className="modal-buttons">
              <button 
                className="modal-add-button"
                onClick={executeDelete}
              >
                Yes, Delete
              </button>
              <button 
                className="modal-cancel-button"
                onClick={() => {
                  setShowConfirmDialog(false);
                  setRoleToDelete(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Role;

