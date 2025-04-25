import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PlayerCard from '../components/PlayerCard'

const BuyerDashboard = ({ buyer }) => {
  const [unsoldPlayers, setUnsoldPlayers] = useState([]);
  const [purchasedPlayers, setPurchasedPlayers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    role: '',
    minPrice: '',
    maxPrice: '',
    search: ''
  });

  useEffect(() => {
    const fetchBuyerData = async () => {
      const res = await axios.get('/api/buyers/me');
      setPurchasedPlayers(res.data.purchasedPlayers);
    };
    fetchBuyerData();
  }, []);

  useEffect(() => {
    const fetchUnsoldPlayers = async () => {
      const params = { ...filters, page: currentPage };
      const res = await axios.get('/api/players/unsold', { params });
      setUnsoldPlayers(res.data.players);
      setTotalPages(res.data.totalPages);
    };
    fetchUnsoldPlayers();
  }, [currentPage, filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setCurrentPage(1);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Buyer Dashboard - {buyer.firstName}</h2>
      <p>Remaining Purse: {buyer.purse} cr</p>
      
      <h3>Purchased Players</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {purchasedPlayers.map((item) => (
          <PlayerCard key={item.playerId._id} player={item.playerId} />
        ))}
      </div>
      
      <h3>Unsold Players</h3>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          name="search"
          placeholder="Search by name"
          value={filters.search}
          onChange={handleFilterChange}
          style={{ padding: '8px', marginRight: '10px' }}
        />
        <select
          name="role"
          value={filters.role}
          onChange={handleFilterChange}
          style={{ padding: '8px', marginRight: '10px' }}
        >
          <option value="">All Roles</option>
          <option value="batsman">Batsman</option>
          <option value="bowler">Bowler</option>
          <option value="all-rounder">All Rounder</option>
        </select>
        <input
          type="number"
          name="minPrice"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={handleFilterChange}
          style={{ padding: '8px', marginRight: '10px', width: '100px' }}
        />
        <input
          type="number"
          name="maxPrice"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={handleFilterChange}
          style={{ padding: '8px', marginRight: '10px', width: '100px' }}
        />
      </div>
      
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {unsoldPlayers.map((player) => (
          <PlayerCard key={player._id} player={player} />
        ))}
      </div>
      
      <div style={{ marginTop: '20px' }}>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            style={{
              padding: '8px 12px',
              margin: '0 5px',
              backgroundColor: currentPage === page ? '#2196F3' : '#ddd',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BuyerDashboard;