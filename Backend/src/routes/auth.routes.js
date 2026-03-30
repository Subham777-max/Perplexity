import { Router } from "express";
import { getMe, login, register, resendEmail, verifyEmail } from "../controllers/auth.controller.js";
import { loginValidator, registerValidator } from "../validator/auth.validator.js";
import { authUser } from "../middleware/auth.middleware.js";

const authRouter = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
authRouter.post("/register",registerValidator,register);

/**
 * @route GET /api/auth/verify-email/:token
 * @desc Verify user's email address
 * @access Public
 */
authRouter.get("/verify-email/:token", verifyEmail);

/**
 * @route GET /api/auth/resend-verification
 * @desc Resend email verification token
 * @access Public
 */
authRouter.get("/resend-verification", resendEmail);

/**
 * @route POST /api/auth/login
 * @desc Login user and return JWT token
 * @access Public
 */
authRouter.post("/login", loginValidator ,login);

/**
 * @route GET /api/auth/me
 * @desc Get current logged in user
 * @access Private
 */
authRouter.get("/me", authUser , getMe);

export default authRouter;