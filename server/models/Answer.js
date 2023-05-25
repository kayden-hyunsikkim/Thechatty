const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');


const answerSchema = new Schema({
  answer: {
    type: String,
    minlength: 1,
    maxlength: 1000,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (timestamp) => dateFormat(timestamp),
  },
});

const Answer = model('Answer', answerSchema);

module.exports = Answer;