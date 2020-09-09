"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const check_1 = require("express-validator/check");
const user_1 = __importDefault(require("../models/user"));
const auth_1 = require("../controllers/auth");
const router = express_1.Router();
const regularExpressionPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/; //To check a password between 8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character
router.put("/signup", [
    check_1.body("email")
        .isEmail()
        .withMessage("Please enter a valid email.")
        .custom((value, { req }) => {
        return user_1.default.findOne({ email: value }).then((userDoc) => {
            if (userDoc) {
                return Promise.reject("E-mail address already exists!");
            }
        });
    })
        .normalizeEmail(),
    check_1.body("password")
        .trim()
        .isLength({ min: 7 })
        .matches(regularExpressionPassword)
        .withMessage("Password should be between 8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character."),
    check_1.body("name").trim().not().isEmpty().custom((value, { req }) => {
        return user_1.default.findOne({ name: value }).then((userDoc) => {
            if (userDoc) {
                return Promise.reject("Current name already exists!");
            }
        });
    }),
], auth_1.signup);
router.post('/login', auth_1.login);
exports.default = router;
