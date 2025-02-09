const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const User = require("../models/auth.user");
const generateTokenAndSetCookie = require("../utils/generateTokenAndSetCookie");
const generateVerificationToken = require("../utils/generateVerificationToken");
const {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendSuccessPasswordResetEmail,
} = require("../mail/emails");

const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      throw new Error("All fields are required");
    }
    const userAlreadyExist = await User.findOne({ email });
    if (userAlreadyExist) {
      return res
        .status(400)
        .json({ success: false, message: "User already exist" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationToken = generateVerificationToken();
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });
    generateTokenAndSetCookie(res, user._id);

    await sendVerificationEmail(user.email, verificationToken);
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    console.log(user);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification token",
      });
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);
    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    const token = await generateTokenAndSetCookie(res, user._id);
    User.lastLogin = Date.now();
    await user.save();
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      ...user._doc,
      password: undefined,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

const logout = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // ✅ Ensures HTTPS in production
    sameSite: "None", // ✅ Allows cross-site cookies (important for frontend-backend on different domains)
    expires: new Date(0), // ✅ Force immediate expiration
  });

  res.status(200).json({ success: true, message: "Logged out successfully" });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;
    await user.save();
    await sendPasswordResetEmail(
      user.email,
      `${process.env.PASSWORD_RESET_URL}/reset-password/${resetToken}`
    );
    res.status(200).json({
      success: true,
      message: "Password reset email sent",
      resetToken,
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid token" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    await sendSuccessPasswordResetEmail(user.email);
    res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Auth check passed",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  signup,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth,
};
