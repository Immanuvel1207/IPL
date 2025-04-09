const express = require('express');
const { playerLogin, buyerLogin } = require('../controllers/auth');

const router = express.Router();

router.post('/player/login', playerLogin);
router.post('/buyer/login', buyerLogin);

module.exports = (app) => {
  app.use('/api/auth', router);
};