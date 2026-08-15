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

async function sendTransactionEmail(userEmail, name, amount, toAccount) {
  const subject = "Transaction Confirmation - BANK TRANSACTION System";

  const text = `Hello ${name},\n\nYour transaction of $${amount} to account number ${toAccount} was successful.\n\nThank you for using BANK TRANSACTION!\n\nBest regards,\nThe BANK TRANSACTION Team`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Transaction Successful</title>
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
                <p>Your transaction has been processed successfully. Here are the details:</p>
                
                <!-- Transaction Details Card -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; margin: 20px 0; padding: 16px;">
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Amount Transferred:</td>
                        <td style="padding: 8px 0; color: #0f172a; font-weight: bold; font-size: 16px; text-align: right;">$${amount}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #64748b; font-size: 14px; border-top: 1px dashed #cbd5e1;">Recipient Account:</td>
                        <td style="padding: 8px 0; color: #0f172a; font-weight: bold; font-size: 14px; text-align: right; border-top: 1px dashed #cbd5e1;">${toAccount}</td>
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

async function sendFailedTransactionEmail(
  userEmail,
  name,
  amount,
  toAccount,
  reason,
) {
  const subject = "Transaction Failed - BANK TRANSACTION System";

  const text = `Hello ${name},\n\nWe were unable to process your transaction of $${amount} to account number ${toAccount}.\n\nReason: ${reason || "Transaction declined by bank."}\n\nPlease verify your account details or contact support if you need assistance.\n\nBest regards,\nThe BANK TRANSACTION Team`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Transaction Failed</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <!-- Header -->
        <tr>
            <td style="background-color: #991b1b; padding: 24px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 20px; letter-spacing: 1px;">BANK TRANSACTION</h1>
            </td>
        </tr>
        <!-- Body Content -->
        <tr>
            <td style="padding: 32px; color: #334155; line-height: 1.6;">
                <h2 style="color: #0f172a; font-size: 18px; margin-top: 0;">Hello ${name},</h2>
                <p>We're writing to let you know that your recent transaction <strong style="color: #dc2626;">could not be completed</strong>.</p>
                
                <!-- Details Card -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; margin: 20px 0; padding: 16px;">
                    <tr>
                        <td style="padding: 8px 0; color: #7f1d1d; font-size: 14px;">Attempted Amount:</td>
                        <td style="padding: 8px 0; color: #991b1b; font-weight: bold; font-size: 16px; text-align: right;">$${amount}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #7f1d1d; font-size: 14px; border-top: 1px dashed #fca5a5;">Target Account:</td>
                        <td style="padding: 8px 0; color: #991b1b; font-weight: bold; font-size: 14px; text-align: right; border-top: 1px dashed #fca5a5;">${toAccount}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #7f1d1d; font-size: 14px; border-top: 1px dashed #fca5a5;">Reason:</td>
                        <td style="padding: 8px 0; color: #991b1b; font-weight: bold; font-size: 14px; text-align: right; border-top: 1px dashed #fca5a5;">${reason || "Declined"}</td>
                    </tr>
                </table>

                <p>No funds were deducted from your account. Please check your account balance or payment details and try again.</p>

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
}

module.exports = {
  sendRegistrationEmail,
  sendLoginEmail,
  sendTransactionEmail,
  sendFailedTransactionEmail,
};
