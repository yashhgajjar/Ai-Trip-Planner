import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for port 465, false for other ports
  auth: {
    user: "gyash9644@gmail.com",
    pass: "eyxv mmrx ahje anqz",
  },
  tls: {
    rejectUnauthorized: false
  }
});

