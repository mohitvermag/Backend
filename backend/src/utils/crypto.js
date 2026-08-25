import crypto from "crypto";

 const approvalToken =()=>{ return crypto.randomBytes(32).toString("hex"); };

 const approvalTokenHash = (token)=>{ return crypto.createHash("sha256").update(token).digest("hex"); };

 export {approvalToken, approvalTokenHash};