const nodemailer = require('nodemailer');

// ─── Transporter: prefers Gmail, falls back to generic SMTP, then mock ─────────
const createTransporter = () => {
  // Gmail (preferred — set GMAIL_USER + GMAIL_APP_PASSWORD in env)
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }

  // Generic SMTP fallback
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // No credentials — mock transporter (logs to console)
  return null;
};

const FROM_NAME = 'E-Stage DZ';
const FROM_EMAIL = process.env.GMAIL_USER || process.env.SMTP_USER || 'no-reply@estage-dz.com';

// ─── Helper: send or mock ──────────────────────────────────────────────────────
const sendMail = async (mailOptions) => {
  const transporter = createTransporter();

  if (!transporter) {
    console.log('\n=========================================');
    console.log('📧 MOCK EMAIL (No SMTP configured):');
    console.log('To:', mailOptions.to);
    console.log('Subject:', mailOptions.subject);
    console.log('=========================================\n');
    return { success: true };
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    return { success: true };
  } catch (error) {
    console.error('❌ Transporter error:', error);
    return { success: false, error: error.message };
  }
};

// ─── Password Reset Email ──────────────────────────────────────────────────────
const sendPasswordResetEmail = async (userEmail, userName, resetLink) => {
  try {
    const mailOptions = {
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to: userEmail,
      subject: 'Reset your E-Stage DZ password',
      text: `Hello ${userName || 'there'},\n\nWe received a request to reset your password.\nClick the link below to set a new password (expires in 1 hour):\n\n${resetLink}\n\nIf you didn't request this, you can safely ignore this email.\n\nBest regards,\nThe E-Stage DZ Team`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
        <body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f1f5f9;">
          <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
            <tr><td align="center">
              <table width="100%" style="max-width:520px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(15,23,42,0.08);">
                
                <!-- Header gradient -->
                <tr><td style="background:linear-gradient(135deg,#1e3a8a 0%,#2563eb 50%,#0ea5e9 100%);padding:36px 40px;text-align:center;">
                  <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:800;letter-spacing:-0.5px;">🔑 Password Reset</h1>
                  <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">E-Stage DZ</p>
                </td></tr>

                <!-- Body -->
                <tr><td style="padding:40px;">
                  <p style="margin:0 0 8px;font-size:16px;color:#0f172a;font-weight:600;">Hello, ${userName || 'there'} 👋</p>
                  <p style="margin:0 0 28px;font-size:14px;color:#64748b;line-height:1.6;">
                    We received a request to reset the password for your E-Stage DZ account.
                    Click the button below to choose a new password.
                  </p>

                  <!-- CTA Button -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr><td align="center" style="padding-bottom:28px;">
                      <a href="${resetLink}" style="display:inline-block;background:linear-gradient(135deg,#2563eb,#0ea5e9);color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:14px 40px;border-radius:100px;box-shadow:0 8px 20px -6px rgba(37,99,235,0.45);">
                        Reset My Password
                      </a>
                    </td></tr>
                  </table>

                  <!-- Fallback link -->
                  <p style="margin:0 0 6px;font-size:12px;color:#94a3b8;">Button not working? Copy and paste this link:</p>
                  <p style="margin:0 0 28px;font-size:12px;word-break:break-all;">
                    <a href="${resetLink}" style="color:#2563eb;">${resetLink}</a>
                  </p>

                  <!-- Warning -->
                  <div style="background:#fef9ec;border:1px solid #fde68a;border-radius:10px;padding:14px 16px;">
                    <p style="margin:0;font-size:13px;color:#92400e;">
                      ⏱ This link expires in <strong>1 hour</strong>. If you didn't request a password reset, you can safely ignore this email — your password won't change.
                    </p>
                  </div>
                </td></tr>

                <!-- Footer -->
                <tr><td style="padding:0 40px 32px;text-align:center;">
                  <p style="margin:0;font-size:12px;color:#94a3b8;">
                    Best regards,<br><strong style="color:#64748b;">The E-Stage DZ Team</strong>
                  </p>
                </td></tr>

              </table>
            </td></tr>
          </table>
        </body>
        </html>
      `,
    };

    return await sendMail(mailOptions);
  } catch (error) {
    console.error('[emailService] sendPasswordResetEmail error:', error);
    return { success: false, error: error.message };
  }
};

// ─── Account Deletion Email ────────────────────────────────────────────────────
const sendAccountDeletionEmail = async (userEmail, userName, role) => {
  try {
    const mailOptions = {
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to: userEmail,
      subject: 'Important: Your E-Stage DZ Account has been removed',
      text: `Hello ${userName || 'User'},\n\nWe are writing to inform you that your ${role} account on the E-Stage DZ platform has been permanently removed by an administrator. If you believe this was a mistake, please contact our support team.\n\nBest regards,\nThe E-Stage DZ Team`,
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:auto;padding:20px;border:1px solid #e2e8f0;border-radius:10px;">
          <h2 style="color:#e11d48;">Account Removed</h2>
          <p>Hello <strong>${userName || 'User'}</strong>,</p>
          <p>We are writing to inform you that your <strong>${role}</strong> account on the E-Stage DZ platform has been permanently removed by an administrator.</p>
          <p>If you believe this was a mistake, please contact our support team.</p>
          <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;" />
          <p style="font-size:12px;color:#64748b;">Best regards,<br>The E-Stage DZ Team</p>
        </div>
      `,
    };

    return await sendMail(mailOptions);
  } catch (error) {
    console.error('[emailService] sendAccountDeletionEmail error:', error);
    return false;
  }
};

module.exports = {
  sendPasswordResetEmail,
  sendAccountDeletionEmail,
};
