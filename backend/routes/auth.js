const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashed });
  await user.save();
  res.json({ msg: 'Registered' });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(40).json({ msg: 'Invalid Email' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(40).json({ msg: 'Invalid Password' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '2d'
  });

  res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
});

module.exports = router;
