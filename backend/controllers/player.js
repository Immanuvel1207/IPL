const Player = require('../models/Player');

exports.getUnsoldPlayers = async (req, res) => {
  const { page = 1, limit = 10, role, minPrice, maxPrice, search } = req.query;
  const query = { isPurchased: false };

  if (role) query.role = role;
  if (minPrice || maxPrice) {
    query.basePrice = {};
    if (minPrice) query.basePrice.$gte = Number(minPrice);
    if (maxPrice) query.basePrice.$lte = Number(maxPrice);
  }
  if (search) query.name = { $regex: search, $options: 'i' };

  try {
    const players = await Player.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Player.countDocuments(query);

    res.json({
      players,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updatePlayer = async (req, res) => {
  const { id } = req.params;
  try {
    const player = await Player.findByIdAndUpdate(id, req.body, { new: true });
    res.json(player);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPlayer = async (req, res) => {
  const { id } = req.params;
  try {
    const player = await Player.findById(id);
    res.json(player);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};