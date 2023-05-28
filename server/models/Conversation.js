const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');


const conversationSchema = new Schema({
  conversation: {
    type: String,
    minlength: 1,
    maxlength: 10000,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (timestamp) => dateFormat(timestamp),
  },
});

const Conversation = model('Conversation', conversationSchema);

module.exports = Conversation;