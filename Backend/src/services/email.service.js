
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


export const sendOtpEmail = async (email, otp, purpose = "verify") => {
    const isReset = purpose === "reset";

    const subject = isReset ? "Reset your BlogSphere password" : "Verify your email";
    const label = isReset ? "password reset" : "verification";
    const ignoreNote = isReset
        ? "If you didn't request a password reset, you can ignore this email."
        : "If you didn't register, ignore this email.";

    return sendEmail({
        to: email,
        subject,
        text: `Your ${label} code is ${otp}. It expires in 10 minutes. ${ignoreNote}`,
        html: `
      <h2>Your ${label} code</h2>
      <p style="font-size:24px;letter-spacing:4px"><b>${otp}</b></p>
      <p>This code expires in 10 minutes.</p>
      <p>${ignoreNote}</p>
    `,
    });
};
