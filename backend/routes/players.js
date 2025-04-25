import express from 'express';
import Player from '../models/Player.js';
import authenticate from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const { isPurchased, role, basePriceMin, basePriceMax, search } = req.query;
    let query = {};

    if (isPurchased) query.isPurchased = isPurchased === 'true';
    if (role) query.role = role;
    if (basePriceMin || basePriceMax) {
      query.basePrice = {};
      if (basePriceMin) query.basePrice.$gte = Number(basePriceMin);
      if (basePriceMax) query.basePrice.$lte = Number(basePriceMax);
    }
    if (search) query.name = { $regex: search, $options: 'i' };

    const players = await Player.find(query);
    res.json(players);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/unsold', authenticate, async (req, res) => {
  try {
    const players = await Player.find({ isPurchased: false });
    res.json(players);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) return res.status(404).json({ message: 'Player not found' });
    res.json(player);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', authenticate, async (req, res) => {
  try {
    const player = await Player.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!player) return res.status(404).json({ message: 'Player not found' });
    res.json(player);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;