const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const mailSender = async (email, title, body) => {
  try {
    await transporter.verify();

    console.log("Brevo SMTP Connected Successfully");

    const info = await transporter.sendMail({
      from: `"WhisperPulse" <${process.env.MAIL_FROM}>`,
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
