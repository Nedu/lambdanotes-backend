const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const bcrypt = require('bcrypt');

const User = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 12,
  },
  notes: [
    {
      type: ObjectId,
      ref: 'Note'
    }
  ]
}, { timestamps: true });

User.pre('save', function(next) {
  bcrypt.hash(this.password, 12)
  .then(hash => {
    this.password = hash;
    next();
  })
  .catch(err => { next(err) });
});

User.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', User);
