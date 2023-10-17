const router = require('express').Router();
const userRoutes = require('./users');
const movieRoutes = require('./movies');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { signUpValidator, signInValidator } = require('../middlewares/validators');
const { NotFoundError } = require('../middlewares/error');

router.post(
  '/signup',
  signUpValidator,
  createUser,
);

router.post(
  '/signin',
  signInValidator,
  login,
);

router.use('/users', auth, userRoutes);
router.use('/movies', auth, movieRoutes);

router.use((req, res, next) => {
  next(new NotFoundError('This page does not exist'));
});

module.exports = router;
