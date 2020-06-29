const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); // This plugin is used to verify that emails are unique

const userSchema = mongoose.Schema({ // User schema that is used in MongoDB
  email: { type: String, required: true, unique: true }, // The unique: true refers to the fact that the email used is unique
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);  // Here is the unique validation part, if it fails the user will not be created

module.exports = mongoose.model('User', userSchema);  // We then export our model so it can be used in our user controllers
