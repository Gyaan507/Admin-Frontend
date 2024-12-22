import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import DefaultSidebar from '../common/DefaultSidebar';
import ComplexNavbar from '../common/ComplexNavbar';
import CenterCard from '../common/CenterCard';
import '../App.css';

const Specialization = () => {
  const [specializations, setSpecializations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newSpecializationName, setNewSpecializationName] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [specializationToDelete, setSpecializationToDelete] = useState(null);
  const [activeMenuItem, setActiveMenuItem] = useState("");

  const location = useLocation();

  useEffect(() => {
    if (location.state?.activeMenuItem) {
      setActiveMenuItem(location.state.activeMenuItem);
    }
  }, [location]);
  
  useEffect(() => {
    fetchSpecializations();
  }, []);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 3000);
  };

  const fetchSpecializations = () => {
    setLoading(true);
    axios
      .get("http://127.0.0.1:8000/api/specializations/")
      .then((response) => {
        setSpecializations(Array.isArray(response.data) ? response.data : []);
      })
      .catch((error) => {
        console.error("Error fetching specializations:", error);
        showNotification("Error fetching specializations.", "error");
        setSpecializations([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleAdd = () => {
    if (!newSpecializationName.trim()) {
      showNotification("Specialization name cannot be empty.", "warning");
      return;
    }

    setLoading(true);
    const newSpecialization = { name: newSpecializationName.trim() };

    axios
      .post("http://127.0.0.1:8000/api/specializations/", newSpecialization)
      .then((response) => {
        showNotification("Specialization added successfully!", "success");
        setSpecializations([...specializations, response.data]);
        setNewSpecializationName("");
        setShowModal(false);
      })
      .catch((error) => {
        showNotification("Error adding specialization.", "error");
        console.error("Error adding specialization:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleUpdate = (id) => {
    const specializationToUpdate = specializations.find(spec => spec.id === id);
    const newName = prompt('Enter new specialization name:', specializationToUpdate.name);
    
    if (!newName || !newName.trim()) return;

    const updatedSpecialization = { name: newName.trim() };
    
    axios
      .put(`http://127.0.0.1:8000/api/specializations/${id}`, updatedSpecialization)
      .then((response) => {
        showNotification("Specialization updated successfully!", "success");
        setSpecializations(specializations.map(spec =>
          spec.id === id ? response.data : spec
        ));
      })
      .catch((error) => {
        showNotification("Error updating specialization.", "error");
        console.error("Error updating specialization:", error);
      });
  };

  const confirmDelete = (id) => {
    setSpecializationToDelete(id);
    setShowConfirmDialog(true);
  };

  const handleDelete = (id) => {
    setSpecializationToDelete(id);
    confirmDelete(id);
  };

  const executeDelete = () => {
    if (!specializationToDelete) return;

    axios
      .delete(`http://127.0.0.1:8000/api/specializations/${specializationToDelete}`)
      .then(() => {
        showNotification("Specialization deleted successfully!", "success");
        setSpecializations(specializations.filter(spec => spec.id !== specializationToDelete));
      })
      .catch((error) => {
        console.error("Error deleting specialization:", error);
        showNotification("Failed to delete specialization.", "error");
      })
      .finally(() => {
        setShowConfirmDialog(false);
        setSpecializationToDelete(null);
      });
  };

  // const fetchSpecializationById = async (id) => {
  //   try {
  //     const response = await axios.get(`http://127.0.0.1:8000/api/specializations/${id}`);
  //     console.log(response.data);
  //     // You might want to do something with this data, like showing it in a modal
  //   } catch (error) {
  //     console.error("Error fetching specialization by ID:", error);
  //     showNotification("Failed to fetch specialization details.", "error");
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
            <button 
              className="add-button"
              onClick={() => setShowModal(true)}
              disabled={loading}
            >
              {loading ? "Loading..." : "Add Specialization"}
            </button>
            <h1 className="section-title">Specialization Management</h1>
          </div>

          <div className="grid-layout">
            {Array.isArray(specializations) && specializations.map(specialization => (
              <CenterCard
                key={specialization.id}
                item={specialization}
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
            <h2 className="modal-title">Add New Specialization</h2>
            <input
              type="text"
              className="modal-input"
              value={newSpecializationName}
              onChange={(e) => setNewSpecializationName(e.target.value)}
              placeholder="Enter specialization name"
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
            <p>Are you sure you want to delete this specialization?</p>
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
                  setSpecializationToDelete(null);
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

export default Specialization;

