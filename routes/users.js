const router = require('express').Router();
const { updateProfileDataValidator } = require('../middlewares/validators');

const {
  getCurrentUser, updateProfile,
} = require('../controllers/users');

router.get('/me', getCurrentUser);

router.patch(
  '/me',
  updateProfileDataValidator,
  updateProfile,
);

module.exports = router;
