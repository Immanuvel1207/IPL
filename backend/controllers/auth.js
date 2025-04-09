const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Player = require('../models/Player');
const Buyer = require('../models/Buyer');

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

exports.playerLogin = async (req, res) => {
  const { name, password } = req.body;
  try {
    const player = await Player.findOne({ name });
    if (!player) return res.status(404).json({ message: 'Player not found' });

    const isMatch = await bcrypt.compare(password, player.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken({ ...player._doc, role: 'player' });
    res.json({ token, player });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.buyerLogin = async (req, res) => {
  const { firstName, password } = req.body;
  try {
    const buyer = await Buyer.findOne({ firstName });
    if (!buyer) return res.status(404).json({ message: 'Buyer not found' });

    const isMatch = await bcrypt.compare(password, buyer.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken({ ...buyer._doc, role: 'buyer' });
    res.json({ token, buyer });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};