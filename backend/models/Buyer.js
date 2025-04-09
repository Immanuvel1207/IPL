const mongoose = require('mongoose');

const BuyerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  purse: { type: Number, default: 118 },
  purchasedPlayers: [{
    playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
    price: { type: Number }
  }]
});

module.exports = mongoose.model('Buyer', BuyerSchema);