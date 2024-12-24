import React, { useState } from 'react';
import axios from 'axios';

const CreateUser = () => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [notification, setNotification] = useState({ message: '', type: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/users/create/', userData);
      setNotification({ message: 'User created successfully!', type: 'success' });
      setUserData({ username: '', email: '', password: '' });
    } catch (error) {
      setNotification({ message: 'Error creating user.', type: 'error' });
      console.error('Error creating user:', error);
    }
  };

  return (
    <div className="create-user-container">
      <h2>Create User</h2>
      <form onSubmit={handleSubmit} className="create-user-form">
        <input
          type="text"
          name="username"
          value={userData.username}
          onChange={handleChange}
          placeholder="Username"
          required
        />
        <input
          type="email"
          name="email"
          value={userData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={userData.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <button type="submit">Create User</button>
      </form>
      {notification.message && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default CreateUser;

