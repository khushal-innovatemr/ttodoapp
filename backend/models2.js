const mongoose =  require('mongoose');

const UserSchema = new mongoose.Schema({
   
    email:{type:String,required:true},
    password:{type:String, required:true},
    id:{type:String,required:true},
    role:{type:String,enum:["admin","manager","user"],default:"user"},
} )
const User = mongoose.model('Users',UserSchema)
module.exports = User;