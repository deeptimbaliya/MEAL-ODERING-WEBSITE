const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  MobileNo: { type: String, unique: true },
  address: { type: String}

});

module.exports = mongoose.model('UserModel', userSchema);
