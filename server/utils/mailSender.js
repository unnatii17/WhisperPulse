const { Resend } = require("resend");
require("dotenv").config();

const resend = new Resend(process.env.RESEND_API_KEY);

const mailSender = async (email, title, body) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "WhisperPulse <onboarding@resend.dev>",
      to: [email],
      subject: title,
      html: body,
    });

    if (error) {
      throw error;
    }

    console.log("Mail Sent:", data);
    return data;
  } catch (err) {
    console.error("MAIL ERROR:", err);
    throw err;
  }
};

module.exports = mailSender;
