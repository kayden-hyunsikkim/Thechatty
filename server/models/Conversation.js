const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');


const conversationSchema = new Schema({
  chat: {
    type: String,
    minlength: 1,
    maxlength: 1000,
    trim: true,
  },
  answer: {
    type: String,
    minlength: 1,
    maxlength: 1000,
    trim: true,
  },
  user:{
    type:Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (timestamp) => dateFormat(timestamp),
  },
});

const Conversation = model('Conversation', conversationSchema);

module.exports = Conversation;