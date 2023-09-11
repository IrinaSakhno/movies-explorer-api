const mongoose = require('mongoose');
const User = require('./user');
const regexUrl = require('../utils/regexUrl');

const movieSchema = new mongoose.Schema(
  {
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
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
      validate: regexUrl,
    },
    trailerLink: {
      type: String,
      required: true,
      validate: regexUrl,
    },
    thumbnail: {
      type: String,
      required: true,
      validate: regexUrl,
    },
    owner: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },
    // movieId — id фильма, который содержится в ответе сервиса MoviesExplorer.
    movieId: {
      type: String,
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
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model('movie', movieSchema);
