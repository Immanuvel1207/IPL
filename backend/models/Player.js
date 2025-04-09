const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  country: { type: String, required: true },
  role: { type: String, enum: ['batsman', 'bowler', 'all-rounder'], required: true },
  economyOrAverage: { type: Number, required: true },
  matchesPlayed: { type: Number, required: true },
  bestScore: { type: String, required: true },
  basePrice: { type: Number, required: true },
  image: { type: String, required: true },
  password: { type: String, required: true },
  isPurchased: { type: Boolean, default: false },
  team: { type: String, default: '' },
  soldPrice: { type: Number, default: 0 }
});

module.exports = mongoose.model('Player', PlayerSchema);