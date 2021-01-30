const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 3,
      maxlength: 140,
      required: true
    },
    type: {
      type: String,
      enum: ['coffee_shop', 'bookstore']
    }
  },
  { timestamps: true }
);

const Place = mongoose.model('Place', userSchema);

module.exports = Place;
