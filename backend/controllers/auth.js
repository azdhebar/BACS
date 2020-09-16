const User = require('../models/User')
var unirest = require("unirest");
var otpGenerator = require('otp-generator')
const JWT = require('jsonwebtoken')
const {validationResult,errorFormatter} = require('express-validator')
exports.signup=(req,res)=>{
  
    const result = validationResult(req);
    const hasErrors = !result.isEmpty();
    if(hasErrors){
        return res.status(400).json({error:validationResult(req).array()[0].msg})

    }
    else{
        const  data = req.body;
        const user = new User(data);
        user.save((err,usr)=>{
            if(err){
                return res.status(400).json({
                    error:"Already registered with username or mobile number!!"
                })
            }
            const otpgen = otpGenerator.generate(6, { upperCase: false, specialChars: false ,alphabets:false});
            var req = unirest("GET", "https://www.fast2sms.com/dev/bulk");
            usr.otp = otpgen;
            usr.save()
            req.query({
            "authorization": "GBlUbOAznJ6yumxIrXa1w7SLpo20Cc5Q4qYDjWPdsNhgikveRVvMU4TDz1dspgheECjAxP9JmbwLBG6i",
            "sender_id": "SERVICER",
            "message": `Welcome to servicer here is yout OTP ${usr.otp}`,
            "language": "english",
            "route": "p",
            "numbers": usr.mobile,
            });

            req.headers({
            "cache-control": "no-cache"
            });


            req.end(function (res) {
            if (res.error) throw new Error(res.error);

            console.log(res.body);
            
            
            });
            return res.status(200).json({
                user:usr
            })
        })
    }

}
exports.signin=(req,res)=>{
    const result = validationResult(req);
    const hasErrors = !result.isEmpty();
    if(hasErrors){
        return res.status(400).json({error:validationResult(req).array()[0].msg})

    }
    else
    {
        const {username,password} = req.body;
        User.findOne({username:username},(err,usr)=>{
            if(err || !usr){
                return res.status(400).json({error:"User is not registered"})
            }
            else{
            if(usr.authenticated(password)){
                     if(usr.isVerified){
                            const jwt = JWT.sign({id:usr._id},process.env.secret)
                            const {_id,username,mobile,email} = usr
                            const data = {
                                _id,username,mobile,email,jwt
                            }
                                    
                            req.auth=data
                            res.cookie(auth,req.auth,{maxAge:60*60*24*365*10})
                            return res.status(200).json(req.auth)
                     }
                     else{
                         return res.status(400).json({error:"You Are Not Verified!"})
                     }   
            }
            else{
                return res.status(400).json({error:"You Are Not Registered"})
            }
        }
        })
    
    }
    
}
exports.signout=(req,res)=>{
    res.clearCookie('auth')
    return res.status(200).json({message:"successfully loggedout"})
}
exports.verify=(req,res)=>{
    const result = validationResult(req);
    const hasErrors = !result.isEmpty();
    if(hasErrors){
        return res.status(400).json({error:validationResult(req).array()[0].msg})

    }
    else{
        const {_id,otp} = req.body;
        User.findOne({_id:_id},(err,usr)=>{
            if(err || !usr){
                return res.status(400).json({error:"User is not registered yet"})
            }
            else{
                if(usr.otp === parseInt(otp)){
                    usr.isVerified = true
                    usr.save();
                    return res.status(200).json({user:usr})

                }
                else{
                    return res.status(400).json({error:"Wrong OTP"})
                }
            }
        })
    }
}
