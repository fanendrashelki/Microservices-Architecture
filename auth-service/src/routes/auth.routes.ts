import express from "express";
import { sendEmailController, signUpController, loginController, forgotPasswordController, forgorPasswordVerifyOtpController, resetPasswordController, updatePasswordController } from "../controllers/auth.controller";
const router = express.Router()

router.post('/send-mail-auth', sendEmailController)
router.post('/signUp', signUpController)
router.post('/login', loginController)
router.post("/forgot-password", forgotPasswordController);
router.put("/forgot-password-verify-otp", forgorPasswordVerifyOtpController);
router.put("/reset-password", resetPasswordController);
router.put("/update-password", updatePasswordController);

export default router
