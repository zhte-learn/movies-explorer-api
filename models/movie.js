const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
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
    required: true,
    validate: {
      validator(v) {
        return /^(https?:\/\/)([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?#?$/.test(v);
      },
      message: 'Неверная ссылка!',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /^(https?:\/\/)([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?#?$/.test(v);
      },
      message: 'Неверная ссылка!',
    },
  },
  movieId: {
    //_id фильма, который содержится в ответе сервиса MoviesExplorer. Обязательное поле.
    //type: mongoose.Schema.Types.ObjectId,
    type: Number,
    required: true,
    /* validate: {
      validator(v) {
        return ObjectId.isValid(v);
      },
      message: "Некорректный id",
    }, */
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
