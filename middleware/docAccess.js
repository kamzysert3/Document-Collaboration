const Document = require('../models/Documents')

const checkCollaboratorAccess = async (req, res, next) => {
    try {
        const { userId } = req.body;
        const id = req.params.id; 
        
        // Find the document by ID and populate the collaborators field
        const document = await Document.findOne({ id });

        // If the document does not exist, return a 404 error
        if (!document) return res.status(404).json({ message: 'Document not found.' });

        // Check if the user is in the collaborators list
        const isCollaborator = document.collaborators.some(collaborator => collaborator._id.equals(userId));

        if (!isCollaborator) {
            return res.status(403).json({ message: 'You don\'t have access to this Document.' });
        }

        // User is a collaborator, proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

module.exports = checkCollaboratorAccess;