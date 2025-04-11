import mongoose from "mongoose";

const userShcema= new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    
    lastLogin:{
        type:Date,
        default:Date.now
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    resetPasswordToken:String,
    resetPasswordExpiresAt:Date,
    verificationToken: String,  // corrected typo here
    verificationTokenExpiresAt: Date, 
    
},{timestamps:true})

export const Usermodel=mongoose.model('email',userShcema)