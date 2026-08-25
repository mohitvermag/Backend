import express from "express";

import { approveAdminRegistration, rejectAdminRegistration, requestAdminRegistration } from "../controllers/auth.controller.js";
const router = express.Router();

router.post("/admin/request",requestAdminRegistration);
router.get("/admin/approve/:token",approveAdminRegistration);
router.get("/admin/reject/:token",rejectAdminRegistration);

export default router;