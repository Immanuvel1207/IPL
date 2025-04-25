import React from 'react';

const PlayerCard = ({ player, onBid, isBuyer, isAdmin, onDelete }) => {
  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', margin: '10px', width: '300px' }}>
      <img src={player.image} alt={player.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
      <h3>{player.name}</h3>
      <p>Age: {player.age}</p>
      <p>Country: {player.country}</p>
      <p>Role: {player.role}</p>
      <p>Matches: {player.matchesPlayed}</p>
      <p>Best Score: {player.bestScore}</p>
      <p>Base Price: {player.basePrice} cr</p>
      {player.isPurchased && <p>Team: {player.team}</p>}
      {player.isPurchased && <p>Sold Price: {player.soldPrice} cr</p>}
      
      {isBuyer && !player.isPurchased && (
        <button onClick={() => onBid(player._id)} style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Bid
        </button>
      )}
      
      {isAdmin && (
        <button onClick={() => onDelete(player._id)} style={{ padding: '8px 16px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginLeft: '10px' }}>
          Delete
        </button>
      )}
    </div>
  );
};

export default PlayerCard;