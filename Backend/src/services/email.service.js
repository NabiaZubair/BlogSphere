
import nodemailer from "nodemailer";
import config from "../config/config.js"


console.log({
  gmailUserLoaded: Boolean(process.env.GMAIL_USER),
  clientIdLoaded: Boolean(process.env.GOOGLE_CLIENT_ID),
  clientSecretLoaded: Boolean(process.env.GOOGLE_CLIENT_SECRET),
  refreshTokenLoaded: Boolean(process.env.GOOGLE_REFRESH_TOKEN),
});

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    type: "OAuth2",
    user: process.env.GMAIL_USER,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  },
});

transporter.verify((error)=> {
  if (error) {
    console.error("error connecting to email server:", error);
  }
  else {
    console.log("email server is ready to send message ");
  }
})


export const sendEmail= async({to,subject,text,html})=>{

  const info = await transporter.sendMail({
    from: `BlogSphere ${config.GMAIL_USER}`, // sender address
    to, // list of recipients
    subject,// subject line
    text, // plain text body
    html // HTML body
  });

  console.log("Message sent: %s", info.messageId);
  return info;
}


export const sendOtpEmail=async(email, otp) =>{
  return sendEmail({
    to: email,
    subject: "Verify your email",
    html: `
      <h2>Your verification code</h2>
      <p style="font-size:24px;letter-spacing:4px"><b>${otp}</b></p>
      <p>This code expires in 10 minutes. </p>
      <p>If you didn't register, ignore this email.</p>
    `,
  });
}