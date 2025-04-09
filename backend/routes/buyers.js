const express = require('express');
const { getBuyer, updatePurse } = require('../controllers/buyers');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/me', auth, getBuyer);
router.put('/purse', auth, updatePurse);

module.exports = (app) => {
  app.use('/api/buyers', router);
};