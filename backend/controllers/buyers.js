const Buyer = require('../models/Buyer');
const Player = require('../models/Player');

exports.getBuyer = async (req, res) => {
  try {
    const buyer = await Buyer.findById(req.user.id).populate('purchasedPlayers.playerId');
    res.json(buyer);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updatePurse = async (req, res) => {
  const { amount } = req.body;
  try {
    const buyer = await Buyer.findByIdAndUpdate(
      req.user.id,
      { $inc: { purse: -amount } },
      { new: true }
    );
    res.json(buyer);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};