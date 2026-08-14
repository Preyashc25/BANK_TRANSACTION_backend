const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log("Error while connecting to email server", error);
  } else {
    console.log("Email server is ready to send message");
  }
});

// module.exports = transporter;

const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"BANK TRANSACTION" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URI:%s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.log("Error sending email:", error);
  }
};

async function sendRegistrationEmail(userEmail, name) {
  const subject = "Welcome To BANK TRANSACTION system";

  const text = `Hello ${name},\n\nThank you for registering at BANK TRANSACTION. We're excited to have you on board!\n\nBest regards,\nThe BANK TRANSACTION Team`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to BANK TRANSACTION</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <!-- Header -->
        <tr>
            <td style="background-color: #1e293b; padding: 24px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 20px; letter-spacing: 1px;">BANK TRANSACTION</h1>
            </td>
        </tr>
        <!-- Body Content -->
        <tr>
            <td style="padding: 32px; color: #334155; line-height: 1.6;">
                <h2 style="color: #0f172a; font-size: 18px; margin-top: 0;">Hello ${name},</h2>
                <p>Thank you for registering at <strong>BANK TRANSACTION</strong>. We're excited to have you on board!</p>
                <p style="margin-top: 24px;">Best regards,<br><strong>The BANK TRANSACTION Team</strong></p>
            </td>
        </tr>
        <!-- Footer -->
        <tr>
            <td style="background-color: #f8fafc; padding: 16px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0;">
                <p style="margin: 0;">&copy; ${new Date().getFullYear()} BANK TRANSACTION. All rights reserved.</p>
            </td>
        </tr>
    </table>
</body>
</html>
`;

  await sendEmail(userEmail, subject, text, html);
}

async function sendLoginEmail(userEmail, name) {
  const subject = "Successful Login - BANK TRANSACTION System";

  const text = `Hello ${name},\n\nWe noticed a new login to your BANK TRANSACTION account.\n\nIf this was you, you can safely ignore this email. If you did not log in, please secure your account immediately.\n\nBest regards,\nThe BANK TRANSACTION Team`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Successful Login</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <!-- Header -->
        <tr>
            <td style="background-color: #1e293b; padding: 24px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 20px; letter-spacing: 1px;">BANK TRANSACTION</h1>
            </td>
        </tr>
        <!-- Body Content -->
        <tr>
            <td style="padding: 32px; color: #334155; line-height: 1.6;">
                <h2 style="color: #0f172a; font-size: 18px; margin-top: 0;">Hello ${name},</h2>
                <p>We detected a <strong>successful login</strong> to your BANK TRANSACTION account.</p>
                
                <!-- Security Alert Box -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f1f5f9; border-left: 4px solid #0284c7; border-radius: 4px; margin: 20px 0;">
                    <tr>
                        <td style="padding: 16px; color: #334155; font-size: 14px;">
                            <strong>Didn't log in?</strong> If this wasn't you, please reset your password immediately or contact our support team to secure your account.
                        </td>
                    </tr>
                </table>

                <p style="margin-top: 24px;">Best regards,<br><strong>The BANK TRANSACTION Team</strong></p>
            </td>
        </tr>
        <!-- Footer -->
        <tr>
            <td style="background-color: #f8fafc; padding: 16px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0;">
                <p style="margin: 0;">&copy; ${new Date().getFullYear()} BANK TRANSACTION. All rights reserved.</p>
            </td>
        </tr>
    </table>
</body>
</html>
`;

  await sendEmail(userEmail, subject, text, html);
}

module.exports = {
  sendRegistrationEmail,
  sendLoginEmail
};
