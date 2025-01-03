import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUsers, 
  FaFileAlt, 
  FaBuilding, 
  FaUserTie 
} from 'react-icons/fa';
import ComplexNavbar from '../common/ComplexNavbar';
import DefaultSidebar from '../common/DefaultSidebar';
import '../App.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [filterDate, setFilterDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = () => {
      const token = localStorage.getItem('token');
      console.log("Dashboard - token check:", token ? "exists" : "not found"); // Debug log
      if (!token) {
        console.log("Dashboard - redirecting to login"); // Debug log
        navigate('/login');
      } else {
        // Here you would typically verify the token with your backend
        // For demonstration, we'll just simulate this with a timeout
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    };

    checkAuthentication();
  }, [navigate]);

  const statsItems = [
    {
      title: 'Employee',
      icon: FaUsers,
      value: 0,
      color: 'blue',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Job Posts',
      icon: FaFileAlt,
      value: 0,
      color: 'red',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Total Company Registered',
      icon: FaBuilding,
      value: 0,
      color: 'green',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Candidates',
      icon: FaUserTie,
      value: 0,
      color: 'orange',
      bgColor: 'bg-orange-50'
    }
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <ComplexNavbar />
      <div className="page-container">
        <DefaultSidebar />
        <div className="dashboard-main-content">
          <div className="dashboard-center-wrapper">
            <div className="dashboard-container">
              <div className="dashboard-header">
                <h1>Dashboard</h1>
                <div className="date-filter">
                  <input 
                    type="date" 
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="date-input"
                  />
                </div>
              </div>
              
              <div className="stats-grid">
                {statsItems.map((item, index) => (
                  <div key={index} className="stat-card">
                    <div className="stat-content">
                      <div className={`stat-icon-wrapper ${item.bgColor}`}>
                        <item.icon className={`stat-icon text-${item.color}-500`} />
                      </div>
                      <div className="stat-info">
                        <h2 className="stat-title">{item.title}</h2>
                        <p className="stat-value">{item.value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

