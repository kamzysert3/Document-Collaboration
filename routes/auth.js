require('dotenv').config();
const express = require('express');
const User = require('../models/User');
const router = express.Router();
const jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');

router.use(bodyParser.json())

// Use the generated secret key
const JWT_SECRET = process.env.JWT_SECRET;

// Register a new user
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: 'User with this email already exists'
            });
        }

        const user = new User({ name, email, password });
        await user.save();

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

        // Send the token in a cookie
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' });

        res.status(200).json({
            redirect: '/dashboard',
            success: true,
            user: {
                name: user.name,
                email: user.email,
                userId: user._id
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

// Login a User
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                error: 'Invalid email or password'
            });
        }

        const isMatch = await user.isValidPassword(password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                error: 'Invalid email or password'
            });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

        // Send the token in a cookie
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' });

        res.status(200).json({ 
            redirect: '/dashboard',
            success: true,
            user: {
                name: user.name,
                email: user.email,
                userId: user._id
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

// Logout a User
router.get('/logout', (req, res) => {
    res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'strict' });
    res.redirect('/');
});

module.exports = router;
