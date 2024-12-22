import React, { useState, useEffect } from "react";
import { useLocation} from "react-router-dom";
import axios from "axios";
import DefaultSidebar from '../common/DefaultSidebar';
import ComplexNavbar from '../common/ComplexNavbar';
import CenterCard from '../common/CenterCard';
import '../App.css';

const Industry = () => {
  const [industries, setIndustries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newIndustryName, setNewIndustryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [industryToDelete, setIndustryToDelete] = useState(null);
  const [activeMenuItem, setActiveMenuItem] = useState("");

  const location = useLocation();

  useEffect(() => {
    if (location.state?.activeMenuItem) {
      setActiveMenuItem(location.state.activeMenuItem);
    }
  }, [location]);
  
  useEffect(() => {
    fetchIndustries();
  }, []);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 3000);
  };

  const fetchIndustries = () => {
    setLoading(true);
    axios
      .get("http://127.0.0.1:8000/api/industries/")
      .then((response) => {
        setIndustries(response.data);
      })
      .catch((error) => {
        console.error("Error fetching industries:", error);
        showNotification("Error fetching industries.", "error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleAdd = () => {
    if (!newIndustryName.trim()) {
      showNotification("Industry name cannot be empty.", "warning");
      return;
    }

    setLoading(true);
    const newIndustry = { name: newIndustryName.trim() };

    axios
      .post("http://127.0.0.1:8000/api/industries/", newIndustry)
      .then((response) => {
        showNotification("Industry added successfully!", "success");
        setIndustries([...industries, response.data]);
        setNewIndustryName("");
        setShowModal(false);
      })
      .catch((error) => {
        showNotification("Error adding industry.", "error");
        console.error("Error adding industry:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleUpdate = (id) => {
    const industryToUpdate = industries.find(ind => ind.id === id);
    const newName = prompt('Enter new industry name:', industryToUpdate.name);
    
    if (!newName || !newName.trim()) return;

    const updatedIndustry = { name: newName.trim() };
    
    axios
      .put(`http://127.0.0.1:8000/api/industries/${id}`, updatedIndustry)
      .then((response) => {
        showNotification("Industry updated successfully!", "success");
        setIndustries(industries.map(ind =>
          ind.id === id ? response.data : ind
        ));
      })
      .catch((error) => {
        showNotification("Error updating industry.", "error");
        console.error("Error updating industry:", error);
      });
  };

  const confirmDelete = (id) => {
    setIndustryToDelete(id);
    setShowConfirmDialog(true);
  };

  const handleDelete = (id) => {
    setIndustryToDelete(id);
    confirmDelete(id);
  };

  const executeDelete = () => {
    if (!industryToDelete) return;

    axios
      .delete(`http://127.0.0.1:8000/api/industries/${industryToDelete}`)
      .then(() => {
        showNotification("Industry deleted successfully!", "success");
        setIndustries(industries.filter(ind => ind.id !== industryToDelete));
      })
      .catch((error) => {
        console.error("Error deleting industry:", error);
        showNotification("Failed to delete industry.", "error");
      })
      .finally(() => {
        setShowConfirmDialog(false);
        setIndustryToDelete(null);
      });
  };

  // const fetchIndustryById = async (id) => {
  //   try {
  //     const response = await axios.get(`http://127.0.0.1:8000/api/industries/${id}`);
  //     setIndustries(response.data);
  //   } catch (error) {
  //     console.error("Error fetching industry by ID:", error);
  //     showNotification("Failed to fetch industry details.", "error");
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
              {loading ? "Loading..." : "Add Industry"}
            </button>
            <h1 className="section-title">Industry Management</h1>
          </div>
          
          <div className="grid-layout">
            {industries.map(industry => (
              <CenterCard
                key={industry.id}
                item={industry}
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
            <h2 className="modal-title">Add New Industry</h2>
            <input
              type="text"
              className="modal-input"
              value={newIndustryName}
              onChange={(e) => setNewIndustryName(e.target.value)}
              placeholder="Enter industry name"
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
            <p>Are you sure you want to delete this industry?</p>
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
                  setIndustryToDelete(null);
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

export default Industry;

