import express from 'express';
import { getLogin, postLogin, postLogout, getSignup, postSignup, getReset, postReset, getNewPassword, postNewPassword } from '../controllers/auth.js'
import { check, body } from 'express-validator';
import User from '../models/user.js';


const router = express.Router();

router.get('/login', getLogin);
router.post('/login', [
    body('email', 'Please Enter A Valid Email')
        .isEmail()
        .normalizeEmail(),
    check('password','Not Valid Password')
    .isLength({min:3})
    .isAlphanumeric()
    .trim()
], 
postLogin);

router.get('/signup', getSignup);
router.post('/signup', [
    check('email')
        .isEmail()
        .withMessage('Please Enter a Valide Email')
        .normalizeEmail()
        .custom((value, { req }) => {
            return User.findOne({ email: value })
                .then(userDoc => {
                    if (userDoc) {
                        return Promise.reject('Email already Exists. Use a different Email');
                    }
                });

        }),
    check('password', 'Please Enter only numbers/letter with min. 3 characters')
        .isLength({ min: 3 })
        .isAlphanumeric()
        .trim(),
    check('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords Do Not Match')
        }
        return true;
    }),
], postSignup);


router.post('/logout', postLogout);

router.get('/reset', getReset);

router.post('/reset', postReset);

router.get('/reset/:token', getNewPassword);

router.post('/newPassword', postNewPassword);

export default router;