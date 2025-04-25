const Buyer = require('../models/Buyer');
const Player = require('../models/Player');

const getBuyer = async (req, res) => {
  try {
    const buyer = await Buyer.findById(req.user.id)
      .select('-password')
      .populate('purchasedPlayers.player');
    res.json(buyer);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = { getBuyer };