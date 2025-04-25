const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth');
const { startAuction, placeBid } = require('../controllers/auctionController');

router.post('/start', auth, (req, res) => {
  startAuction(req.app.get('io'));
  res.json({ msg: 'Auction started' });
});

router.post('/bid', auth, async (req, res) => {
  const success = await placeBid(req.app.get('io'), req.user.id, req.body.amount);
  if (success) {
    res.json({ msg: 'Bid placed' });
  } else {
    res.status(400).json({ msg: 'Invalid bid' });
  }
});

module.exports = router;