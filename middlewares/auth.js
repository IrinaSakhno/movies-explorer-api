const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('./error');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError('You are not logged in'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'JWT');
  } catch (err) {
    next(new UnauthorizedError('You are not logged in'));
  }

  req.user = payload;
  next();
};

module.exports = auth;
