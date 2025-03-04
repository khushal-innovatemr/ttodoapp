const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('../models2');
const router = express.Router();

router.post('/register', async (req, res) => {
    const { email, password, role } = req.body;
    const userId = uuidv4();

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).send({ error: "User already exists!" });

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ email, password: hashedPassword, id: userId, role: role || "user" });
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
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: "1h" });

        res.json({
            message: "Logged in successfully",
            token: token
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Server Error" });
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: "Logout failed" });
        }
        res.clearCookie('connect.sid');
        res.json({ message: 'Logged out successfully' });
    });
});


// router.post('/admin',verify, role_middleware(['admin']),async(req,res) => {
//     const { email, password, role } = req.body;
//     const userId = uuidv4();

//     try {
//         let user = await User.findOne({ email });
//         if (user) return res.status(400).send({ error: "User already exists!" });

//         const hashedPassword = await bcrypt.hash(password, 10);
//         const isAdmin = role === 'admin';
//         user = new User({ email, password: hashedPassword, id: userId, role: role || "user", isAdmin });
//         await user.save();

//         res.send({ message: "User added successfully" });
//     } catch (err) {
//         console.error("Error adding user:", err);
//         res.status(500).json({ error: "Server Error" });
//     }
// });

module.exports = router;