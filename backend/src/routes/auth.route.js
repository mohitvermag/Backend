import express from "express";

import { approveAdminRegistration, getAdminRegistrationStatus, loginUser, logoutUser, registerUser, rejectAdminRegistration, requestAdminRegistration, requestForgotPassword, resetPassword, verifyForgotPasswordOTP } from "../controllers/auth.controller.js";
const router = express.Router();

router.post("/admin/request",requestAdminRegistration);
router.post("/user/register",registerUser);
router.get("/admin/approve/:token",approveAdminRegistration);
router.get("/admin/reject/:token",rejectAdminRegistration);
router.get("/admin/request-status/:requestId",getAdminRegistrationStatus);
router.post("/forgot-password/request",requestForgotPassword);
router.post("/forgot-password/verify",verifyForgotPasswordOTP);
router.post("/forgot-password/reset",resetPassword);
router.post("/login",loginUser);
router.post("/logout",logoutUser);

export default router;