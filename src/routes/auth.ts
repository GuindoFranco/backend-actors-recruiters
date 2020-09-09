import { Router } from 'express';
import { body } from 'express-validator/check';

import User from '../models/user';

import { signup, login } from '../controllers/auth';

const router = Router();

const regularExpressionPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/; //To check a password between 8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character

router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc: any) => {
          if (userDoc) {
            return Promise.reject("E-mail address already exists!");
          }
        });
      })
      .normalizeEmail(),
    body("password")
      .trim()
      .isLength({ min: 7 })
      .matches(regularExpressionPassword)
      .withMessage(
        "Password should be between 8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character."
      ),
    body("name").trim().not().isEmpty().custom((value, { req }) => {
      return User.findOne({ name: value }).then((userDoc: any) => {
        if (userDoc) {
          return Promise.reject("Current name already exists!");
        }
      });
    }),
  ],
  signup
);

router.post('/login', login);

export default router;