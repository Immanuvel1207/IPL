import express from 'express';
import Buyer from '../models/Buyer.js';
import Player from '../models/Player.js';
import authenticate from '../middleware/auth.js';

const router = express.Router();

router.get('/:id', authenticate, async (req, res) => {
  try {
    const buyer = await Buyer.findById(req.params.id).populate('purchasedPlayers.playerId');
    if (!buyer) return res.status(404).json({ message: 'Buyer not found' });
    res.json(buyer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/bid', authenticate, async (req, res) => {
  try {
    const { playerId, buyerId, amount } = req.body;
    
    const buyer = await Buyer.findById(buyerId);
    if (!buyer) return res.status(404).json({ message: 'Buyer not found' });
    
    if (buyer.purse < amount) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }

    const player = await Player.findById(playerId);
    if (!player) return res.status(404).json({ message: 'Player not found' });
    if (player.isPurchased) return res.status(400).json({ message: 'Player already purchased' });

    res.json({ message: 'Bid placed successfully', buyer, player });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;