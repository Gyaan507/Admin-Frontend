import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import DefaultSidebar from '../common/DefaultSidebar';
import ComplexNavbar from '../common/ComplexNavbar';
import CenterCard from '../common/CenterCard';
import '../App.css';

const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);
  const [activeMenuItem,setActiveMenuItem] = useState("");

  

  const location = useLocation();

  useEffect(() => {
    if (location.state?.activeMenuItem) {
      setActiveMenuItem(location.state.activeMenuItem);
    }
  }, [location]);
  
  useEffect(() => {
    fetchDepartments();
  }, []);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 3000);
  };

  const fetchDepartments = () => {
    setLoading(true);
    axios
      .get("http://127.0.0.1:8000/api/departments/departments/")
      .then((response) => {
        setDepartments(response.data);
      })
      .catch((error) => {
        console.error("Error fetching departments:", error);
        showNotification("Error fetching departments.", "error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleAdd = () => {
    if (!newDepartmentName.trim()) {
      showNotification("Department name cannot be empty.", "warning");
      return;
    }

    setLoading(true);
    const newDepartment = { name: newDepartmentName.trim() };

    axios
      .post("http://127.0.0.1:8000/api/departments/departments/", newDepartment)
      .then((response) => {
        showNotification("Department added successfully!", "success");
        setDepartments([...departments, response.data]);
        setNewDepartmentName("");
        setShowModal(false);
      })
      .catch((error) => {
        showNotification("Error adding department.", "error");
        console.error("Error adding department:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleUpdate = (id) => {
    const departmentToUpdate = departments.find(dept => dept.id === id);
    const newName = prompt('Enter new department name:', departmentToUpdate.name);
    
    if (!newName || !newName.trim()) return;

    const updatedDepartment = { name: newName.trim() };
    
    axios
      .put(`http://127.0.0.1:8000/api/departments/departments/${id}`, updatedDepartment)
      .then((response) => {
        showNotification("Department updated successfully!", "success");
        setDepartments(departments.map(dept =>
          dept.id === id ? response.data : dept
        ));
      })
      .catch((error) => {
        showNotification("Error updating department.", "error");
        console.error("Error updating department:", error);
      });
  };

  const confirmDelete = (id) => {
    setDepartmentToDelete(id);
    setShowConfirmDialog(true);
  };

  const handleDelete = (id) => {
    setDepartmentToDelete(id);
    confirmDelete(id);
  };

  const executeDelete = () => {
    if (!departmentToDelete) return;

    axios
      .delete(`http://127.0.0.1:8000/api/departments/departments/${departmentToDelete}`)
      .then(() => {
        showNotification("Department deleted successfully!", "success");
        setDepartments(departments.filter(dept => dept.id !== departmentToDelete));
      })
      .catch((error) => {
        console.error("Error deleting department:", error);
        showNotification("Failed to delete department.", "error");
      })
      .finally(() => {
        setShowConfirmDialog(false);
        setDepartmentToDelete(null);
      });
  };

  // const fetchDepartmentById = async (id) => {
  //   try {
  //     const response = await axios.get(`http://127.0.0.1:8000/api/departments/departments/${id}`);
  //     setDepartments(response.data);
  //   } catch (error) {
  //     console.error("Error fetching department by ID:", error);
  //     showNotification("Failed to fetch department details.", "error");
  //   }
  // };
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
            {/* <button 
              className="add-button"
              onClick={() => setShowModal(true)}
              disabled={loading}
            >
              {loading ? "Loading..." : "Add Department"}
            </button> */}
            <h1 className="section-title">Department Management</h1>
          </div>

          <div className="grid-layout">
            {departments.map(department => (
              <CenterCard
                key={department.id}
                item={department}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                // onGet={fetchDepartmentById}
              />
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Add New Department</h2>
            <input
              type="text"
              className="modal-input"
              value={newDepartmentName}
              onChange={(e) => setNewDepartmentName(e.target.value)}
              placeholder="Enter department name"
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
            <p>Are you sure you want to delete this department?</p>
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
                  setDepartmentToDelete(null);
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

export default Department;
