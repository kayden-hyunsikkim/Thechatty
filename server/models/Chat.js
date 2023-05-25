const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');


const chatSchema = new Schema({
  chat: {
    type: String,
    minlength: 1,
    maxlength: 280,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (timestamp) => dateFormat(timestamp),
  },
});

const Chat = model('Chat', chatSchema);

module.exports = Chat;
