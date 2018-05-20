const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next) {
  const bearerToken = req.headers['authorization'];
  
  
  next();
}