import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const DefaultSidebar = () => {
  const [activeMenuItem, setActiveMenuItem] = useState("department");
  const [newItemName, setNewItemName] = useState("");
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const menuItems = [
    { id: "department", label: "Departments", path: "/department" },
    { id: "industry", label: "Industries", path: "/industry" },
    { id: "jobtype", label: "Job Type", path: "/jobtype" },
    { id: "role", label: "Role", path: "/role" },
    { id: "specialization", label: "Specialization", path: "/specialization" }
  ];

  const handleMenuClick = (menuItem, path) => {
    setActiveMenuItem(menuItem);
    navigate(path);
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    // Add your item creation logic here
    console.log("Adding new item:", newItemName);
    setNewItemName("");
  };

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <h1 className="sidebar-title">Manage Items</h1>
        
        <form onSubmit={handleAddItem} className="sidebar-form">
          <input
            type="text"
            className="sidebar-input"
            placeholder="Enter department name"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
          />
          <button type="submit" className="sidebar-add-button">
            Add
          </button>
        </form>

        <div className="sidebar-tabs-container">
          <div 
            className="sidebar-tabs" 
            ref={menuRef}
          >
            {menuItems.map((item) => (
              <button
                key={item.id}
                className={`tab-button ${activeMenuItem === item.id ? "active" : ""}`}
                onClick={() => handleMenuClick(item.id, item.path)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="scroll-fade-left" />
          <div className="scroll-fade-right" />
        </div>

        <div className="sidebar-section">
          <h2 className="section-title">
            {activeMenuItem.charAt(0).toUpperCase() + activeMenuItem.slice(1)}
          </h2>
          {/* Add your section content here */}
        </div>
      </div>
    </div>
  );
};

export default DefaultSidebar;

