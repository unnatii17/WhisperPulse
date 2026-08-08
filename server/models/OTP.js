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

    // Important: email fail hua to error ko hide mat karo
    throw error;
  }
}

// Pre Save Middleware
otpSchema.pre("save", async function (next) {
  try {
    await sendVerificationEmail(this.email, this.otp);

    next();
  } catch (error) {
    console.error("OTP Email Error:", error);

    next(error);
  }
});

module.exports = mongoose.model("OTP", otpSchema);
