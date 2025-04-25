const bcrypt = require('bcryptjs');
const Player = require('../models/Player');
const Buyer = require('../models/Buyer');
const Admin = require('../models/Admin');

const createPlayer = async (req, res) => {
  const { name, age, country, role, economyOrAverage, matchesPlayed, bestScore, basePrice, image, password } = req.body;
  try {
    let player = await Player.findOne({ name });
    if (player) return res.status(400).json({ msg: 'Player already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    player = new Player({
      name,
      age,
      country,
      role,
      economyOrAverage,
      matchesPlayed,
      bestScore,
      basePrice,
      image,
      password: hashedPassword
    });

    await player.save();
    res.json(player);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

const updatePlayer = async (req, res) => {
  const { id } = req.params;
  const { name, age, country, role, economyOrAverage, matchesPlayed, bestScore, basePrice, image } = req.body;
  try {
    const player = await Player.findByIdAndUpdate(
      id,
      { name, age, country, role, economyOrAverage, matchesPlayed, bestScore, basePrice, image },
      { new: true }
    );
    res.json(player);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

const deletePlayer = async (req, res) => {
  const { id } = req.params;
  try {
    await Player.findByIdAndDelete(id);
    res.json({ msg: 'Player deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

const getAllPlayers = async (req, res) => {
  try {
    const players = await Player.find().select('-password');
    res.json(players);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

const createBuyer = async (req, res) => {
  const { firstName, lastName, password } = req.body;
  try {
    let buyer = await Buyer.findOne({ firstName });
    if (buyer) return res.status(400).json({ msg: 'Buyer already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    buyer = new Buyer({
      firstName,
      lastName,
      password: hashedPassword
    });

    await buyer.save();
    res.json(buyer);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

const updateBuyer = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName } = req.body;
  try {
    const buyer = await Buyer.findByIdAndUpdate(
      id,
      { firstName, lastName },
      { new: true }
    );
    res.json(buyer);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

const deleteBuyer = async (req, res) => {
  const { id } = req.params;
  try {
    await Buyer.findByIdAndDelete(id);
    res.json({ msg: 'Buyer deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

const getAllBuyers = async (req, res) => {
  try {
    const buyers = await Buyer.find().select('-password');
    res.json(buyers);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

const resetAuction = async (req, res) => {
  try {
    await Player.updateMany({}, { isPurchased: false, purchasedBy: null, purchasedPrice: null, teamName: null });
    await Buyer.updateMany({}, { purse: 118, purchasedPlayers: [] });
    res.json({ msg: 'Auction reset successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = {
  createPlayer,
  updatePlayer,
  deletePlayer,
  getAllPlayers,
  createBuyer,
  updateBuyer,
  deleteBuyer,
  getAllBuyers,
  resetAuction
};