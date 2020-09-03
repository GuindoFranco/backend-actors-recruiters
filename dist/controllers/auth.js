"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../models/user"));
const check_1 = require("express-validator/check");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secretCreatorToken = 'Super*9)Secret159Creator!$Token';
const auth = {};
auth.signup = (req, res, next) => {
    const errors = check_1.validationResult(req);
    const body = req.body;
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const email = body.email;
    const name = body.name;
    const password = body.password;
    bcrypt_1.default
        .hash(password, 12)
        .then((hasedPassword) => {
        const user = new user_1.default({
            email: email,
            name: name,
            password: hasedPassword
        });
        return user.save();
    })
        .then((result) => {
        res.status(201).json({ message: 'User created!', userId: result._id });
    })
        .catch((err) => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};
auth.login = (req, res, next) => {
    const user = req.body.user;
    const password = req.body.password;
    let loadedUser;
    user_1.default.findOne({ $or: [{ 'email': user }, { 'name': user }] })
        .then((user) => {
        if (!user) {
            const error = new Error('A user with this email/name could not be found.');
            error.statusCode = 401;
            throw error;
        }
        loadedUser = user;
        return bcrypt_1.default.compare(password, user.password);
    })
        .then((isEqual) => {
        if (!isEqual) {
            const error = new Error('Incorrect password.');
            error.statusCode = 401;
            throw error;
        }
        const token = jsonwebtoken_1.default.sign({
            email: loadedUser.email,
            name: loadedUser.name,
            userId: loadedUser._id.toString()
        }, secretCreatorToken, { expiresIn: '1h' });
        res.status(200).json({ token: token, userId: loadedUser._id.toString() });
    })
        .catch((err) => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};
exports.default = auth;
