const mongoose = require('mongoose');
const User = require('./user');

const urlSyntax = /https?:\/\/(www)?[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+#?$/i;

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
      validate: urlSyntax,
    },
    trailerLink: {
      type: String,
      required: true,
      validate: urlSyntax,
    },
    thumbnail: {
      type: String,
      required: true,
      validate: urlSyntax,
    },
    owner: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },
    // movieId — id фильма, который содержится в ответе сервиса MoviesExplorer.
    // Обязательное поле в формате number
    movieId: {
      type: Number,
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

movieSchema.methods.toJSON = () => {
  const movie = this.toObject();
  delete movie.password;

  return movie;
};

module.exports = mongoose.model('movie', movieSchema);
