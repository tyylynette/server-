const mongoose = require('mongoose');
const { Schema } = mongoose; //destructuring, schema = mongoose.schema
const RecipientSchema = require('./Recipient');

const surveySchema = new Schema({
  title: String,
  body: String,
  subject: String,
  recipients: [RecipientSchema],
  yes: { type: Number, default: 0 },
  no: { type: Number, default: 0 },
  _user: { type: Schema.Types.ObjectId, ref: 'User' }, //relation to user schema
  dateSent: Date,
  lastResponded: Date
});

mongoose.model('surveys', surveySchema);
