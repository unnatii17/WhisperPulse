const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 60000,
  greetingTimeout: 60000,
  socketTimeout: 60000,
});

const mailSender = async (email, title, body) => {
  try {
    await transporter.verify();
    console.log("SMTP Connected Successfully");

    const info = await transporter.sendMail({
      from: `"WhisperPulse" <${process.env.MAIL_USER}>`,
      to: email,
      subject: title,
      html: body,
    });

    console.log("Mail Sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("MAIL ERROR:", err);
    throw err;
  }
};

module.exports = mailSender;
