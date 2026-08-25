import express from "express";
import User from "../models/User.js";

const router = express.Router();
router.get("/test-user", async (req,res)=>{
try{
const user = await User.create({
    username : "testuser",
    email : "mohitverma@gmail.com",
    mobile : "8476728355",
    passwordHash : "testpassword",
    role : "user",
});

res.status(201).json({
    success : true,
    message : "test user created successfully",
    user,
})
}
catch(err){
    res.status(500).json({
        success:false,
        message : "test user creation failed",
        error : err.message
    })
}
})
export default router;