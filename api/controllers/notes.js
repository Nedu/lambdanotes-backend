const Note = require('../models/Note');

// Retrieve all existing notes for a user
exports.findAll = (req, res) => {
    Note.find({ $or: [{ author: req.user._id }, { collaborators: req.user._id }] })
      .populate()
      .then(notes => {
        res.status(200).json(notes);
      })
      .catch(err => {
        res
          .status(500)
          .json({ message: 'Notes could not be retrieved at this time.' });
      });
};

// Retrieve an existing note for a user
exports.findOne = (req, res) => {
    const { id } = req.params;

    Note.findById(id)
        .then(note => {
            if (note) {
                res.status(200).json(note);
            }
            else {
                res.status(404).json({ message: 'The note with the specified ID does not exist.' });
            }
        })
        .catch(err => {
            res.status(500).json({ message: 'The note could not be retrieved at this time.' });
        })

};

// Create a new Note
exports.create = (req, res) => {
    const { title, content } = req.body;
    if(!title || !content){
        return res.status(400).json({message: 'You must provide a title and content for the note.'});
    }
    const note = new Note({ author: req.user._id, ...req.body });
    note.save().then(note => {
        res.status(201).json(note);
    })
    .catch(err => {
        res.status(500).json({ message: `There was an error creating the note. ${err}`})
    })
};


// Update an existing note
exports.update = (req, res) => {
    // const { id } = req.params;
    const query = {
        $or: [{ author: req.user._id }, { collaborators: req.user._id }],
        _id: req.params.id
    }
    const { title, content } = req.body;
    if (!title || !content) {
        res.status(400).json({ message: 'You must provide a title and content for the note.' });
    } else {
        Note.findOneAndUpdate(query, req.body, {
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
                res.status(500).json({ message: 'The note could not be modified.', err: err });
            });
    }
};

// Delete a note with the specified noteId in the request
exports.delete = (req, res) => {
    const { id } = req.params;
    Note.findByIdAndRemove(id)
        .then(() => {
            res.status(200).json(`Successfully deleted note ${id}`);
        })
        .catch(err => {
            if (err.name === 'CastError') {
                res.status(404).json({ message: 'The note with the specified ID does not exist.' })
            }
            res.status(500).json({ message: 'The note could not be removed ' });
        })
};