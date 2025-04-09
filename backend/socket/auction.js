const Player = require('../models/Player');
const Buyer = require('../models/Buyer');

let currentPlayer = null;
let currentBid = 0;
let highestBidder = null;
let timer = null;
let auctionActive = false;

const resetAuction = () => {
  currentPlayer = null;
  currentBid = 0;
  highestBidder = null;
  clearTimeout(timer);
  auctionActive = false;
};

const startTimer = (io) => {
  clearTimeout(timer);
  timer = setTimeout(async () => {
    if (highestBidder) {
      const buyer = await Buyer.findOne({ firstName: highestBidder });
      const player = await Player.findByIdAndUpdate(currentPlayer._id, {
        isPurchased: true,
        team: highestBidder,
        soldPrice: currentBid
      }, { new: true });

      buyer.purchasedPlayers.push({ playerId: player._id, price: currentBid });
      buyer.purse -= currentBid;
      await buyer.save();

      io.emit('playerSold', { player, buyer: highestBidder, price: currentBid });
    } else {
      io.emit('playerUnsold', { player: currentPlayer });
    }
    resetAuction();
  }, 5000);
};

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('startAuction', async () => {
      if (auctionActive) return;

      const unsoldPlayers = await Player.find({ isPurchased: false });
      if (unsoldPlayers.length === 0) {
        io.emit('auctionFinished');
        return;
      }

      const randomPlayer = unsoldPlayers[Math.floor(Math.random() * unsoldPlayers.length)];
      currentPlayer = randomPlayer;
      currentBid = randomPlayer.basePrice;
      highestBidder = null;
      auctionActive = true;

      io.emit('newPlayer', { player: randomPlayer, currentBid: currentBid });
      startTimer(io);
    });

    socket.on('placeBid', ({ buyer, amount }) => {
      if (!auctionActive) return;
      if (amount <= currentBid) return;

      const increment = currentBid >= 10 ? 0.5 : 0.25;
      currentBid = amount;
      highestBidder = buyer;

      io.emit('newBid', { buyer, amount: currentBid });
      startTimer(io);
    });
  });
};