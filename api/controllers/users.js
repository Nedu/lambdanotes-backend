const User = require('../models/User');
const { makeToken } = require('../config/auth');

// Retrieve all existing users
exports.findAll = (req, res) => {
    User.find()
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
    const newUser = { username, password };
    const user = new User(newUser);
    user.save().then(user => {
        const token = makeToken(user);
        res.status(201).json({ user, token });
    })
        .catch(err => {
            res.status(500).json(err);
        })    
};

// Login
exports.login = (req, res) => {
    res.status(200).json({ token: makeToken(req.user), user: req.user })
}


// Update an exisiting user
exports.update = (req, res) => {

};

// Delete an existing user
exports.delete = (req, res) => {

};