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
  }
  // notes: [
  //   {
  //     type: ObjectId,
  //     ref: 'Note'
  //   }
  // ]
}, { timestamps: true });

User.pre('save', async function(next) {
  this.password = await bcrypt.hash(this.password, 12);

  next();
});

User.methods.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.password).catch(err => {
    console.log(err.message);
  });
};

module.exports = mongoose.model('User', User);
