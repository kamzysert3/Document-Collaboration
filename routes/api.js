const express = require('express');
const router = express.Router();
const document = require('../models/Documents');
const user = require('../models/User');
var bodyParser = require('body-parser');

router.use(bodyParser.json())

const docAccess = require('../middleware/docAccess');
const checkAuth = require('../middleware/checkAuth');


router.post('/document/:id', docAccess, async (req, res) => {
    const id = req.params.id;
    const openedDocument = await document.findOne({ id });
    if (!openedDocument) return res.status(404).json({ message: 'Document not found' });

    res.json({
        document: openedDocument
    });
});

router.post('/document/delete/:id', checkAuth, async (req, res) => {
    const id = req.params.id;

    const openedDocument = await document.findOneAndDelete({ id });
    if (!openedDocument) return res.status(404).json({ message: 'Document not found' });

    res.json({
        success: true,
        message: 'Document deleted successfully.'
    });
});

router.post('/get-recent-document', async (req, res) => {
    const { email } = req.body;
    const USER = await user.find({ email });
    const USER_ID = USER[0]._id;

    const userDocuments = await document.find({ author: USER_ID })
    .sort({ updatedAt: -1 })
    .limit(3);

    res.json({
        documents: userDocuments
    });
});

router.post('/get-document', async (req, res) => {
    const { email } = req.body;
    const USER = await user.find({ email });
    const USER_ID = USER[0]._id;    

    const userDocuments = await document.find({ author: USER_ID }).populate('collaborators');   

    res.json({
        documents: userDocuments
    });
});

router.post('/get-shared-document', async (req, res) => {
    const { email } = req.body;
    const USER = await user.find({ email });
    const USER_ID = USER[0]._id;    

    // get documents where user is a collaborator
    const userDocuments = await document.find({ 
        collaborators: { $in: [USER_ID] }, 
        author: { $ne: USER_ID } 
    }).populate('collaborators');

    res.json({
        documents: userDocuments
    });
});

router.post('/share-document/:id', checkAuth, async (req, res) => {
    try {
        const id = req.params.id;
        const { collaborator } = req.body; 

        // Ensure the user to be added exists
        const Collaborator = await user.findOne({ email: collaborator });
        
        if (!Collaborator) {
            return res.status(404).json({ message: 'User not found.' });
        }        

        // Add user to the collaborators list
        const Document = await document.findOneAndUpdate(
            { id },
            { $addToSet: { collaborators: Collaborator._id } }, 
            { new: true, runValidators: true }
        ).populate('collaborators');

        if (!Document) {
            return res.status(404).json({ message: 'Document not found.' });
        }

        res.json({ shareLink: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});

module.exports = router;