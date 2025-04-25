const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

const players = [
  { id: 1, name: "Virat Kohli", basePrice: 2 },
  { id: 2, name: "MS Dhoni", basePrice: 1.5 },
  { id: 3, name: "Rohit Sharma", basePrice: 1.8 },
  { id: 4, name: "Jasprit Bumrah", basePrice: 1.2 },
  { id: 5, name: "Hardik Pandya", basePrice: 1 }
];

let currentPlayerIndex = 0;
let auctionStarted = false;
let connectedBuyers = new Set();
let highestBid = { team: null, amount: 0 };
let countdownInterval;

wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    
    if (data.type === 'login') {
      if (data.username === 'admin' && data.password === 'admin') {
        ws.role = 'admin';
        ws.send(JSON.stringify({ 
          type: 'login-success', 
          role: 'admin',
          buyers: Array.from(connectedBuyers)
        }));
      } else if (
        (data.username === 'RCB' && data.password === 'RCB') ||
        (data.username === 'CSK' && data.password === 'CSK')
      ) {
        ws.role = 'buyer';
        ws.team = data.username;
        connectedBuyers.add(data.username);
        ws.send(JSON.stringify({ 
          type: 'login-success', 
          role: 'buyer', 
          team: data.username 
        }));
        broadcast({
          type: 'buyer-joined',
          team: data.username,
          buyers: Array.from(connectedBuyers)
        });
      } else {
        ws.send(JSON.stringify({ type: 'login-failure' }));
      }
    }

    if (data.type === 'start-auction' && ws.role === 'admin') {
      auctionStarted = true;
      broadcast({ type: 'auction-started' });
      nextPlayer();
    }

    if (data.type === 'bid' && ws.role === 'buyer' && auctionStarted) {
      const amount = parseFloat(data.amount);
      if (amount > highestBid.amount) {
        highestBid = { team: ws.team, amount };
        broadcast({
          type: 'bid-update',
          player: players[currentPlayerIndex],
          team: ws.team,
          amount: amount,
          timeLeft: data.timeLeft
        });
      }
    }
  });

  ws.on('close', () => {
    if (ws.team) {
      connectedBuyers.delete(ws.team);
      broadcast({ 
        type: 'buyer-left', 
        team: ws.team, 
        buyers: Array.from(connectedBuyers) 
      });
    }
    console.log('Client disconnected');
  });
});

function broadcast(message) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

function nextPlayer() {
  if (currentPlayerIndex < players.length) {
    highestBid = { team: null, amount: players[currentPlayerIndex].basePrice };
    const player = players[currentPlayerIndex];
    
    broadcast({ 
      type: 'new-player', 
      player,
      basePrice: player.basePrice
    });
    
    let timeLeft = 20;
    
    countdownInterval = setInterval(() => {
      timeLeft--;
      
      broadcast({
        type: 'countdown',
        timeLeft,
        player: player,
        highestBid: highestBid.team ? highestBid : null
      });
      
      if (timeLeft <= 0) {
        clearInterval(countdownInterval);
        concludePlayer();
      }
    }, 1000);
  } else {
    broadcast({ type: 'auction-completed' });
  }
}

function concludePlayer() {
  const player = players[currentPlayerIndex];
  
  if (highestBid.team) {
    broadcast({
      type: 'player-sold',
      player,
      team: highestBid.team,
      amount: highestBid.amount
    });
  } else {
    broadcast({ 
      type: 'player-unsold', 
      player 
    });
  }
  
  currentPlayerIndex++;
  nextPlayer();
}