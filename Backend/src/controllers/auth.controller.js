import User from "../models/user.model.js";
import { sendEmail } from "../services/mail.service.js";
export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      const err = new Error("User already exists");
      err.statusCode = 400;
      return next(err);
    }

    const user = await User.create({
      username,
      email,
      password,
    });

    await sendEmail({
        to: email,
        subject: "Welcome to Perplexity",
        text: `Hello ${username}, your account has been created successfully.`,
        html: `
            <h2>Welcome, ${username} 👋</h2>
            <p>Your account has been successfully created.</p>
            <p>Start using <b>Perplexity</b> now 🚀</p>
        `
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    }).select("+password");

    if (!user) {
      const err = new Error("Invalid credentials");
      err.statusCode = 401;
      return next(err);
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      const err = new Error("Invalid credentials");
      err.statusCode = 401;
      return next(err);
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
};