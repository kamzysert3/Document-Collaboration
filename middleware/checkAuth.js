const Document = require('../models/Documents')

const checkAuthorization = async (req, res, next) => {
    try {
        const userId = req.body.userId; 
        const id = req.params.id; 

        const document = await Document.findOne({ id });

        if (!document) {
            return res.status(404).json({ message: 'Document not found.' });
        }

        // Only the author of the document can add collaborators
        if (!document.author.equals(userId)) {
            return res.status(403).json({ message: 'Only Author can add collaborators' });
        }        

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

module.exports = checkAuthorization;