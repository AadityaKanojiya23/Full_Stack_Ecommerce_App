const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/login', async (req, res) => {
  const { password } = req.body;
  const email = req.body.email?.toLowerCase();
  console.log(`Login attempt for: ${email}`);
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      console.log(`Admin not found: ${email}`);
      if (email === 'admin@amore.com' && password === 'admin123') {
        const hashed = await bcrypt.hash(password, 10);
        const newAdmin = new Admin({ email, password: hashed });
        await newAdmin.save();
        const token = jwt.sign({ id: newAdmin._id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '1d' });
        return res.json({ token });
      }
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      console.log(`Password mismatch for: ${email}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    res.json(admin);
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
