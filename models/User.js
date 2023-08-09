const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name:{
        type:String,    
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
})
const User = mongoose.model('user',userSchema);
//user is referenced to the Notes.js schema 
User.createIndexes();
// userSchema.index({ email: 1 }, { unique: true });
module.exports = User;