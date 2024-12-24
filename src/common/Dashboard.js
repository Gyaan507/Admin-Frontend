import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ComplexNavbar from '../common/ComplexNavbar';
import CenterCard from '../common/CenterCard';
import CreateUser from './CreateUser';
import Dashboard from './Dashboard';
import '../App.css';

const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [activeTab, setActiveTab] = useState("department");

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

  const handleAddDepartment = (e) => {
    e.preventDefault();
    if (newDepartmentName.trim()) {
      setLoading(true);
      const newDepartment = { name: newDepartmentName.trim() };

      axios
        .post("http://127.0.0.1:8000/api/departments/departments/", newDepartment)
        .then((response) => {
          showNotification("Department added successfully!", "success");
          setDepartments([...departments, response.data]);
          setNewDepartmentName("");
        })
        .catch((error) => {
          showNotification("Error adding department.", "error");
          console.error("Error adding department:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
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

  const renderContent = () => {
    switch (activeTab) {
      case "department":
        return (
          <>
            <form onSubmit={handleAddDepartment} className="add-department-form">
              <input
                type="text"
                className="department-input"
                placeholder="Enter department name"
                value={newDepartmentName}
                onChange={(e) => setNewDepartmentName(e.target.value)}
              />
              <button type="submit" className="add-department-button">
                Add Department
              </button>
            </form>

            <div className="grid-layout">
              {departments.map(department => (
                <CenterCard
                  key={department.id}
                  item={department}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </>
        );
      case "createUser":
        return <CreateUser />;
      case "dashboard":
        return <Dashboard />;
      default:
        return null;
    }
  };

  return (
    <div>
      <ComplexNavbar />
      <div className="page-container">
        <div className="main-content">
          {notification.message && (
            <div className={`notification ${notification.type}`}>
              {notification.message}
            </div>
          )}
          
          <div className="header-section">
            <h1 className="section-title">Management System</h1>
          </div>

          <div className="tabs">
            <button
              className={`tab-button ${activeTab === "department" ? "active" : ""}`}
              onClick={() => setActiveTab("department")}
            >
              Departments
            </button>
            <button
              className={`tab-button ${activeTab === "createUser" ? "active" : ""}`}
              onClick={() => setActiveTab("createUser")}
            >
              Create User
            </button>
            <button
              className={`tab-button ${activeTab === "dashboard" ? "active" : ""}`}
              onClick={() => setActiveTab("dashboard")}
            >
              Dashboard
            </button>
          </div>

          <div className="tab-content">
            {renderContent()}
          </div>
        </div>
      </div>

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

