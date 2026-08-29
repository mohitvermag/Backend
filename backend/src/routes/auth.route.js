import express from "express";

import { approveAdminRegistration, getAdminRegistrationStatus, registerUser, rejectAdminRegistration, requestAdminRegistration } from "../controllers/auth.controller.js";
const router = express.Router();

router.post("/admin/request",requestAdminRegistration);
router.post("/user/register",registerUser);
router.get("/admin/approve/:token",approveAdminRegistration);
router.get("/admin/reject/:token",rejectAdminRegistration);
router.get("/admin/request-status/:requestId",getAdminRegistrationStatus);

export default router;