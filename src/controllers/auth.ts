import User from '../models/user';

import { validationResult } from 'express-validator/check';
import bcrypt from 'bcrypt';
import jsonWebToken from 'jsonwebtoken';

const secretCreatorToken = 'Super*9)Secret159Creator!$Token';

const auth: any = {};

type RequestBody = { email: string, name:string, password: string};
type RequestSignup = { body: RequestBody};

auth.signup = (req: RequestSignup, res: any, next: Function) => {
  const errors = validationResult(req);
  const body = req.body as RequestBody;
  if (!errors.isEmpty()) {
    const error: any = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const email = body.email;
  const name = body.name;
  const password = body.password;
  bcrypt
    .hash(password, 12)
    .then((hasedPassword: string) => {
      const user = new User({
        email: email,
        name: name,
        password: hasedPassword
      });
      return user.save();
    })
    .then((result: {_id: string}) => {
      res.status(201).json({ message: 'User created!', userId: result._id });
    })
    .catch((err: { statusCode: number }) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

type RequestLogin = { body: {user: string, password: string}};
type LoadedUser = { email: string, name: string, password: string, _id: string };

auth.login = (req: RequestLogin, res: any, next: Function) => {
  const user: string = req.body.user;
  const password: string = req.body.password;
  let loadedUser: LoadedUser;
  User.findOne({ $or: [{ 'email': user }, { 'name': user }] })
    .then((user: LoadedUser) => {
      if (!user) {
        const error: any = new Error('A user with this email/name could not be found.');
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual: boolean) => {
      if (!isEqual) {
        const error: any = new Error('Incorrect password.');
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
    .catch((err: {statusCode: number}) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

export default auth;