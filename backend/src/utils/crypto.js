import crypto from "crypto";

 const approvalToken =()=>{ return crypto.randomBytes(32).toString("hex"); };

 const approvalTokenHash = (token)=>{ return crypto.createHash("sha256").update(token).digest("hex"); };

 const generateOTP = ()=>{return crypto.randomInt(100000, 1000000).toString()};

 const hashOTP = (otp)=>{ return crypto.createHash("sha256").update("otp").digest("hex");}

 const generateResetToken = ()=>{return crypto.randomBytes(32).toString("hex")};

 const hashResetToken = (token)=>{return crypto.createHash("sha256").update("token").digest("hex")}

 export {approvalToken, approvalTokenHash, generateOTP, hashOTP, generateResetToken, hashResetToken};