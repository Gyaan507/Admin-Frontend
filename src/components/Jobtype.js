import React, { useState, useEffect } from "react";
import { useLocation} from "react-router-dom";
import axios from "axios";
import DefaultSidebar from '../common/DefaultSidebar';
import ComplexNavbar from '../common/ComplexNavbar';
import CenterCard from '../common/CenterCard';
import '../App.css';

const JobType = () => {
  const [jobTypes, setJobTypes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newJobTypeName, setNewJobTypeName] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [jobTypeToDelete, setJobTypeToDelete] = useState(null);
  const [activeMenuItem, setActiveMenuItem] = useState("");

  const location = useLocation();

  useEffect(() => {
    if (location.state?.activeMenuItem) {
      setActiveMenuItem(location.state.activeMenuItem);
    }
  }, [location]);
  
  useEffect(() => {
    fetchJobTypes();
  }, []);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 3000);
  };

  const fetchJobTypes = () => {
    setLoading(true);
    axios
      .get("http://127.0.0.1:8000/api/job_types/")
      .then((response) => {
        setJobTypes(Array.isArray(response.data) ? response.data : []);
      })
      .catch((error) => {
        console.error("Error fetching job types:", error);
        showNotification("Error fetching job types.", "error");
        setJobTypes([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleAdd = () => {
    if (!newJobTypeName.trim()) {
      showNotification("Job type name cannot be empty.", "warning");
      return;
    }

    setLoading(true);
    const newJobType = { name: newJobTypeName.trim() };

    axios
      .post("http://127.0.0.1:8000/api/job_types/", newJobType)
      .then((response) => {
        showNotification("Job type added successfully!", "success");
        setJobTypes([...jobTypes, response.data]);
        setNewJobTypeName("");
        setShowModal(false);
      })
      .catch((error) => {
        showNotification("Error adding job type.", "error");
        console.error("Error adding job type:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleUpdate = (id) => {
    const jobTypeToUpdate = jobTypes.find(jobType => jobType.id === id);
    const newName = prompt('Enter new job type name:', jobTypeToUpdate.name);
    
    if (!newName || !newName.trim()) return;

    const updatedJobType = { name: newName.trim() };
    
    axios
      .put(`http://127.0.0.1:8000/api/job_types/${id}`, updatedJobType)
      .then((response) => {
        showNotification("Job type updated successfully!", "success");
        setJobTypes(jobTypes.map(jobType =>
          jobType.id === id ? response.data : jobType
        ));
      })
      .catch((error) => {
        showNotification("Error updating job type.", "error");
        console.error("Error updating job type:", error);
      });
  };

  const confirmDelete = (id) => {
    setJobTypeToDelete(id);
    setShowConfirmDialog(true);
  };

  const handleDelete = (id) => {
    setJobTypeToDelete(id);
    confirmDelete(id);
  };

  const executeDelete = () => {
    if (!jobTypeToDelete) return;

    axios
      .delete(`http://127.0.0.1:8000/api/job_types/${jobTypeToDelete}`)
      .then(() => {
        showNotification("Job type deleted successfully!", "success");
        setJobTypes(jobTypes.filter(jobType => jobType.id !== jobTypeToDelete));
      })
      .catch((error) => {
        console.error("Error deleting job type:", error);
        showNotification("Failed to delete job type.", "error");
      })
      .finally(() => {
        setShowConfirmDialog(false);
        setJobTypeToDelete(null);
      });
  };

  const fetchJobTypeById = async (id) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/job_types/${id}`);
      // Here you might want to do something with the fetched job type,
      // such as showing it in a modal or updating the state
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching job type by ID:", error);
      showNotification("Failed to fetch job type details.", "error");
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
              {loading ? "Loading..." : "Add Job Type"}
            </button>
            <h1 className="section-title">Job Type Management</h1>
          </div>

          <div className="grid-layout">
            {Array.isArray(jobTypes) && jobTypes.map(jobType => (
              <CenterCard
                key={jobType.id}
                item={jobType}
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
            <h2 className="modal-title">Add New Job Type</h2>
            <input
              type="text"
              className="modal-input"
              value={newJobTypeName}
              onChange={(e) => setNewJobTypeName(e.target.value)}
              placeholder="Enter job type name"
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
            <p>Are you sure you want to delete this job type?</p>
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
                  setJobTypeToDelete(null);
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

export default JobType;

