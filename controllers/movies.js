const Movie = require('../models/movie');
const {
  ValidationError,
  NotFoundError,
  ForbiddenError,
} = require('../middlewares/error');

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.status(200).send(movies))
    .catch((err) => next(err));
};

const createMovie = (req, res, next) => {
  const owner = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => res.status(201).send({ movie }))
    .catch((err) => {
      if (err.message === 'Validation failed') {
        next(new ValidationError('Movie data is incorrect'));
        return;
      }
      next(err);
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findOne({ movieId: req.params.movieId })
    .orFail(() => {
      throw new NotFoundError('movie not found');
    })
    .then((movie) => {
      console.log(JSON.stringify(movie));
      const movieOwner = movie.owner.toString();
      const userId = req.user._id;
      if (movieOwner !== userId) {
        throw new ForbiddenError('You can only delete your own movies');
      }
      Movie.findOneAndRemove({ movieId: req.params.movieId })
        .orFail(() => {
          throw new NotFoundError('movie not found');
        })
        .then(() => {
          res.send({ message: 'movie successfully deleted' });
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
