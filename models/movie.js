const mongoose = require('mongoose');

function isMyFieldRequired(v) {
  return typeof v === 'string';
}

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: isMyFieldRequired,
  },
  director: {
    type: String,
    required: isMyFieldRequired,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: isMyFieldRequired,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /^(https?:\/\/)([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?#?$/.test(v);
      },
      message: 'Неверная ссылка!',
    },
  },
  trailer: {
    type: String,
    required: isMyFieldRequired,
    /* validate: {
      validator(v) {
        return /^(https?:\/\/)([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?#?$/.test(v);
      },
      message: 'Неверная ссылка!',
    }, */
  },
  /* thumbnail: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /^(https?:\/\/)([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?#?$/.test(v);
      },
      message: 'Неверная ссылка!',
    },
  }, */
  movieId: {
    type: Number,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  nameRU: {
    type: String,
    required: isMyFieldRequired,
  },
  nameEN: {
    type: String,
    required: isMyFieldRequired,
  },
});

module.exports = mongoose.model('movie', movieSchema);
