const User = require('../models/user');

exports.login = (req, res, next) => {
  console.log('Im here');
  const email = req.body.email;
  const password = req.body.password;
};