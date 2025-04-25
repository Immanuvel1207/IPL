const Player = require('../models/Player');
const Buyer = require('../models/Buyer');

let currentPlayer = null;
let currentBid = 0;
let currentBidder = null;
let timer = null;
let auctionRunning = false;

const startAuction = async (io) => {
  if (auctionRunning) return;
  auctionRunning = true;

  const unsoldPlayers = await Player.find({ isPurchased: false });
  if (unsoldPlayers.length === 0) {
    io.emit('auctionEnd');
    auctionRunning = false;
    return;
  }

  const randomIndex = Math.floor(Math.random() * unsoldPlayers.length);
  currentPlayer = unsoldPlayers[randomIndex];
  currentBid = currentPlayer.basePrice;
  currentBidder = null;

  io.emit('newPlayer', { player: currentPlayer, currentBid });

  timer = setTimeout(() => {
    if (currentBidder) {
      sellPlayer(io);
    } else {
      io.emit('playerUnsold', { player: currentPlayer });
      startAuction(io);
    }
  }, 5000);
};

const placeBid = async (io, buyerId, amount) => {
  if (!auctionRunning) return false;

  const buyer = await Buyer.findById(buyerId);
  if (!buyer || buyer.purse < amount) return false;

  if (amount <= 10 && amount - currentBid >= 0.25) {
    currentBid = amount;
    currentBidder = buyerId;
  } else if (amount > 10 && amount - currentBid >= 0.5) {
    currentBid = amount;
    currentBidder = buyerId;
  } else {
    return false;
  }

  clearTimeout(timer);
  timer = setTimeout(() => {
    sellPlayer(io);
  }, 5000);

  io.emit('newBid', { buyer: buyer.firstName, amount: currentBid });
  return true;
};

const sellPlayer = async (io) => {
  const player = await Player.findByIdAndUpdate(
    currentPlayer._id,
    {
      isPurchased: true,
      purchasedBy: currentBidder,
      purchasedPrice: currentBid,
      teamName: currentBidder.firstName
    },
    { new: true }
  );

  await Buyer.findByIdAndUpdate(
    currentBidder,
    {
      $inc: { purse: -currentBid },
      $push: { purchasedPlayers: { player: player._id, price: currentBid } }
    }
  );

  io.emit('playerSold', { player, buyer: currentBidder.firstName, price: currentBid });
  startAuction(io);
};

module.exports = { startAuction, placeBid };