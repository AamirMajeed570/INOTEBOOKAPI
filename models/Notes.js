const mongoose = require('mongoose');
const { Schema } = mongoose;
const notesSchema = new Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref:'user'
    },
    // name:{
    //     type:mongoose.Types.String,
    //     ref:'user'
    // },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    tag:{
        type:String,
        default:"general"
    },
    date:{
        type:Date,
        default:Date.now
    }
})
const Notes = mongoose.model('notes',notesSchema);
// User.createIndexes();
// userSchema.index({ email: 1 }, { unique: true });
module.exports = Notes;
