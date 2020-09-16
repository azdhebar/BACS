const mongoose = require('mongoose');
const crypto = require('crypto')
const {v4:uuidv4} = require('uuid')
const userSchema  = new mongoose.Schema({
username:{
    type:String,
    required:true,
    maxlength:10,
    unique:true
},
enc_password:{
    type:String,
    required:true,
    minlength:8,
},
salt:String,
mobile:{
    type:Number,
    maxlength:12,
    required:true,
    unique:true
},
email:{
type:String,
required:true,
},
city:{
    type:String,
    maxlength:30,
    required:true,
},
zip:{
    type:Number,
    maxlength:6,
    required:true
},
otp:{
    type:Number,
    maxlength:6,

},
isAdmin:{
    type:Boolean,
    default:false
},
isServicer:{
    type:Boolean,
    default:false,
},
isVerified:{
    type:Boolean,
    default:false
}


},{timestamps:true})


userSchema.methods={
    securePassword:function(password){
        if(!password || password==""){
            return ""
        }
        return crypto
        .createHmac('sha256',this.salt)
        .update(password)
        .digest('hex')
    },
    authenticated:function(password){
        return this.securePassword(password) === this.enc_password
    }

}
userSchema.virtual('password')
.set(function(password){
    this.salt = uuidv4();
    this._password = password;
    this.enc_password=this.securePassword(this._password)
    
})
.get(function(){
    return this._password
})

module.exports = mongoose.model("User",userSchema);