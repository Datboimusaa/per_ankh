import { prisma } from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import crypto from "crypto";
import { sendEmail } from "../services/email.service.js";
import { FRONTEND_URL, NODE_ENV, JWT_REFRESH_SECRET } from "../config/env.js";

export async function register(req, res, next) {
  const { name, username, email, password } = req.body;

  try {
    if (!name || !username || !email || !password) {
      const error = new Error("All the fields are required");
      error.statusCode = 400;
      throw error;
    }

    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingEmail) {
      const error = new Error("Email already taken");
      error.statusCode = 400;
      throw error;
    }

    const existingUsername = await prisma.user.findUnique({
      where: { username }
    });

    if(existingUsername) {
      const error = new Error("Username already taken");
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationTokenRaw = crypto.randomBytes(32).toString("hex");

    const verificationToken = crypto
      .createHash("sha256")
      .update(verificationTokenRaw)
      .digest("hex");

    const newUser = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        verificationToken,
        verificationTokenExpiry: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

    const verificationLink = `${FRONTEND_URL}/verify-email?token=${verificationTokenRaw}`;

    await sendEmail({
      to: email,
      subject: "Per Ankh email verification",
      html: `
            <div>
              <h2>Email verification for Per Ankh</h2>
              <p>Please press on the link to verify your email address.</p>
              <a href="${verificationLink}">verify email</a>
            </div>
      `,
    });

    res.status(201).json({
      success: true,
      message: "verification email sent successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error("Invalid credentials");
      error.statusCode = 400;
      throw error;
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      const error = new Error("Invalid credentials");
      error.statusCode = 400;
      throw error;
    }

    if (!user.isVerified) {
      const error = new Error("Email verification required");
      error.statusCode = 401;
      throw error;
    }

    const matchingPassword = await bcrypt.compare(password, user.password);

    if (!matchingPassword) {
      const error = new Error("Invalid credentials");
      error.statusCode = 400;
      throw error;
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    const hashedRefreshToken = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    await prisma.refreshToken.create({
      data: {
        token: hashedRefreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "none",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "none",
      path: "/auth/refresh",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(req, res, next) {
  try {
    const incomingToken = req.cookies.refreshToken;

    if (incomingToken) {
      const hashedToken = crypto
        .createHash("sha256")
        .update(incomingToken)
        .digest("hex");

      await prisma.refreshToken.deleteMany({
        where: { token: hashedToken },
      });
    }

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "none",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "none",
      path: "/auth/refresh",
    });

    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function verifyEmail(req, res, next) {
  try {
    const { token } = req.query;

    if (!token) {
      const error = new Error("Token required");
      error.statusCode = 400;
      throw error;
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await prisma.user.findFirst({
      where: { verificationToken: hashedToken },
    });

    if (!user || user.verificationTokenExpiry < new Date()) {
      const error = new Error("Invalid or expired token");
      error.statusCode = 400;
      throw error;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
        verificationTokenExpiry: null,
      },
    });

    res.status(200).json({
      success: true,
      message: "User verified successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;

    if (!email) {
      const error = new Error("Email is required");
      error.statusCode = 400;
      throw error;
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If the email exists, a reset link was sent",
      });
    }

    const resetPasswordTokenRaw = crypto.randomBytes(32).toString("hex");
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetPasswordTokenRaw)
      .digest("hex");

    await prisma.user.update({
      where: { email },
      data: {
        resetPasswordToken,
        resetPasswordTokenExpiry: new Date(Date.now() + 600000),
      },
    });

    const resetPasswordLink = `${FRONTEND_URL}/reset-password?token=${resetPasswordTokenRaw}`;

    await sendEmail({
      to: email,
      subject: "Per Ankh password recovery",
      html: `
            <div>
              <h2>Per Ankh password recovery</h2>
              <p>Please click the link below to reset your password:</p>
              <a href="${resetPasswordLink}">Reset Password</a>
            </div>
      `,
    });

    res.status(200).json({
      success: true,
      message: "If the email exists, a reset link was sent",
    });
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(req, res, next) {
  try {
    const { newPassword, token } = req.body;

    if (!newPassword || !token) {
      const error = new Error("New password or token required");
      error.statusCode = 400;
      throw error;
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await prisma.user.findFirst({
      where: { resetPasswordToken: hashedToken },
    });

    if (!user || user.resetPasswordTokenExpiry < new Date()) {
      const error = new Error("Invalid or expired token");
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordTokenExpiry: null,
      },
    });

    await prisma.refreshToken.deleteMany({
      where: { userId: user.id },
    });

    res.status(200).json({
      success: true,
      message: "Password modified successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function refresh(req, res, next) {
  try {
    const incomingToken = req.cookies.refreshToken;

    if (!incomingToken) {
      const error = new Error("No refresh token");
      error.statusCode = 401;
      throw error;
    }

    let payload;
    try {
      payload = jwt.verify(incomingToken, JWT_REFRESH_SECRET);
    } catch {
      const error = new Error("Invalid refresh token");
      error.statusCode = 401;
      throw error;
    }

    const hashedRefreshToken = crypto
      .createHash("sha256")
      .update(incomingToken)
      .digest("hex");

      
    const stored = await prisma.refreshToken.findUnique({
      where: { token: hashedRefreshToken },
    });

    if (!stored || stored.expiresAt < new Date()) {
      const error = new Error("Token expired or revoked");
      error.statusCode = 401;
      throw error;
    }

    await prisma.refreshToken.delete({
      where: { token: hashedRefreshToken },
    });

    const newAccessToken = generateAccessToken(payload.userId);
    const newRefreshToken = generateRefreshToken(payload.userId);
    const newHash = crypto
      .createHash("sha256")
      .update(newRefreshToken)
      .digest("hex");

    await prisma.refreshToken.create({
      data: {
        token: newHash,
        userId: payload.userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "none",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "none",
      path: "/auth/refresh",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({ success: true });


  } catch (error) {
    next(error);
  }
}
