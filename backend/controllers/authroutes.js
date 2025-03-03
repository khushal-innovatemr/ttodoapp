const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models2');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Use findOne instead of find for single document
    let user = await User.findOne({ email });
    if (user) return res.status(400).send({ error: "User already exists!" });
    
    const pwd = await bcrypt.hash(password, 10);
    user = new User({ email, password: pwd });
    await user.save();
    
    res.send({ message: "User registered successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Use findOne instead of find for single document
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });
    
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: "1h" });
    
    // For Angular clients, we'll return the token directly
    res.json({ 
      message: "Logged in successfully",
      token: token 
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

router.post('/logout', async (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;