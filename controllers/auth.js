const User = require('../models/user');

const { validationResult } = require('express-validator/check');
const bcrypt = require('bcrypt');
const e = require('express');

exports.signup = (req, res, next) => {
  console.log('body:', req.body);
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  bcrypt
    .hash(password, 12)
    .then(hasedPassword => {
      const user = new User({
        email: email,
        name: name,
        password: hasedPassword
      });
      console.log('User:', user);
      return user.save();
    })
    .then(result => {
      res.status(201).json({message: 'User created!', userId: result._id});
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  console.log('Im here!!');
  next();
};