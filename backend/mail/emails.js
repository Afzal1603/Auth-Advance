const { sendEmail } = require("./mail.config");
const {
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
} = require("./emailTemplates");

const sendVerificationEmail = async (email, verificationToken) => {
  try {
    await sendEmail(
      email,
      "Verify your email",
      VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      )
    );
  } catch (err) {
    console.log("Error sending verification email", err);
    throw new Error("Error sending verificaiton email", err);
  }
};

const sendWelcomeEmail = async (email, name) => {
  try {
    await sendEmail(
      email,
      "Welcome to our platform",
      WELCOME_EMAIL.replace("{userName}", name)
    );
  } catch (err) {
    console.log("Error sending welcome email", err);
    throw new Error("Error sending welcome email", err);
  }
};

const sendPasswordResetEmail = async (email, resetURL) => {
  try {
    await sendEmail(
      email,
      "Reset your password",
      PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL)
    );
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Error sending password reset email");
  }
};

const sendSuccessPasswordResetEmail = async (email) => {
  try {
    await sendEmail(
      email,
      "Password reset successful",
      PASSWORD_RESET_SUCCESS_TEMPLATE
    );
  } catch (error) {}
};

module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendSuccessPasswordResetEmail,
};
