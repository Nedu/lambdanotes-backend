const User = require('../models/User');
const { makeToken } = require('../config/auth');

// Retrieve all existing users
exports.findAll = (req, res) => {
    User.find().populate('notes').select('-password -__v')
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

// Retrieve an existing user
exports.findOne = (req, res) => {

};

// Register
exports.register = (req, res) => {
    const { username, password } = req.body;
    User.findOne({ username }).then(existingUser => {
        if(existingUser) {
            return res.status(409).json({ message: 'problem signing up'});
        } else {
            const user = new User({ username, password });
            user.save().then(user => {
                const token = makeToken(user);
                res.status(201).json({ token });
            })
            .catch(err => {
                res.status(500).json(err);
            })
        }
    })
};

// Login
exports.login = (req, res) => {
    if(!req.user) {
        return res.status(422);
    }
    res.status(200).json({ token: makeToken(req.user), user: req.user })
}

// // Logout
// exports.logout = (req, res) => {
//     if (req.session) {
//         req.session.destroy(err => {
//             if (err) res.status(500).json({ error: 'error logging out' });
//             else res.status(200).send('Logged out');
//         });
//     } else {
//         res.send('User not logged in');
//     }
// }

// Update an exisiting user
exports.update = (req, res) => {

};

// Delete an existing user
exports.delete = (req, res) => {

};