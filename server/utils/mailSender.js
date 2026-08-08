const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const mailSender = async (email, title, body) => {
  try {
    await transporter.verify();
    console.log("SMTP Connected Successfully");

    const info = await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: title,
      html: body,
    });

    console.log("Mail Sent Successfully:", info.messageId);
    return info;
  } catch (err) {
    console.error("MAIL ERROR:", err);
    throw err;
  }
};

module.exports = mailSender;
