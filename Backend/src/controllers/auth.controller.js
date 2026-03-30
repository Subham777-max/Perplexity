import userModel from "../models/user.model.js";
import { sendEmail } from "../services/mail.service.js";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await userModel.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      const err = new Error("User already exists");
      err.status = 400;
      return next(err);
    }

    const user = await userModel.create({
      username,
      email,
      password,
    });

    const emailVerificationToken = jwt.sign(
      { id: user._id , email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    user.emailVerificationToken = emailVerificationToken;
    await user.save();

    sendEmail({
      to: email,
      subject: "Welcome to Perplexity",
      text: `Hello ${username}, your account has been created successfully.`,
      html: `
        <div style="margin:0;padding:32px 16px;background:linear-gradient(135deg,#f6f9fc 0%,#eef3ff 100%);font-family:Arial,'Segoe UI',sans-serif;color:#1f2937;">
          <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(17,24,39,0.08);">
            <div style="padding:28px 28px 18px;background:linear-gradient(135deg,#0f172a 0%,#1e3a8a 100%);color:#ffffff;">
              <h1 style="margin:0;font-size:24px;line-height:1.3;font-weight:700;">Welcome to Perplexity</h1>
              <p style="margin:10px 0 0;font-size:14px;opacity:0.92;">Your account is almost ready, ${username}.</p>
            </div>
            <div style="padding:28px;">
              <p style="margin:0 0 14px;font-size:15px;line-height:1.7;">Hi <strong>${username}</strong>, your account has been created successfully.</p>
              <p style="margin:0 0 22px;font-size:15px;line-height:1.7;">Please verify your email address to activate your account and start chatting.</p>
              <div style="margin:0 0 22px;">
                <a href="${process.env.BASE_URL}/auth/verify-email/${emailVerificationToken}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 20px;border-radius:10px;">Verify Email</a>
              </div>
              <p style="margin:0 0 8px;font-size:13px;line-height:1.6;color:#4b5563;">If the button does not work, copy and paste this link into your browser:</p>
              <p style="margin:0;word-break:break-all;font-size:12px;line-height:1.6;color:#2563eb;">${process.env.BASE_URL}/auth/verify-email/${emailVerificationToken}</p>
            </div>
            <div style="padding:16px 28px 24px;background:#f9fafb;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:12px;line-height:1.6;color:#6b7280;">You are receiving this email because you created a Perplexity account.</p>
            </div>
          </div>
        </div>
      `,
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

export async function resendEmail(req, res, next){
  try{
    const { email } = req.body;
    const user = await userModel.findOne({ email: email });

    if (!user) {
      const err = new Error("User not found");
      err.status = 404;
      return next(err);
    }
    const emailVerificationToken = jwt.sign(
      { id: user._id , email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    user.emailVerificationToken = emailVerificationToken;
    await user.save();
    sendEmail({
      to: email,
      subject: "Welcome to Perplexity",
      text: `Hello ${user.username}, your account has been created successfully.`,
      html: `
        <div style="margin:0;padding:32px 16px;background:linear-gradient(135deg,#f6f9fc 0%,#eef3ff 100%);font-family:Arial,'Segoe UI',sans-serif;color:#1f2937;">
          <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(17,24,39,0.08);">
            <div style="padding:28px 28px 18px;background:linear-gradient(135deg,#0f172a 0%,#1e3a8a 100%);color:#ffffff;">
              <h1 style="margin:0;font-size:24px;line-height:1.3;font-weight:700;">Welcome to Perplexity</h1>
              <p style="margin:10px 0 0;font-size:14px;opacity:0.92;">Your account is almost ready, ${user.username}.</p>
            </div>
            <div style="padding:28px;">
              <p style="margin:0 0 14px;font-size:15px;line-height:1.7;">Hi <strong>${user.username}</strong>, your account has been created successfully.</p>
              <p style="margin:0 0 22px;font-size:15px;line-height:1.7;">Please verify your email address to activate your account and start chatting.</p>
              <div style="margin:0 0 22px;">
                <a href="${process.env.BASE_URL}/auth/verify-email/${emailVerificationToken}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 20px;border-radius:10px;">Verify Email</a>
              </div>
              <p style="margin:0 0 8px;font-size:13px;line-height:1.6;color:#4b5563;">If the button does not work, copy and paste this link into your browser:</p>
              <p style="margin:0;word-break:break-all;font-size:12px;line-height:1.6;color:#2563eb;">${process.env.BASE_URL}/auth/verify-email/${emailVerificationToken}</p>
            </div>
            <div style="padding:16px 28px 24px;background:#f9fafb;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:12px;line-height:1.6;color:#6b7280;">You are receiving this email because you created a Perplexity account.</p>
            </div>
          </div>
        </div>
      `,
    });
    res.status(200).json({
      success: true,
      message: "Verification email resent",
    });
  }catch(err){
    next(err);
  }
}

export async function verifyEmail(req, res, next) {
  try{
    const { token } = req.params;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findOne({ email: decoded.email });

    if (!user) {
      const err = new Error("Invalid token");
      err.status = 400;
      return next(err);
    }

    if (!user.emailVerificationToken || user.emailVerificationToken !== token) {
      return res.status(400).send(`
      <div style="margin:0;padding:40px 16px;background:linear-gradient(135deg,#fff7ed 0%,#fef2f2 100%);font-family:Arial,'Segoe UI',sans-serif;color:#7f1d1d;">
        <div style="max-width:620px;margin:0 auto;background:#ffffff;border:1px solid #fecaca;border-radius:18px;overflow:hidden;box-shadow:0 12px 28px rgba(15,23,42,0.08);">
          
          <div style="padding:28px;background:linear-gradient(135deg,#b91c1c 0%,#ef4444 100%);color:#ffffff;">
            <h1 style="margin:0;font-size:24px;font-weight:700;">Invalid or Expired Link</h1>
            <p style="margin:10px 0 0;font-size:14px;opacity:0.95;">This verification link is no longer valid.</p>
          </div>

          <div style="padding:28px;">
            <p style="margin:0 0 14px;font-size:16px;line-height:1.75;">
              This can happen if:
            </p>

            <ul style="margin:0 0 20px;padding-left:18px;font-size:15px;line-height:1.7;">
              <li>You already verified your email</li>
              <li>You requested a new verification email</li>
              <li>The link has expired</li>
            </ul>

            <p style="margin:0 0 22px;font-size:15px;line-height:1.75;">
              Please go back to the app and request a new verification email.
            </p>

            <div style="padding:14px 16px;border:1px solid #fecaca;background:#fef2f2;border-radius:10px;color:#991b1b;font-size:14px;">
              Open the app and click <strong>"Resend Verification Email"</strong>.
            </div>
          </div>

          <div style="padding:16px 28px 24px;background:#fef2f2;border-top:1px solid #fecaca;">
            <p style="margin:0;font-size:12px;color:#991b1b;">
              If you didn’t request this, you can safely ignore this message.
            </p>
          </div>

        </div>
      </div>
    `);
    }

    user.verified = true;
    user.emailVerificationToken = null;
    await user.save();

    const html = `
      <div style="margin:0;padding:40px 16px;background:linear-gradient(135deg,#f0fdf4 0%,#ecfeff 100%);font-family:Arial,'Segoe UI',sans-serif;color:#0f172a;">
        <div style="max-width:620px;margin:0 auto;background:#ffffff;border:1px solid #d1fae5;border-radius:18px;overflow:hidden;box-shadow:0 12px 28px rgba(15,23,42,0.08);">
          <div style="padding:28px;background:linear-gradient(135deg,#065f46 0%,#0f766e 100%);color:#ffffff;">
            <h1 style="margin:0;font-size:24px;line-height:1.3;font-weight:700;">Email Verified Successfully</h1>
            <p style="margin:10px 0 0;font-size:14px;opacity:0.95;">Your account is now active.</p>
          </div>
          <div style="padding:28px;">
            <p style="margin:0 0 14px;font-size:16px;line-height:1.75;">Hi <strong>${user.username}</strong>, your email has been verified.</p>
            <p style="margin:0 0 22px;font-size:15px;line-height:1.75;color:#334155;">You can now log in to your account and start using <strong>Perplexity</strong>.</p>
            <div style="padding:14px 16px;border:1px solid #a7f3d0;background:#ecfdf5;border-radius:10px;color:#065f46;font-size:14px;line-height:1.6;">
              Verification complete. You can safely close this tab and continue in the app.
            </div>
          </div>
        </div>
      </div>
    `;

    res.send(html);

  } catch (err) {
    next(err);
  }

}

export const login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    const user = await userModel.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    }).select("+password");

    if (!user) {
      const err = new Error("Invalid credentials");
      err.status = 401;
      return next(err);
    }
    if(!user.verified){
      const err = new Error("Email not verified");
      err.status = 403;
      return next(err);
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      const err = new Error("Invalid credentials");
      err.status = 401;
      return next(err);
    }

    const token = jwt.sign({ id: user._id , email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token",token);

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

export async function getMe(req, res, next) {
  try{
    const user = await userModel.findById(req.user.id);

    if(!user){
      const err = new Error("User not found");
      err.status = 404;
      return next(err);
    }

    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
}