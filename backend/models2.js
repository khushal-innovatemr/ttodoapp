const mongoose =  require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String, required:true},
    id:{type:String,required:true},
    role:{type:String,enum:["admin","manager","user"],default:"user"},
    otp:{type:Number,expires:'10m',index:true},
    createdby:{type:String,enum:["admin","self"],default:"self"}
} )
const User = mongoose.model('Users',UserSchema)
module.exports = User;