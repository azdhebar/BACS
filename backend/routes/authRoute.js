const {check}  = require('express-validator')
const express = require('express')
const route = express.Router();
const {signup,signin,verify,signout} = require('../controllers/auth')

route.post('/signup',
[
check('username').isLength({min:5,max:10}).withMessage('Username must be in 5 characters '),

check('password').isLength({min:8}).withMessage('Password must be in 8 charcatert '),

check('mobile').isNumeric().withMessage('mobile number is not valid')
               .isLength({min:10}).withMessage('Mobile number must be minimum of 10 digits'),

check('city').isLength({max:30}).withMessage('city must be under 30 characters'),

check('zip').isLength({max:6}).withMessage('Zip code must be in 6 digits')
],signup)


route.post('/signin',
[
check('username').isLength({min:5,max:10}).withMessage('Username must be in 5 characters '),

check('password').isLength({min:8}).withMessage('Password must be in 8 charcatert '),

],signin)


route.post('/verify',
[
check('_id').isLength({min:1}).withMessage('data not found '),

check('otp').isLength({max:6}).withMessage('OTP must be in 6 digit '),

],verify)

route.get('/signout',signout)


module.exports = route

