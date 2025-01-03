import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const ComplexNavbar = () => {
  const navigate = useNavigate();
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [userData, setUserData] = useState(null);
  
  useEffect(() => {
    const storedUserData = localStorage.getItem('user');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  
  const handleCheckboxChange = () => {
    setCheckboxChecked(!checkboxChecked);
  };
  
  const getFullName = () => {
    if (!userData) return 'Guest';
    return `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || 'User';
  };

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Update state
    setUserData(null);
    // Redirect to login page
    navigate('/login');
  };

  return (
    <div className="navbar-container">
      <div className="navbar-logo">
        <a href="https://jobrick.com/" target="_blank" rel="noopener noreferrer">
          <img
            src="https://i.ibb.co/SxNcYtP/JOBRICK.png"
            alt="JobBrick Logo"
            className="logo"
            style={{
              width: '188px', 
              height: '80px', 
              objectFit: 'cover'  }}
          />
        </a>
      </div>

      <div className="navbar">
        <a href="#jobs" className="navbar-link">
          Jobs
        </a>
        <a href="#companies" className="navbar-link">
          Companies
        </a>
        <a href="#pre-resume" className="navbar-link">
          Pre-Resume
        </a>
        <div className="navbar-icon">🔔</div>

        <div className="navbar-user">
          <div className="navbar-user-avatar">👤</div>
          <div className="navbar-user-details">
          <span className="navbar-user-name" onClick={toggleDropdown}>
          {getFullName()}
        </span>
            <button className="dropdown-btn" onClick={toggleDropdown}>
              ▼
            </button>
          </div>
          {dropdownOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-item">Reset Password</div>
              <div className="dropdown-item" onClick={handleLogout}>Logout</div>
              <div className="dropdown-item">
                <label>
                  <input
                    type="checkbox"
                    checked={checkboxChecked}
                    onChange={handleCheckboxChange}
                  />
                  Hide Account
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplexNavbar;

