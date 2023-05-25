const { Schema, model } = require('mongoose');


const typeSchema = new Schema({
  type: {
    type: String,
    required: "You need to choose a type you want!",
    minlength: 1,
    maxlength: 280,
    trim: true,
  },
});

const Type = model('Type', typeSchema);

module.exports = Type;
