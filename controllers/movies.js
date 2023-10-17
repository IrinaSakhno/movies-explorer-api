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
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('movie not found');
      } else if (!(req.user._id === movie.owner.toString())) {
        throw new ForbiddenError('You can only delete your own movies');
      }
      return Movie.deleteOne({ _id: movie._id }).then(() => {
        res.send(movie);
      });
    })
    .catch(next);
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
