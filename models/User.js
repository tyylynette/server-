const mongoose = require('mongoose');
const { Schema } = mongoose; //destructuring, schema = mongoose.schema

const userSchema = new Schema({
  //properties of collection
  googleId: String
});

mongoose.model('users', userSchema); // load schema (collection) into mongoose
