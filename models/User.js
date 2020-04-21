const mongoose = require('mongoose');
const { Schema } = mongoose; //destructuring, schema = mongoose.schema

const userSchema = new Schema({
  //properties of collection
  googleId: String,
  credits: { type: Number, default: 0 } //default value of 0
});

mongoose.model('users', userSchema); // load schema (collection) into mongoose
