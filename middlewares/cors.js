const allowedCors = [
  'https://movies-explorer.isakhno.nomoreparties.co',
  'http://movies-explorer.isakhno.nomoreparties.co',
  'http://localhost:3000',
  'http://localhost:3001',
];

const corsHandler = (req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];

  res.set('Access-Control-Allow-Origin', '*');

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    res.header('Access-Control-Allow-Credentials', true);
  }

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    res.header('Access-Control-Allow-Credentials', true);
    return res.end();
  }

  return next();
};

module.exports = { corsHandler };
