import mongoose from "mongoose";

const userSchema =  new mongoose.Schema({
    username : {
        type: String,
        required : true,
        unique : true,
        trim : true,
    },
    email: {
        type : String,
        required : true,
        unique : true,
        trim : true,
    },
    mobile : {
        type : String,
        required : true,
        unique : true,
        trim : true,
    },
    passwordHash : {
        type : String,
        required : true,
    },
    role : {
        type : String,
        enum : ["user","admin"],
        default : "user"
    },
    refreshToken : {
        type:String,
        default:null
    },
    isEmailVerified : {
        type : Boolean,
        default : false 
},
isMobileVerified : {
    type : Boolean,
    default : false 
}   
},{timestamps : true});

const User = mongoose.model("User", userSchema);
export default User;