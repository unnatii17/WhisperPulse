const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT) || 587,
  secure: false,

  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const mailSender = async (email, title, body) => {
  try {
    console.log("Connecting to Brevo SMTP...");

    await transporter.verify();

    console.log("Brevo SMTP Connected Successfully");

    const info = await transporter.sendMail({
      from: `"WhisperPulse" <${process.env.MAIL_USER}>`,
      to: email,
      subject: title,
      html: body,
    });

    console.log("=================================");
    console.log("OTP EMAIL SENT SUCCESSFULLY");
    console.log("To:", email);
    console.log("Message ID:", info.messageId);
    console.log("=================================");

    return info;
  } catch (error) {
    console.error("=================================");
    console.error("BREVO MAIL ERROR");
    console.error("Code:", error.code);
    console.error("Command:", error.command);
    console.error("Response:", error.response);
    console.error("Message:", error.message);
    console.error("=================================");

    throw error;
  }
};

module.exports = mailSender;
