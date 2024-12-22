import React from 'react';
import '../App.css';

const CenterCard = ({ item, onUpdate, onDelete ,onGet}) => {
  return (
    <div className="center-card">
      <h3 className="card-title">{item.name}</h3>
      <div className="card-buttons">
        <button 
          className="update-button"
          onClick={() => onUpdate(item.id)}
        >
          Update
        </button>
        <button 
          className="delete-button"
          onClick={() => onDelete(item.id)}
        >
          Delete
        </button>
        {/* <button
          onClick={() => onGet(item.id)}
        >
          View Details
          </button> */}
      </div>
    </div>
  );
};

export default CenterCard;

