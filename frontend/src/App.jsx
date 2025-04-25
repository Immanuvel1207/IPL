import { useState, useEffect } from 'react';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState('');
  const [team, setTeam] = useState('');
  const [message, setMessage] = useState('');
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [buyers, setBuyers] = useState([]);
  const [bidAmount, setBidAmount] = useState('');
  const [ws, setWs] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [highestBid, setHighestBid] = useState(null);
  const [basePrice, setBasePrice] = useState(0);
  const [bidHistory, setBidHistory] = useState([]);
  const [auctionLog, setAuctionLog] = useState([]);

  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:8080');
    setWs(websocket);

    websocket.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'login-success') {
        setLoggedIn(true);
        setRole(data.role);
        if (data.team) setTeam(data.team);
        if (data.buyers) setBuyers(data.buyers);
        if (data.log) setAuctionLog(data.log);
      } else if (data.type === 'login-failure') {
        setMessage('Login failed. Try again.');
      } else if (data.type === 'buyer-joined') {
        setBuyers(data.buyers);
        setMessage(`${data.team} has joined the auction`);
      } else if (data.type === 'buyer-left') {
        setBuyers(data.buyers);
        setMessage(`${data.team} has left the auction`);
      } else if (data.type === 'auction-started') {
        setMessage('Auction has started!');
      } else if (data.type === 'new-player') {
        setCurrentPlayer(data.player);
        setBasePrice(data.player.basePrice);
        setHighestBid(null);
        setBidHistory(data.bidHistory || []);
        setMessage(`Bidding started for ${data.player.name} (Base: ${data.player.basePrice} Cr)`);
      } else if (data.type === 'bid-update') {
        setHighestBid({ team: data.team, amount: data.amount });
        setTimeLeft(data.timeLeft);
        setBidHistory(data.bidHistory);
        setMessage(`${data.team} bid ${data.amount} Cr for ${data.player.name}`);
      } else if (data.type === 'countdown') {
        setTimeLeft(data.timeLeft);
        if (data.highestBid) {
          setHighestBid(data.highestBid);
        }
        if (data.bidHistory) {
          setBidHistory(data.bidHistory);
        }
      } else if (data.type === 'player-sold') {
        setMessage(`${data.player.name} SOLD to ${data.team} for ${data.amount} Cr!`);
        setCurrentPlayer(null);
        setHighestBid(null);
        setBidHistory(data.bidHistory);
      } else if (data.type === 'player-unsold') {
        setMessage(`${data.player.name} went UNSOLD!`);
        setCurrentPlayer(null);
        setHighestBid(null);
        setBidHistory(data.bidHistory);
      } else if (data.type === 'auction-completed') {
        setMessage('Auction completed!');
        setCurrentPlayer(null);
      } else if (data.type === 'auction-log') {
        setAuctionLog(data.log);
      } else if (data.type === 'auction-log-update') {
        setAuctionLog(prev => [...prev, data.message]);
      }
    };

    websocket.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };

    return () => {
      websocket.close();
    };
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'login',
        username,
        password
      }));
    } else {
      setMessage('Connection not ready. Please try again.');
    }
  };

  const autoBid = () => {
    if (!currentPlayer || !ws || role !== 'buyer') return;
    
    const currentAmount = highestBid ? highestBid.amount : basePrice;
    let increment = 0.25; // default increment
    
    if (currentAmount >= 10) {
      increment = 0.5;
    }
    
    const newAmount = parseFloat((currentAmount + increment).toFixed(2));
    
    ws.send(JSON.stringify({
      type: 'bid',
      amount: newAmount,
      timeLeft: timeLeft
    }));
  };

  const startAuction = () => {
    if (ws) {
      ws.send(JSON.stringify({
        type: 'start-auction'
      }));
    }
  };

  const placeBid = () => {
    if (bidAmount && currentPlayer && ws) {
      const amount = parseFloat(bidAmount);
      if (amount >= basePrice && (!highestBid || amount > highestBid.amount)) {
        ws.send(JSON.stringify({
          type: 'bid',
          amount: amount,
          timeLeft: timeLeft
        }));
        setBidAmount('');
      } else {
        setMessage(`Bid must be higher than current highest (${highestBid ? highestBid.amount : basePrice} Cr)`);
      }
    }
  };

  if (!loggedIn) {
    return (
      <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
        <h1>IPL Auction Login</h1>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div>
            <label>Username: </label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              style={{ padding: '5px' }}
            />
          </div>
          <div>
            <label>Password: </label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              style={{ padding: '5px' }}
            />
          </div>
          <button type="submit" style={{ padding: '8px' }}>Login</button>
        </form>
        <p>Try: (admin, admin), (RCB, RCB), (CSK, CSK)</p>
        {message && <p style={{ color: 'red' }}>{message}</p>}
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', display: 'flex', gap: '20px' }}>
      <div style={{ flex: 2 }}>
        <h1>IPL Auction - {role === 'admin' ? 'Admin' : team}</h1>
        <div style={{ 
          backgroundColor: '#f0f0f0', 
          padding: '15px', 
          marginBottom: '20px',
          borderRadius: '5px'
        }}>
          <p style={{ fontWeight: 'bold', fontSize: '1.2em' }}>{message}</p>
        </div>

        {role === 'admin' && (
          <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd' }}>
            <h2>Admin Panel</h2>
            <p>Connected teams: {buyers.join(', ') || 'None'}</p>
            {!currentPlayer && (
              <button 
                onClick={startAuction} 
                disabled={buyers.length < 2}
                style={{ 
                  padding: '10px 15px',
                  backgroundColor: buyers.length < 2 ? '#ccc' : '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: buyers.length < 2 ? 'not-allowed' : 'pointer'
                }}
              >
                Start Auction ({buyers.length}/2 teams connected)
              </button>
            )}
          </div>
        )}

        {currentPlayer && (
    <div style={{ 
      border: '1px solid #ddd',
      padding: '20px',
      marginBottom: '20px',
      backgroundColor: '#fff'
    }}>
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        {currentPlayer.image && (
          <img 
            src={currentPlayer.image} 
            alt={currentPlayer.name} 
            style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '5px' }}
          />
        )}
        <div>
          <h2>{currentPlayer.name}</h2>
          <p><strong>Role:</strong> {currentPlayer.role || 'N/A'}</p>
          <p><strong>Batting Avg:</strong> {currentPlayer.battingAvg || 'N/A'}</p>
          <p><strong>Bowling Avg:</strong> {currentPlayer.bowlingAvg || 'N/A'}</p>
          <p><strong>Economy:</strong> {currentPlayer.economy || 'N/A'}</p>
          <p><strong>Strike Rate:</strong> {currentPlayer.strikeRate || 'N/A'}</p>
        </div>
      </div>
      
      <p>Base Price: {basePrice} Cr</p>
      <p>Time Left: {timeLeft} seconds</p>
      
      {highestBid && (
        <div style={{ 
          margin: '15px 0',
          padding: '10px',
          backgroundColor: '#e6f7ff',
          borderLeft: '4px solid #1890ff'
        }}>
          <p>Highest Bid: {highestBid.team} - {highestBid.amount} Cr</p>
        </div>
      )}

      {role === 'buyer' && (
        <div style={{ marginTop: '15px' }}>
          <button 
            onClick={autoBid}
            style={{
              padding: '8px 15px',
              backgroundColor: '#1890ff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1.1em',
              fontWeight: 'bold'
            }}
          >
            BID (+{highestBid ? (highestBid.amount >= 10 ? '0.5' : '0.25') : (basePrice >= 10 ? '0.5' : '0.25')} Cr)
          </button>
        </div>
      )}


            {bidHistory.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <h3>Bid History for {currentPlayer.name}</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {bidHistory.map((bid, index) => (
                    <li key={index} style={{ 
                      padding: '8px',
                      borderBottom: '1px solid #eee',
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}>
                      <span>{bid.team}</span>
                      <span>{bid.amount} Cr</span>
                      <span style={{ color: '#666' }}>{bid.time}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ flex: 1, borderLeft: '1px solid #ddd', paddingLeft: '20px' }}>
        <h2>Auction Log</h2>
        <div style={{ 
          height: '500px', 
          overflowY: 'auto',
          backgroundColor: '#f9f9f9',
          padding: '10px',
          borderRadius: '5px'
        }}>
          {auctionLog.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {auctionLog.map((log, index) => (
                <li key={index} style={{ 
                  padding: '5px 0',
                  borderBottom: '1px solid #eee',
                  fontSize: '0.9em'
                }}>
                  {log}
                </li>
              ))}
            </ul>
          ) : (
            <p>No auction activity yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;