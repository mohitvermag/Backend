import bcrypt from "bcrypt";
import User from "../models/User.js";
import AdminRegistrationRequest from "../models/AdminRegistrationRequest.js";
import { approvalToken as generateApprovalToken, approvalTokenHash as  hashApprovalToken} from "../utils/crypto.js";
import {sendAdminApprovalEmail} from "../utils/mail.js";

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
            return res.status(400).json({
                success:false,
                message:"Approval token has expired"
            })
        }
        const existingUser = await User.findOne({$or:[{username:request.username},{email:request.email},{mobile:request.mobile}]});
        if(existingUser){
            request.status = "rejected";
            await request.save();
            return res.status(400).json({
                success:false,
                message:"User already exists"
            })
        }
        console.log(request);
        const user = await User.create({
            username:request.username,
            email:request.email,
            mobile:request.mobile,
            passwordHash:request.passwordHash,
            role:"admin"
        });

        request.status = "approved";
        await request.save();
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
            return res.status(410).json({
                success:false,
                message:"Request Expired"
            })
        }
        request.status="rejected"
        await request.save();

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

