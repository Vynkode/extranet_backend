const jwt = require('jsonwebtoken');

const handleAuth = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token) {
    const validToken = jwt.verify(token, 'secretmgvsecret');
    req.body.id = validToken.id;
    next();
  }
  return res.send('no hay token');
};

module.exports = { auth: handleAuth };
