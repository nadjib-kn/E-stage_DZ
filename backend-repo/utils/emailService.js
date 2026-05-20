const nodemailer = require('nodemailer');

// For local development, we configure a transporter.
// If you don't have SMTP credentials in your .env, it will fallback to logging the email.
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: process.env.SMTP_PORT || 587,
  auth: {
    user: process.env.SMTP_USER || 'test',
    pass: process.env.SMTP_PASS || 'test'
  }
});

const sendAccountDeletionEmail = async (userEmail, userName, role) => {
  try {
    const mailOptions = {
      from: '"E-Stage DZ Admin" <admin@estage-dz.com>',
      to: userEmail,
      subject: 'Important: Your E-Stage DZ Account has been removed',
      text: `Hello ${userName || 'User'},\n\nWe are writing to inform you that your ${role} account on the E-Stage DZ platform has been permanently removed by an administrator. If you believe this was a mistake, please contact our support team.\n\nBest regards,\nThe E-Stage DZ Team`,
      html: `
        <div style="font-family: sans-serif; max-w-md; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
          <h2 style="color: #e11d48;">Account Removed</h2>
          <p>Hello <strong>${userName || 'User'}</strong>,</p>
          <p>We are writing to inform you that your <strong>${role}</strong> account on the E-Stage DZ platform has been permanently removed by an administrator.</p>
          <p>If you believe this was a mistake, please contact our support team.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 12px; color: #64748b;">Best regards,<br>The E-Stage DZ Team</p>
        </div>
      `
    };

    // If we are missing real SMTP credentials, just log it for debugging
    if (!process.env.SMTP_HOST) {
      console.log('\n=========================================');
      console.log('📧 MOCK EMAIL SENT (No SMTP Configured):');
      console.log('To:', mailOptions.to);
      console.log('Subject:', mailOptions.subject);
      console.log('Body Text:\n', mailOptions.text);
      console.log('=========================================\n');
      return true;
    }

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return true;
  } catch (error) {
    console.error('Error sending deletion email:', error);
    return false;
  }
};

module.exports = {
  sendAccountDeletionEmail
};
