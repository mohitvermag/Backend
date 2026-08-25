import mongoose from "mongoose";

const adminRegistrationRequestSchema = new mongoose.Schema({
    username : {
        type:String,
        required :true,
        trim :true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        lowercase :true
    },
    mobile:{
        type:String,
        required:true,
        trim:true
    },
    passwordHash:{
        type:String,
        required:true
    },
    approvalTokenHash:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:["pending","approved","rejected","expired"],
        default:"pending"
    },
    expiresAt:{
        type:Date,
        required:true
    }
},{timestamps:true});

const AdminRegistrationRequest = mongoose.model("AdminRegistrationRequest", adminRegistrationRequestSchema);
export default AdminRegistrationRequest;