import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Player from '../models/Player.js';
import Buyer from '../models/Buyer.js';
import Admin from '../models/Admin.js';

const router = express.Router();

const generateToken = (user, role) => {
  return jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

router.post('/login/player', async (req, res) => {
  const { name, password } = req.body;
  const player = await Player.findOne({ name });
  if (!player) return res.status(404).json({ message: 'Player not found' });

  const isMatch = await bcrypt.compare(password, player.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  const token = generateToken(player, 'player');
  res.json({ token, user: { id: player._id, name: player.name, role: 'player' } });
});

router.post('/login/buyer', async (req, res) => {
  const { firstName, password } = req.body;
  const buyer = await Buyer.findOne({ firstName });
  if (!buyer) return res.status(404).json({ message: 'Buyer not found' });

  const isMatch = await bcrypt.compare(password, buyer.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  const token = generateToken(buyer, 'buyer');
  res.json({ token, user: { id: buyer._id, name: buyer.firstName, role: 'buyer', purse: buyer.purse } });
});

router.post('/login/admin', async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });
  if (!admin) return res.status(404).json({ message: 'Admin not found' });

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  const token = generateToken(admin, 'admin');
  res.json({ token, user: { id: admin._id, username: admin.username, role: 'admin' } });
});

export default router;