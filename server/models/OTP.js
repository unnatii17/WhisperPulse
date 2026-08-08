const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const otpTemplate = require("../mail/templates/emailVerificationTemplate");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },

  otp: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
    expires: 20 * 60,
  },
});

// Send Verification Email
async function sendVerificationEmail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "Verification Email from WhisperPulse",
      otpTemplate(otp)
    );

    console.log("OTP Mail Sent Successfully");
    return mailResponse;
  } catch (error) {
    console.error("MAIL ERROR:", error);
    return null;
  }
}

// Pre Save Middleware
otpSchema.pre("save", async function (next) {
  try {
    await sendVerificationEmail(this.email, this.otp);
  } catch (err) {
    console.error("OTP Email Error:", err);
  }

  next();
});

module.exports = mongoose.model("OTP", otpSchema);
