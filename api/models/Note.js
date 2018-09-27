const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const Note = new mongoose.Schema({
    author: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true,
    },
    tags: [String],
    collaborators: [{
        type: ObjectId,
        ref: 'User'
    }]
}, { timestamps: true });

module.exports = mongoose.model('Note', Note);