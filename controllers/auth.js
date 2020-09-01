const User = require('../models/user');

const express = require('express');
const { validationResult } = require('express-validator/check');
const bcrypt = require('bcrypt');
const jsonWebToken = require('jsonwebtoken');
const { use } = require('../routes/auth');

const secretCreatorToken = 'Super*9)Secret159Creator!$Token';

exports.signup = (req, res, next) => {
  console.log('body:', req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
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
      res.status(201).json({ message: 'User created!', userId: result._id });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  const user = req.body.user;
  const password = req.body.password;
  let loadedUser;
  User.findOne({ $or: [{ 'email': user }, { 'name': user }] })
    .then(user => {
      if (!user) {
        const error = new Error('A user with this email/name could not be found.');
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then(isEqual => {
      if (!isEqual) {
        const error = new Error('Incorrect password.');
        error.statusCode = 401;
        throw error;
      }
      const token = jsonWebToken.sign({
        email: loadedUser.email,
        name: loadedUser.name,
        userId: loadedUser._id.toString()
      }, secretCreatorToken, { expiresIn: '1h' });
      res.status(200).json({ token: token, userId: loadedUser._id.toString() });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};