import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const BiddingInterface = ({ buyerId, purse }) => {
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [bidAmount, setBidAmount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [biddingHistory, setBiddingHistory] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_API_URL);
    setSocket(newSocket);

    newSocket.on('newBid', (data) => {
      setBiddingHistory(prev => [...prev, data]);
    });

    newSocket.on('playerSold', (data) => {
      setBiddingHistory(prev => [...prev, { message: `Player ${data.player.name} sold to ${data.buyer.firstName} for ${data.amount} cr` }]);
      setCurrentPlayer(null);
    });

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (!currentPlayer) {
      fetchRandomPlayer();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          if (bidAmount > currentPlayer.basePrice) {
            socket.emit('playerSold', { player: currentPlayer, buyer: { firstName: 'Team' }, amount: bidAmount });
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentPlayer, bidAmount]);

  const fetchRandomPlayer = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/players/unsold`);
      if (res.data.length > 0) {
        const randomPlayer = res.data[Math.floor(Math.random() * res.data.length)];
        setCurrentPlayer(randomPlayer);
        setBidAmount(randomPlayer.basePrice);
        setTimeLeft(5);
        setBiddingHistory([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBid = () => {
    const increment = bidAmount < 10 ? 0.25 : 0.5;
    const newBid = bidAmount + increment;
    
    if (newBid > purse) {
      alert('Insufficient funds');
      return;
    }

    setBidAmount(newBid);
    socket.emit('bid', { player: currentPlayer, amount: newBid, buyer: { firstName: 'Team' } });
    setTimeLeft(5);
  };

  if (!currentPlayer) {
    return <div>Loading next player...</div>;
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', margin: '20px 0' }}>
      <h2>Bidding: {currentPlayer.name}</h2>
      <p>Time left: {timeLeft} seconds</p>
      <p>Current bid: {bidAmount} cr</p>
      <button onClick={handleBid} style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        Bid (+{bidAmount < 10 ? '0.25' : '0.50'} cr)
      </button>
      
      <div style={{ marginTop: '20px' }}>
        <h3>Bidding History</h3>
        <ul>
          {biddingHistory.map((item, index) => (
            <li key={index}>{item.message || `${item.buyer.firstName} bid ${item.amount} cr`}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BiddingInterface;