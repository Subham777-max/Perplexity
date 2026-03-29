import { body } from "express-validator";
import validate from "../middleware/validate.middleware.js";

const withValidation = (validations) => [...validations, validate];

// Register
export const registerValidator = withValidation([
  body("username")
    .notEmpty().withMessage("Username is required")
    .isLength({ min: 3 }).withMessage("Username must be at least 3 characters")
    .trim(),

  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
]);

// Login
export const loginValidator = withValidation([
  body("identifier")
    .notEmpty().withMessage("Email or Username is required")
    .trim(),

  body("password")
    .notEmpty().withMessage("Password is required"),
]);