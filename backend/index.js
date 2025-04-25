const WebSocket = require('ws');
const { MongoClient } = require('mongodb');

const wss = new WebSocket.Server({ port: 8080 });

// MongoDB connection URI
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

let players = [];
let currentPlayerIndex = 0;
let auctionStarted = false;
let connectedBuyers = new Set();
let highestBid = { team: null, amount: 0 };
let countdownInterval;
let timeLeft = 20;
let bidHistory = [];
let auctionLog = [];

async function connectToMongoDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db('IPL-AUCTION');
        players = await db.collection('players').find().toArray();
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
}

connectToMongoDB();

wss.on('connection', (ws) => {
    console.log('New client connected');

    if (auctionLog.length > 0) {
        ws.send(JSON.stringify({
            type: 'auction-log',
            log: auctionLog
        }));
    }

    ws.on('message', async (message) => {
        const data = JSON.parse(message);

        if (data.type === 'login') {
            try {
                const db = client.db('IPL-AUCTION');
                const user = await db.collection('users').findOne({
                    username: data.username,
                    password: data.password
                });

                if (user) {
                    ws.role = user.role;

                    if (user.role === 'buyer') {
                        ws.team = user.team;
                        connectedBuyers.add(user.team);
                        console.log(`${user.team} joined the auction`);
                        ws.send(JSON.stringify({
                            type: 'login-success',
                            role: user.role,
                            team: user.team,
                            buyers: Array.from(connectedBuyers),
                            log: auctionLog
                        }));

                        broadcast({
                            type: 'buyer-joined',
                            team: user.team,
                            buyers: Array.from(connectedBuyers)
                        });

                        addToLog(`${user.team} joined the auction`);
                    } else {
                        // Admin login
                        ws.send(JSON.stringify({
                            type: 'login-success',
                            role: 'admin',
                            buyers: Array.from(connectedBuyers),
                            log: auctionLog
                        }));
                    }
                } else {
                    ws.send(JSON.stringify({ type: 'login-failure' }));
                }
            } catch (err) {
                console.error('Login error:', err);
                ws.send(JSON.stringify({ type: 'login-failure' }));
            }
        }

        if (data.type === 'start-auction' && ws.role === 'admin') {
            auctionStarted = true;
            addToLog('Auction started by admin');
            broadcast({ type: 'auction-started' });
            nextPlayer();
        }

        if (data.type === 'bid' && ws.role === 'buyer' && auctionStarted) {
            const player = players[currentPlayerIndex];
            const currentAmount = highestBid.amount;
            const increment = currentAmount < 10 ? 0.25 : 0.5;
            const newAmount = parseFloat((currentAmount + increment).toFixed(2));

            highestBid = { team: ws.team, amount: newAmount };
            bidHistory.push({
                team: ws.team,
                amount: newAmount,
                time: new Date().toLocaleTimeString(),
                player: player.name
            });

            addToLog(`${ws.team} bid ${newAmount} Cr for ${player.name}`);
            resetCountdown();

            broadcast({
                type: 'bid-update',
                player,
                team: ws.team,
                amount: newAmount,
                timeLeft,
                bidHistory
            });
        }
    });

    ws.on('close', () => {
        if (ws.team) {
            connectedBuyers.delete(ws.team);
            addToLog(`${ws.team} left the auction`);
            broadcast({
                type: 'buyer-left',
                team: ws.team,
                buyers: Array.from(connectedBuyers)
            });
        }
        console.log('Client disconnected');
    });
});

function addToLog(message) {
    const timestamp = new Date().toLocaleTimeString();
    auctionLog.push(`${timestamp} - ${message}`);
    broadcast({
        type: 'auction-log-update',
        message: `${timestamp} - ${message}`
    });
}

function broadcast(message) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}

function nextPlayer() {
    if (currentPlayerIndex < players.length) {
        bidHistory = [];
        const player = players[currentPlayerIndex];
        highestBid = { team: null, amount: player.basePrice };

        addToLog(`Bidding started for ${player.name} (Base: ${player.basePrice} Cr)`);

        broadcast({
            type: 'new-player',
            player,
            basePrice: player.basePrice,
            bidHistory
        });

        resetCountdown();
    } else {
        addToLog('Auction completed!');
        broadcast({ type: 'auction-completed' });
    }
}

function concludePlayer() {
    const player = players[currentPlayerIndex];

    if (highestBid.team) {
        addToLog(`${player.name} SOLD to ${highestBid.team} for ${highestBid.amount} Cr!`);
        broadcast({
            type: 'player-sold',
            player,
            team: highestBid.team,
            amount: highestBid.amount,
            bidHistory
        });
    } else {
        addToLog(`${player.name} went UNSOLD!`);
        broadcast({
            type: 'player-unsold',
            player,
            bidHistory
        });
    }

    currentPlayerIndex++;
    nextPlayer();
}

function resetCountdown() {
    clearInterval(countdownInterval);
    timeLeft = 20;
    const player = players[currentPlayerIndex];

    countdownInterval = setInterval(() => {
        timeLeft--;
        broadcast({
            type: 'countdown',
            timeLeft,
            player,
            highestBid: highestBid.team ? highestBid : null,
            bidHistory
        });

        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            concludePlayer();
        }
    }, 1000);
}

process.on('SIGINT', async () => {
    await client.close();
    process.exit();
});
