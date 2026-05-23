import express from "express";
import { 
    signup, 
    login, 
    continueWithGoogle, 
    continueWithGoogleAdmin, 
    signupAdmin, 
    loginAdmin, 
    forgotpassword, 
    resetpassword 
} from "../controllers/auth.controller.js";
import { validateRequest } from "../validation/validate.middleware.js";
import { 
    signupSchema, 
    loginSchema, 
    continueWithGoogleSchema, 
    forgotPasswordSchema, 
    resetPasswordSchema 
} from "../validation/auth.validation.js";

const router = express.Router();

// Public Routes 
router.post('/google/signup', validateRequest(continueWithGoogleSchema), continueWithGoogle);
router.post('/signup', validateRequest(signupSchema), signup);
router.post('/login', validateRequest(loginSchema), login);
router.post('/forgot-password', validateRequest(forgotPasswordSchema), forgotpassword);
router.post('/reset-password/:id', validateRequest(resetPasswordSchema), resetpassword);

// Admin Routes
router.post('/admin/google/signup', validateRequest(continueWithGoogleSchema), continueWithGoogleAdmin);
router.post('/admin/signup', validateRequest(signupSchema), signupAdmin);
router.post('/admin/login', validateRequest(loginSchema), loginAdmin);

export default router;
