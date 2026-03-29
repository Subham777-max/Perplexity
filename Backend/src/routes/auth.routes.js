import { Router } from "express";
import { register } from "../controllers/auth.controller.js";
import { registerValidator } from "../validator/auth.validator.js";

const authRouter = Router();

authRouter.post("/register",registerValidator,register);

export default authRouter;