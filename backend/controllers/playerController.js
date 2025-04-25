const Player = require('../models/Player');

const getPlayer = async (req, res) => {
  try {
    const player = await Player.findById(req.user.id).select('-password');
    res.json(player);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

const updatePlayer = async (req, res) => {
  const { age, country, role, economyOrAverage, matchesPlayed, bestScore, basePrice, image } = req.body;
  try {
    let player = await Player.findById(req.user.id);
    if (!player) return res.status(404).json({ msg: 'Player not found' });
    if (player.isPurchased) return res.status(400).json({ msg: 'Cannot update after being purchased' });

    player = await Player.findByIdAndUpdate(
      req.user.id,
      { age, country, role, economyOrAverage, matchesPlayed, bestScore, basePrice, image },
      { new: true }
    ).select('-password');

    res.json(player);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

const getUnsoldPlayers = async (req, res) => {
  const { role, minPrice, maxPrice, search, page = 1, limit = 10 } = req.query;
  try {
    let query = { isPurchased: false };
    if (role) query.role = role;
    if (minPrice || maxPrice) {
      query.basePrice = {};
      if (minPrice) query.basePrice.$gte = Number(minPrice);
      if (maxPrice) query.basePrice.$lte = Number(maxPrice);
    }
    if (search) query.name = { $regex: search, $options: 'i' };

    const players = await Player.find(query)
      .select('-password')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Player.countDocuments(query);

    res.json({
      players,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page)
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = { getPlayer, updatePlayer, getUnsoldPlayers };