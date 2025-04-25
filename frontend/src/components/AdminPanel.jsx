import React, { useState } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    country: '',
    role: 'batsman',
    economyOrAverage: '',
    matchesPlayed: '',
    bestScore: '',
    basePrice: '',
    image: '',
    password: ''
  });

  const [buyerData, setBuyerData] = useState({
    firstName: '',
    lastName: '',
    password: ''
  });

  const handlePlayerInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBuyerInputChange = (e) => {
    setBuyerData({ ...buyerData, [e.target.name]: e.target.value });
  };

  const handlePlayerSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/players`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Player added successfully');
      setFormData({
        name: '',
        age: '',
        country: '',
        role: 'batsman',
        economyOrAverage: '',
        matchesPlayed: '',
        bestScore: '',
        basePrice: '',
        image: '',
        password: ''
      });
    } catch (err) {
      console.error(err);
      alert('Error adding player');
    }
  };

  const handleBuyerSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/buyers`, buyerData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Buyer added successfully');
      setBuyerData({
        firstName: '',
        lastName: '',
        password: ''
      });
    } catch (err) {
      console.error(err);
      alert('Error adding buyer');
    }
  };

  const handleReset = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/reset`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Auction reset successfully');
    } catch (err) {
      console.error(err);
      alert('Error resetting auction');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Admin Panel</h2>
      
      <div style={{ marginBottom: '30px', border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
        <h3>Add New Player</h3>
        <form onSubmit={handlePlayerSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handlePlayerInputChange} style={{ width: '100%', padding: '8px' }} required />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handlePlayerInputChange} style={{ width: '100%', padding: '8px' }} required />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <input type="text" name="country" placeholder="Country" value={formData.country} onChange={handlePlayerInputChange} style={{ width: '100%', padding: '8px' }} required />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <select name="role" value={formData.role} onChange={handlePlayerInputChange} style={{ width: '100%', padding: '8px' }}>
              <option value="batsman">Batsman</option>
              <option value="bowler">Bowler</option>
              <option value="all-rounder">All-Rounder</option>
            </select>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <input type="number" name="economyOrAverage" placeholder="Economy/Average" value={formData.economyOrAverage} onChange={handlePlayerInputChange} style={{ width: '100%', padding: '8px' }} required />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <input type="number" name="matchesPlayed" placeholder="Matches Played" value={formData.matchesPlayed} onChange={handlePlayerInputChange} style={{ width: '100%', padding: '8px' }} required />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <input type="text" name="bestScore" placeholder="Best Score" value={formData.bestScore} onChange={handlePlayerInputChange} style={{ width: '100%', padding: '8px' }} required />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <input type="number" name="basePrice" placeholder="Base Price (cr)" value={formData.basePrice} onChange={handlePlayerInputChange} style={{ width: '100%', padding: '8px' }} required />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <input type="text" name="image" placeholder="Image URL" value={formData.image} onChange={handlePlayerInputChange} style={{ width: '100%', padding: '8px' }} required />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handlePlayerInputChange} style={{ width: '100%', padding: '8px' }} required />
          </div>
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Add Player</button>
        </form>
      </div>
      
      <div style={{ marginBottom: '30px', border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
        <h3>Add New Buyer</h3>
        <form onSubmit={handleBuyerSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <input type="text" name="firstName" placeholder="First Name" value={buyerData.firstName} onChange={handleBuyerInputChange} style={{ width: '100%', padding: '8px' }} required />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <input type="text" name="lastName" placeholder="Last Name" value={buyerData.lastName} onChange={handleBuyerInputChange} style={{ width: '100%', padding: '8px' }} />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <input type="password" name="password" placeholder="Password" value={buyerData.password} onChange={handleBuyerInputChange} style={{ width: '100%', padding: '8px' }} required />
          </div>
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Add Buyer</button>
        </form>
      </div>
      
      <div>
        <button onClick={handleReset} style={{ padding: '10px 20px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Reset Auction</button>
      </div>
    </div>
  );
};

export default AdminPanel;