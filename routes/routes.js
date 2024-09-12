const express = require('express');
const path = require('path');
const router = express.Router();
var bodyParser = require('body-parser');
const document = require('../models/Documents');
const authenticate = require('../middleware/authenticate');

router.use(bodyParser.json())

router.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, '../public/pages', 'index.html'));
});
router.get('/register', async (req, res) => {
    res.sendFile(path.join(__dirname, '../publi/pages', 'register.html'));
});
router.get('/dashboard', authenticate, async (req, res) => {
    res.sendFile(path.join(__dirname, '../public/pages', 'dashboard.html'));
});
router.post('/document', authenticate, async (req, res) => {
    const { userId } = req.body
    const ID = Date.now();
    try {
        const newDocument = new document({
            id: ID,
            title: 'Untitled Document',
            content: '',
            author: userId,
            collaborators: [
                userId
            ]
        })
        newDocument.save()
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error' });
    }
    res.json({
        success: true,
        redirect: `/document/${ID}`
    })
});
router.get('/document/:id', authenticate, async (req, res) => {
    res.sendFile(path.join(__dirname, '../public/pages', 'document.html'));
});
router.get('/mydocuments', authenticate, async (req, res) => {
    res.sendFile(path.join(__dirname, '../public/pages', 'mydocuments.html'));
});
router.get('/teams', authenticate, async (req, res) => {
    res.sendFile(path.join(__dirname, '../public/pages', 'teams.html'));
});
router.get('/tasks', authenticate, async (req, res) => {
    res.sendFile(path.join(__dirname, '../public/pages', 'tasks.html'));
});

module.exports = router