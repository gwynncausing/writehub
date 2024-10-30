// middleware/auth.js
const jwt = require('jsonwebtoken');
const db = require('../db');
const bcrypt = require('bcryptjs');

const authenticateToken = (req, res, next) => {
  let token = req.headers['authorization'];
  if (!token) return res.sendStatus(401);
  
  token = token.replaceAll('Bearer ', '')
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const authorizeRole = (role) => (req, res, next) => {
  console.log("🚀 ~ authorizeRole ~ req.user.type:", req.user.type)
  if (req.user.type !== role) {
    return res.sendStatus(403);
  }
  next();
};

module.exports = { authenticateToken, authorizeRole };
