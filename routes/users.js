const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCurrentUser, updateProfile,
} = require('../controllers/users');

router.get('/me', getCurrentUser);

router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      name: Joi.string().required(),
    }),
  }),
  updateProfile,
);

module.exports = router;
