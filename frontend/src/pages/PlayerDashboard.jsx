import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PlayerDashboard = () => {
  const [player, setPlayer] = useState(null);
  const [formData, setFormData] = useState({
    economyOrAverage: '',
    matchesPlayed: '',
    bestScore: '',
    basePrice: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/players/${localStorage.getItem('userId')}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setPlayer(res.data);
        setFormData({
          economyOrAverage: res.data.economyOrAverage,
          matchesPlayed: res.data.matchesPlayed,
          bestScore: res.data.bestScore,
          basePrice: res.data.basePrice
        });
      } catch (err) {
        console.error(err);
        navigate('/login');
      }
    };

    fetchPlayer();
  }, [navigate]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/players/${player._id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Player details updated successfully');
    } catch (err) {
      console.error(err);
      alert('Error updating player details');
    }
  };

  if (!player) return <div>Loading...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Player Dashboard - {player.name}</h2>
      
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <div style={{ flex: 1 }}>
          <img src={player.image} alt={player.name} style={{ width: '100%', maxWidth: '300px', height: 'auto' }} />
          <h3>{player.name}</h3>
          <p>Age: {player.age}</p>
          <p>Country: {player.country}</p>
          <p>Role: {player.role}</p>
          {player.isPurchased && (
            <>
              <p>Team: {player.team}</p>
              <p>Sold Price: {player.soldPrice} cr</p>
            </>
          )}
        </div>
        
        <div style={{ flex: 1 }}>
          <h3>Update Stats</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '10px' }}>
              <label>Economy/Average:</label>
              <input type="number" name="economyOrAverage" value={formData.economyOrAverage} onChange={handleInputChange} style={{ width: '100%', padding: '8px' }} required />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Matches Played:</label>
              <input type="number" name="matchesPlayed" value={formData.matchesPlayed} onChange={handleInputChange} style={{ width: '100%', padding: '8px' }} required />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Best Score:</label>
              <input type="text" name="bestScore" value={formData.bestScore} onChange={handleInputChange} style={{ width: '100%', padding: '8px' }} required />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Base Price (cr):</label>
              <input type="number" name="basePrice" value={formData.basePrice} onChange={handleInputChange} style={{ width: '100%', padding: '8px' }} required />
            </div>
            <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Update</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PlayerDashboard;