import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PlayerCard from '../components/PlayerCard';
import AdminPlayerForm from '../components/AdminPlayerForm';
import AdminBuyerForm from '../components/AdminBuyerForm';

const AdminDashboard = () => {
  const [players, setPlayers] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [showPlayerForm, setShowPlayerForm] = useState(false);
  const [showBuyerForm, setShowBuyerForm] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [editingBuyer, setEditingBuyer] = useState(null);

  useEffect(() => {
    fetchPlayers();
    fetchBuyers();
  }, []);

  const fetchPlayers = async () => {
    const res = await axios.get('/api/admin/players');
    setPlayers(res.data);
  };

  const fetchBuyers = async () => {
    const res = await axios.get('/api/admin/buyers');
    setBuyers(res.data);
  };

  const handleCreatePlayer = async (playerData) => {
    await axios.post('/api/admin/players', playerData);
    setShowPlayerForm(false);
    fetchPlayers();
  };

  const handleCreateBuyer = async (buyerData) => {
    await axios.post('/api/admin/buyers', buyerData);
    setShowBuyerForm(false);
    fetchBuyers();
  };

  const handleResetAuction = async () => {
    await axios.post('/api/admin/reset');
    fetchPlayers();
    fetchBuyers();
    alert('Auction reset successfully!');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Admin Dashboard</h2>
      
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3>Players</h3>
          <div>
            <button 
              onClick={() => { setEditingPlayer(null); setShowPlayerForm(true); }}
              style={{ padding: '8px 16px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}
            >
              Add Player
            </button>
            <button 
              onClick={handleResetAuction}
              style={{ padding: '8px 16px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Reset Auction
            </button>
          </div>
        </div>
        
        {showPlayerForm && (
          <AdminPlayerForm 
            onSubmit={handleCreatePlayer} 
            initialData={editingPlayer || {}} 
          />
        )}
        
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {players.map(player => (
            <div key={player._id} style={{ margin: '10px', position: 'relative' }}>
              <PlayerCard player={player} />
              <button 
                onClick={() => { setEditingPlayer(player); setShowPlayerForm(true); }}
                style={{ 
                  position: 'absolute', 
                  top: '10px', 
                  right: '10px', 
                  padding: '5px 10px', 
                  backgroundColor: '#FFC107', 
                  color: 'black', 
                  border: 'none', 
                  borderRadius: '4px', 
                  cursor: 'pointer'
                }}
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3>Buyers</h3>
          <button 
            onClick={() => { setEditingBuyer(null); setShowBuyerForm(true); }}
            style={{ padding: '8px 16px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Add Buyer
          </button>
        </div>
        
        {showBuyerForm && (
          <AdminBuyerForm 
            onSubmit={handleCreateBuyer} 
            initialData={editingBuyer || {}} 
          />
        )}
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {buyers.map(buyer => (
            <div key={buyer._id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', position: 'relative' }}>
              <h3>{buyer.firstName} {buyer.lastName}</h3>
              <p>Remaining Purse: {buyer.purse} cr</p>
              <p>Players Bought: {buyer.purchasedPlayers.length}</p>
              <button 
                onClick={() => { setEditingBuyer(buyer); setShowBuyerForm(true); }}
                style={{ 
                  position: 'absolute', 
                  top: '10px', 
                  right: '10px', 
                  padding: '5px 10px', 
                  backgroundColor: '#FFC107', 
                  color: 'black', 
                  border: 'none', 
                  borderRadius: '4px', 
                  cursor: 'pointer'
                }}
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;