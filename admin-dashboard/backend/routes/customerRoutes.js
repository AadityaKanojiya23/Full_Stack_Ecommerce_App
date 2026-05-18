const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
