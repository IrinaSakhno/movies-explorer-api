const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/user');
const {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} = require('../middlewares/error');

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User not found');
      }
      return res.status(200).send(user);
    })
    .catch(next);
};

const updateProfile = (req, res, next) => {
  const { name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name },
    { new: true, runValidators: true },
  )
    .then((updatedData) => {
      res.status(200).send(updatedData);
    })
    .catch((err) => {
      if (err.message === 'Validation failed') {
        next(new ValidationError('User data is incorrect'));
        return;
      }
      next(err);
    });
};

const createUser = (req, res, next) => {
  bcrypt.hash(String(req.body.password), 10)
    .then((hashedPassword) => {
      User.create({
        ...req.body, password: hashedPassword,
      })
        .then((user) => {
          res.status(201).send({ data: user });
        })
        .catch((err) => {
          if (err.message === 'Validation failed') {
            next(new ValidationError('User data is incorrect'));
            return;
          }
          if (err.code === 11000) {
            next(new ConflictError('User with this email already exists'));
            return;
          }
          next(err);
        });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .orFail(() => new UnauthorizedError('User not found'))
    .then((user) => {
      bcrypt.compare(String(password), user.password)
        .then((isValidUser) => {
          if (isValidUser) {
            const jwt = jsonwebtoken.sign({
              _id: user._id,
            }, process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'JWT');
            res.cookie('jwt', jwt, {
              maxAge: 3600000 * 24 * 7,
              httpOnly: true,
              sameSite: 'none',
              secure: true,
            });
            res.status(200).send({ data: user.toJSON(), jwt });
          } else {
            next(new ValidationError('Wrong user data'));
          }
        })
        .catch(next);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getCurrentUser,
  updateProfile,
  createUser,
  login,
};
