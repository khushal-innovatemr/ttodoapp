const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('../models2');
const router = express.Router();
const verify = require('../middleware/auth')


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

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: "24h" });

        res.json({
            message: "Logged in successfully",
            token: token,
            role:user.role,
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Server Error" });
    }
});

router.post('/login/add', verify, async (req, res) => {
    if (req.user.IsAdmin) {
        res.send({
            message: "Add button displayed to redirect to the register page to add users"
        });
    } else {
        res.status(403).send({ error: "Access denied" });
    }
});

router.get('/login/users', verify, async (req, res) => {
    if (req.user.IsAdmin) {
        try {
            const users = await User.find({}, 'email role'); 
            return res.send(users);
        } catch (err) {
            console.error("Fetching users error:", err);
            res.status(500).send({ error: "Server Error" });
        }
    } else {
        res.status(403).send({ error: "Access denied" });
    }
});

router.delete('/login/delete', verify, async (req, res) => {
    if (req.user.IsAdmin) {
        try {
            const { userId } = req.body;
            await User.findByIdAndDelete(userId);
            res.send({ message: "User deleted successfully" });
        } catch (err) {
            console.error("Deleting user error:", err);
            res.status(500).send({ error: "Server Error" });
        }
    } else {
        res.status(403).send({ error: "Access denied" });
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

module.exports = router;