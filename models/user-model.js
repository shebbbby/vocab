const mongoose = require('mongoose');


const Schema = mongoose.Schema;


const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true
    },

    // for users who did normal login with email and password
    encryptedPassword: { type: String },

  });

const UserModel = mongoose.model('User', userSchema);


module.exports = UserModel;
