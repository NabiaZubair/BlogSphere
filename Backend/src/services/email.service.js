
import nodemailer from "nodemailer";
import config from "../config/config.js";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: config.GMAIL_USER,
    pass: config.GMAIL_APP_PASSWORD,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error("error connecting to email server:", error);
  } else {
    console.log("email server is ready to send messages");
  }
});

export const sendEmail = async ({ to, subject, text, html }) => {
  const info = await transporter.sendMail({
    from: `"BlogSphere" <${config.GMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  });

  console.log("Message sent: %s", info.messageId);
  return info;
};

export const sendOtpEmail = async (email, otp) => {
  return sendEmail({
    to: email,
    subject: "Verify your email",
    text: `Your verification code is ${otp}. It expires in 10 minutes.`,
    html: `
      <h2>Your verification code</h2>
      <p style="font-size:24px;letter-spacing:4px"><b>${otp}</b></p>
      <p>This code expires in 10 minutes.</p>
      <p>If you didn't register, ignore this email.</p>
    `,
  });
};