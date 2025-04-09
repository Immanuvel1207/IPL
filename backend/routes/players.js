const express = require('express');
const { getUnsoldPlayers, updatePlayer, getPlayer } = require('../controllers/players');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/unsold', getUnsoldPlayers);
router.put('/:id', auth, updatePlayer);
router.get('/:id', auth, getPlayer);

module.exports = (app) => {
  app.use('/api/players', router);
};