import mongoose from "mongoose";

const PasswordResetSchema = new mongoose.Schema({
    userId :{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required : true
    },
    identifier:{
        type:String,
        required:true,
        trim:true
    },
    deliveryMethod:{
    type:String,
    enum:["email", "mobile"],
    required:true
    },
    otpHash:{
        type:String,
        required:true
    },
    otpExpiresAt:{
        type:Date,
        required:true
    },
    otpAttempts:{
        type:Number,
        default:0
    },
    resetTokenHash:{
        type:String,
        default:null
    },
    resetTokenExpiresAt:{
        type:Date,
        default:null
    },
    verified:{
        type:Boolean,
        default:false
    }
},{timestamps:true});


const PasswordReset = mongoose.model("PasswordReset",PasswordResetSchema);
export default PasswordReset;
