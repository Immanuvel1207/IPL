import express from 'express';
import Player from '../models/Player.js';
import Buyer from '../models/Buyer.js';
import authenticate from '../middleware/auth.js';
import { adminAuth } from '../middleware/roleAuth.js';

const router = express.Router();

router.use(authenticate, adminAuth);

router.post('/players', async (req, res) => {
  try {
    const player = new Player(req.body);
    await player.save();
    res.status(201).json(player);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/players/:id', async (req, res) => {
  try {
    const player = await Player.findByIdAndDelete(req.params.id);
    if (!player) return res.status(404).json({ message: 'Player not found' });
    res.json({ message: 'Player deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/buyers', async (req, res) => {
  try {
    const buyer = new Buyer(req.body);
    await buyer.save();
    res.status(201).json(buyer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/buyers/:id', async (req, res) => {
  try {
    const buyer = await Buyer.findByIdAndDelete(req.params.id);
    if (!buyer) return res.status(404).json({ message: 'Buyer not found' });
    res.json({ message: 'Buyer deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/reset', async (req, res) => {
  try {
    await Player.updateMany({}, { isPurchased: false, team: '', soldPrice: 0 });
    await Buyer.updateMany({}, { purse: 118, purchasedPlayers: [] });
    res.json({ message: 'Auction reset successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;