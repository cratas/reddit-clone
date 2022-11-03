import nodemailer from "nodemailer";

export async function sendEmail(to: string, text: string) {
  let testAccount = await nodemailer.createTestAccount();
  console.log("testAccount", testAccount);

  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "jessica1@ethereal.email",
      pass: "XF2jYASHkMmZEUP1hG",
    },
  });

  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>',
    to,
    subject: "Change password",
    text,
  });

  console.log("Message sent: %s", info.messageId);

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
