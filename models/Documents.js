const mongoose = require('mongoose');

const schema = mongoose.Schema

const documentSchema = new schema({
    id: {
        type: Number,
        required: true,
        unique: true,
        default: Date.now()
    },
    title: {
        type: String,
    },
    content: {
        type: String,
    },
    author: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    collaborators: {
        type: [mongoose.Schema.Types.ObjectId], 
        ref: 'User' 
    }
}, { timestamps: true })

module.exports = mongoose.model('Document', documentSchema, 'documents');