import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const DefaultSidebar = () => {
  const [activeMenuItem, setActiveMenuItem] = useState("");
  const navigate = useNavigate();

  const handleMenuClick = (menuItem, path) => {
    setActiveMenuItem(menuItem);
    navigate(path);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <ul className="sidebar-menu">
          <li className="menu-item">
            <button
              className={`menu-link ${activeMenuItem === "dashboard" ? "active" : ""}`}
              onClick={() => handleMenuClick("dashboard", "/dashboard")}
            >
              <span className="menu-icon">🏢</span>
              <span className="menu-text">Dashboard</span>
            </button>
          </li>
          <li className="menu-item">
            <button
              className={`menu-link ${activeMenuItem === "options" ? "active" : ""}`}
              onClick={() => handleMenuClick("options", "/options")}
            >
              <span className="menu-icon">👤</span>
              <span className="menu-text">Add Options</span>
            </button>
          </li>
          <li className="menu-item">
            <button
              className={`menu-link ${activeMenuItem === "admin_api" ? "active" : ""}`}
              onClick={() => handleMenuClick("admin_api", "/admin_api")}
            >
              <span className="menu-icon">⚙️</span>
              <span className="menu-text">Admin API</span>
            </button>
          </li>
          {/* <li className="menu-item">
            <button
              className={`menu-link ${activeMenuItem === "jobtype" ? "active" : ""}`}
              onClick={() => handleMenuClick("jobtype", "/jobtype")}
            >
              <span className="menu-icon">📄</span>
              <span className="menu-text">Job Type</span>
            </button>
          </li> */}
          {/* <li className="menu-item">
            <button
              className={`menu-link ${activeMenuItem === "role" ? "active" : ""}`}
              onClick={() => handleMenuClick("role", "/role")}
            >
              <span className="menu-icon">💼</span>
              <span className="menu-text">Role</span>
            </button>
          </li> */}
          {/* <li className="menu-item">
            <button
              className={`menu-link ${activeMenuItem === "specialization" ? "active" : ""}`}
              onClick={() => handleMenuClick("specialization", "/specialization")}
            >
              <span className="menu-icon">✅</span>
              <span className="menu-text">Specialization</span>
            </button>
          </li> */}
        </ul>
      </div>
    </div>
  );
};

export default DefaultSidebar;

