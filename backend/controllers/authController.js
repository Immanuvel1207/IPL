const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Player = require('../models/Player');
const Buyer = require('../models/Buyer');
const Admin = require('../models/Admin');

const loginPlayer = async (req, res) => {
  const { name, password } = req.body;
  try {
    const player = await Player.findOne({ name });
    if (!player) return res.status(400).json({ msg: 'Player not found' });

    const isMatch = await bcrypt.compare(password, player.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { id: player.id, name: player.name, role: 'player' };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: payload });
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

const loginBuyer = async (req, res) => {
  const { firstName, password } = req.body;
  try {
    const buyer = await Buyer.findOne({ firstName });
    if (!buyer) return res.status(400).json({ msg: 'Buyer not found' });

    const isMatch = await bcrypt.compare(password, buyer.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { id: buyer.id, firstName: buyer.firstName, role: 'buyer' };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: payload });
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

const loginAdmin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(400).json({ msg: 'Admin not found' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { id: admin.id, username: admin.username, role: 'admin' };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: payload });
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = { loginPlayer, loginBuyer, loginAdmin };