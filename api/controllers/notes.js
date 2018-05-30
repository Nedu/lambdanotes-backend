const Note = require('../models/Note');

// Retrieve all existing notes
exports.findAll = (req, res) => {
    Note.find()
        .then(notes => {
            res.status(200).json(notes);
        })
        .catch(err => {
            res.status(500).json({ message: 'Notes could not be retrieved at this time.' });
        })
};

// Retrieve an existing note
exports.findOne = (req, res) => {
    const { id } = req.params;

    Note.findById(id)
        .then(note => {
            if (note === null) {
                res.status(404).json({ message: 'The note with the specified ID does not exist.' });
            }
            else {
                res.status(200).json(note);
            }
        })
        .catch(err => {
            res.status(500).json({ message: 'The note could not be retrieved at this time.' });
        })

};

// Create a new Note
exports.create = (req, res) => {
    const { title, content } = req.body;
    const newNote = { title, content };
    if(!title || !content){
        return res.status(400).json({message: 'You must provide a title and content for the note.'});
    }
    const note = new Note(req.body); // needs refactoring
    note.save().then(note => {
        res.status(201).json(note);
    })
    .catch(err => {
        res.status(500).json({ message: `There was an error creating the note. ${err}`})
    })
};


// Update an existing note
exports.update = (req, res) => {
    const { id } = req.params;
    const { title, content, tags } = req.body;
    const updatedNote = { title, content, tags };
    if (!title || !content) {
        res.status(400).json({ message: 'You must provide a title and content for the note.' });
    } else {
        Note.findByIdAndUpdate(id, updatedNote, {
            runValidators: true,
            new: true,
        })
            .then(note => {
                res.status(200).json(note);
            })
            .catch(err => {
                if (err.name === 'CastError') {
                    res.status(404).json({ message: 'The note with the specified ID does not exist.' });
                }
                res.status(500).json({ message: 'The note could not be modified.' });
            });
    }
};

// Delete a note with the specified noteId in the request
exports.delete = (req, res) => {
    const { id } = req.params;
    Note.findByIdAndRemove(id)
        .then(deletedNote => {
            res.status(200).json(deletedNote);
        })
        .catch(err => {
            if (err.name === 'CastError') {
                res.status(404).json({ message: 'The note with the specified ID does not exist.' })
            }
            res.status(500).json({ message: 'The note could not be removed ' });
        })
};