import bcrypt from "bcrypt";
import User from "../models/User.js";
import AdminRegistrationRequest from "../models/AdminRegistrationRequest.js";
import PasswordReset from "../models/PasswordReset.js";
import { approvalToken as generateApprovalToken, generateOTP, approvalTokenHash as  hashApprovalToken, hashOTP, generateResetToken, hashResetToken} from "../utils/crypto.js";
import {sendAdminApprovalEmail, sendPasswordResetOTP} from "../utils/mail.js";
import { sendPasswordResetSMS } from "../utils/sms.js";


const emitAdminRegistrationStatus = (req, request, status, message) => {
    const io = req.app.get("io");
    if(!io || !request?._id) return;

    io.to(`admin-request-${request._id.toString()}`).emit("admin-request-status", {
        requestId: request._id,
        status,
        message
    });
}

export const requestAdminRegistration = async(req,res)=>{
    try{
const {username, email, mobile, password, confirmPassword} = req.body;
if(!username || !email || !mobile || !password || !confirmPassword){
    return res.status(400).json({
        success:false,
        message:"All fields are required",
    })
}
    if(password !== confirmPassword){
        return res.status(400).json({
            success:false,
            message:"Password do not matched"
        })
    }
    const existingUser = await User.findOne({$or:[{username},{email},{mobile}]});
    if(existingUser){
        return res.status(400).json({
            success:false,
            message:"User already exists"
        })
    }

    const rawapprovalToken = generateApprovalToken();
    const approvalTokenHash = hashApprovalToken(rawapprovalToken);
    const passwordHash = await bcrypt.hash(password, 10);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const adminRequest = await AdminRegistrationRequest.create({
        username, email, mobile, passwordHash, approvalTokenHash, status:"pending", expiresAt
    })

    await sendAdminApprovalEmail({username, email, mobile, approvalToken:rawapprovalToken});
    return res.status(201).json({
        success:true,
        message:"Admin registration request submitted successfully. Please wait for approval.",
        requestId : adminRequest._id
    })

    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Internal server error",
            error:err.message
        })
    }
}

export const approveAdminRegistration = async(req,res)=>{
    try{
        const {token:approvalToken} = req.params;
        if(!approvalToken){
            return res.status(400).json({
                success:false,
                message:"Approval token is required"
            })
        }
        const approvalTokenHash = hashApprovalToken(approvalToken);
        const request = await AdminRegistrationRequest.findOne({approvalTokenHash, status:"pending"});
        if(!request){
            return res.status(400).json({
                success:false,
                message:"Invalid or expired approval token"
            })
        }
        if(request.expiresAt < new Date()){
            request.status="expired";
            await request.save();
            emitAdminRegistrationStatus(req, request, "expired", "Admin registration request has expired.");
            return res.status(400).json({
                success:false,
                message:"Approval token has expired"
            })
        }
        const existingUser = await User.findOne({$or:[{username:request.username},{email:request.email},{mobile:request.mobile}]});
        if(existingUser){
            request.status = "rejected";
            await request.save();
            emitAdminRegistrationStatus(req, request, "rejected", "Admin registration request rejected because user already exists.");
            return res.status(400).json({
                success:false,
                message:"User already exists"
            })
        }
        const user = await User.create({
            username:request.username,
            email:request.email,
            mobile:request.mobile,
            passwordHash:request.passwordHash,
            role:"admin"
        });

        request.status = "approved";
        await request.save();
        emitAdminRegistrationStatus(req, request, "approved", "Admin registration request approved. You can now login.");
        return res.status(200).send(`
             <!DOCTYPE html>
            <html>
            <head>
                <title>Admin Approved</title>
            </head>

            <body style="
                font-family: Arial, sans-serif;
                background: #f1f5f9;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                margin: 0;
            ">

                <div style="
                    background: white;
                    padding: 40px;
                    border-radius: 16px;
                    text-align: center;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.08);
                ">

                    <div style="
                        font-size: 48px;
                        margin-bottom: 15px;
                    ">
                        ✓
                    </div>

                    <h1 style="color: #16a34a;">
                        Admin Approved
                    </h1>

                    <p style="color: #64748b;">
                        The admin account for
                        <strong>${user.username}</strong>
                        has been successfully created.
                    </p>

                    <p style="color: #64748b;">
                        The user can now log in using their credentials.
                    </p>

                </div>

            </body>
            </html>`);
    }
    catch(err){
        console.error(err);
        return res.status(500).send(`
            <h2>Something went wrong while approving the admin request.</h2>
        `);
    }
}

export const rejectAdminRegistration = async(req,res)=>{
    try{
        const {token} = req.params;
        const approvalTokenHash = hashApprovalToken(token);
        const request = await AdminRegistrationRequest.findOne({
            approvalTokenHash,
            status:"pending"
        });
        if(!request){
            return res.status(404).json({
                success:false,
                message:"Invalid or Already Processed Request"
            })
        }
        if(request.expiresAt<new Date()){
            request.status = "expired";
            await request.save();
            emitAdminRegistrationStatus(req, request, "expired", "Admin registration request has expired.");
            return res.status(410).json({
                success:false,
                message:"Request Expired"
            })
        }
        request.status="rejected"
        await request.save();
        emitAdminRegistrationStatus(req, request, "rejected", "Admin registration request rejected.");

        return res.status(200).send(`
             <!DOCTYPE html>
            <html>
            <head>
                <title>Admin Request Rejected</title>
            </head>

            <body style="
                font-family: Arial, sans-serif;
                background: #f1f5f9;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                margin: 0;
            ">

                <div style="
                    background: white;
                    padding: 40px;
                    border-radius: 16px;
                    text-align: center;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.08);
                ">

                    <div style="font-size: 48px;">
                        ✕
                    </div>

                    <h1 style="color: #dc2626;">
                        Admin Request Rejected
                    </h1>

                    <p style="color: #64748b;">
                        The admin registration request has been rejected.
                    </p>

                </div>

            </body>
            </html>
            `)
    }
    catch(err){
console.error(err);
 return res.status(500).send(`
            <h2>Something went wrong while rejecting the request.</h2>
        `);
    }
}

export const getAdminRegistrationStatus = async(req, res)=>{
    try{
        const {requestId}=req.params;
        const request = await AdminRegistrationRequest.findById(requestId);
        if(!request){
            return res.status(400).json({
                success:false,
                message:"Admin Registration request not found"
            })
        }
        return res.status(200).json({
            success:true,
            message:request.status
        });
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Unable to get registration status"
        })
    }
}

export const registerUser  = async(req, res)=>{
    try{
    const {username, email, mobile, password, confirmPassword}= req.body;

    if(!username || !email || !mobile || !password || !confirmPassword){
        return res.status(400).json({
            success:false,
            message:"All fields are required"
        })
    }
    if(password!==confirmPassword){
        return res.status(400).json({
            success:false,
            message:"Password doesn't match"
        })
    }
    const existingUser = await User.findOne({
        $or :[{username}, {email},{mobile}]
    })
    if(existingUser){
        return res.status(409).json({
            success:false,
            message:"Already Resigtered"
        })
    }
    const passwordHash = await bcrypt.hash(password,10);
    const user = await User.create({
        username,
        email,
        mobile,
        passwordHash,
        role:"user"
    })

    return res.status(201).json({
        success:true,
        message:"User Created Successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email,
            mobile:user.mobile,
            role:user.role
        }
    })
}
catch(err){
    return res.status(500).json({
        success:false,
        message:"Internal Server Error"
    })
}
}

export const requestForgotPassword  = async(req, res)=>{
    try{
        const {identifier} = req.body;
        if(!identifier){
            return res.status(400).json({
                success:true,
                message:"Email or Mobile number is Required"
            })
        };

        const normalisedIdentifier = identifier.trim().toLowerCase();

        const isEmail = normalisedIdentifier.includes("@");
        const isMobile = /^\d{10}$/.test(
    normalisedIdentifier
        );
        if (!isEmail && !isMobile) {
        return res.status(400).json({
        success: false,
        message:
            "Please enter a valid email address or 10-digit mobile number"
        });
        }
        // const query = isEmail?{email:normalisedIdentifier}:{mobile:normalisedIdentifier};
        let query;
        if (isEmail) {
    query = {
        email: normalisedIdentifier
    };
} else {
    query = {
        mobile: normalisedIdentifier
    };
}

        const user = await User.findOne(query);

        if(!user){
            return res.status(200).json({
                success:true,
                message:"If an account matches the provided information, an OTP has been sent!!"
            })
        };

        const otp = generateOTP();
        const otpHash = hashOTP(otp);
        const otpExpiresAt = new Date(Date.now()+5*60*1000);
        await PasswordReset.deleteMany({
            userId:user._id
        });

        await PasswordReset.create({
            userId :user._id,
            identifier:normalisedIdentifier,
            deliveryMethod:isEmail?"email":"mobile",
            otpHash,
            otpExpiresAt,
            otpAttempts :0,
            verified:false
        });

        if(isEmail){
            await sendPasswordResetOTP({
                email:user.email,
                otp
            })
        }
        else if (isMobile) {

    await sendPasswordResetSMS({
        mobile: user.mobile,
        otp
    });
}
        return res.status(200).json({
                success:true,
                message:"If an account matches the provided information, an OTP has been sent!!"
            })
    }
    catch(err){
        console.error("Forgot Password request error", err);
        return res.status(500).json({
            success:false,
            message:"Unable to process Password reset request"
        })
    }
}

export const verifyForgotPasswordOTP  = async(req, res)=>{
    try{
        const {identifier, otp}=req.body;
        if(!identifier || !otp){
            return res.status(400).json({
                success:false,
                message:"Identifier and OTP are required"
            })
        }

        const normaliseIdentifier = identifier.trim().toLowerCase();

        const resetRequest = await PasswordReset.findOne({
            identifier:normaliseIdentifier,
            verified:false
        })

        if(!resetRequest){
            return res.status(400).json({
                success:false,
                message:"Invalid or expired Password reset request"
            })
        }

        if(resetRequest.otpExpiresAt<new Date()){
            await PasswordReset.deleteOne({
                _id:resetRequest._id
            });

            return res.status(400).json({
                success:false,
                message:"OTP has expired. Please request for new OTP"
            })
        }

        if(resetRequest.otpAttempts>=3){
            await PasswordReset.deleteOne({
                _id:resetRequest._id
            })
            return res.status(429).json({
                success:false,
                message:"Too Many Failed attempts. Please request a new OTP"
            })
        };

        const enteredOTPhash = hashOTP(otp);
        if(enteredOTPhash !== resetRequest.otpHash){
            resetRequest.otpAttempts +=1;
            await resetRequest.save();

            return res.status(400).json({
                success:false,
                message:"Invalid OTP"
            })
        }

        const resetToken = generateResetToken();
        const resetTokenHash = hashResetToken(resetToken);
        resetRequest.verified = true;
        resetRequest.resetTokenHash = resetTokenHash;
        resetRequest.resetTokenExpiresAt=new Date(Date.now()+15*60*1000)
        await resetRequest.save();
        return res.status(200).json({
            success:true,
            message:"OTP Verified Successfully",
            resetToken
        })
    }
    catch(err){
         console.error(
            "Verify forgot password OTP error:",
            err
        );

        return res.status(500).json({
            success: false,
            message: "Unable to verify OTP"
        });
    }
}

export const resetPassword = async(req,res)=>{
    try{
        const {resetToken, newPassword, confirmPassword}= req.body;
        if(!resetToken || !newPassword || !confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Reset Token and Password fields are required"
            }
        )
        }
        if(confirmPassword !== newPassword){
            return res.status(400).json({
                success:false,
                message:"Passwords do not match"
            })
        }
        const resetTokenHash = hashResetToken(resetToken);
        const resetRequest = await PasswordReset.findOne({
            resetTokenHash,
            verified:true
        });

        if(!resetRequest){
            return res.status(400).json({
                success:false,
                message:"Invalid of expired reset token"
            })
        }

        if(!resetRequest.resetTokenExpiresAt || resetRequest.resetTokenExpiresAt<new Date()){
            await PasswordReset.deleteOne({
                _id:resetRequest._id
            });

            return res.status(400).json({
                success:false,
                message:"Reset Token has expired please try again"
            })
        };

        const user = await User.findById(
            resetRequest.userId
        );

        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not found"
            })
        }
        const passwordHash = await bcrypt.hash(newPassword,10);
        user.passwordHash = passwordHash;
        await user.save();
        await PasswordReset.deleteOne({
            _id:resetRequest._id
        });

        return res.status(200).json({
            success:true,
            message:"Passwords Changes Successfully. Now You can Log In"
        })

    }
    catch(err){
return res.status(400).json({
success:false,
message:"Unable to change password"
})    
}
}

export const loginUser = async(req,res)=>{
    try{
        const {identifier, password}=req.body;

        if(!identifier || !password){
            return res.status(400).json({
                success:false,
                message:"Identifier and Password are required"
            })
        }

        const normalisedIdentifier = identifier.trim().toLowerCase();
        const user = await User.findOne({
            $or:[
                {email:normalisedIdentifier},
                {mobile:identifier.trim()}
            ]
        });

        if(!user){
            return res.status(400).json({
                success:false,
                message:"Invalid Credentials"
            })
        };

        const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);
        if(!isPasswordCorrect){
            return res.status(400).json({
                success:false,
                message:"Invalid Credentials"
            })
        };

        req.session.userId = user._id.toString();

        return res.status(200).json({
            success:true,
            message:"Login Successful",
            user:{
                id:user._id,
                username:user.username,
                email:user.email,
                mobile:user.mobile,
                role:user.role
            }
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:`${err} Unable to login user`
    })
    }
}

export const logoutUser = async(req, res)=>{
    try{
        req.session.destroy((err)=>{
            if(err){
                console.log(err);
                return res.status(500).json({
                    success:false,
                    message:"Unable to logout User"
                })
            }
            res.clearCookie("connect.sid");
            return res.status(200).json({
                success:true,
                message:"Logout Successful"
            })
        });

    }
    catch(err){
        console.error("Logout error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error during logout"
        });
    }
}

