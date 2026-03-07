const nodemailer = require('nodemailer');

const createTransporter = () => {
  // Prefer explicit SMTP config via env vars
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE } = process.env;
  if (SMTP_HOST && SMTP_USER) {
    return nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT ? parseInt(SMTP_PORT, 10) : 587,
      secure: SMTP_SECURE === 'true',
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  }
  return null;
};

const sendVerificationEmail = async (toEmail, token, name) => {
  const appUrl = process.env.APP_URL || 'http://localhost:5173';
  const from = process.env.FROM_EMAIL || `no-reply@${new URL(appUrl).hostname}`;
  const verifyUrl = `${appUrl.replace(/\/$/, '')}/verify?token=${token}&email=${encodeURIComponent(toEmail)}`;

  const transporter = createTransporter();
  const subject = 'Please verify your OkaySpace email';
  const text = `Hi ${name || ''},\n\nPlease verify your email by visiting the following link:\n${verifyUrl}\n\nThis link expires in 24 hours.\n\nIf you did not request this, please ignore.`;
  const html = `
    <p>Hi ${name || ''},</p>
    <p>Please verify your email by clicking the link below:</p>
    <p><a href="${verifyUrl}">Verify my email</a></p>
    <p>This link expires in 24 hours.</p>
  `;

  if (!transporter) {
    // Fallback: log the link so devs can copy it from server logs
    console.log('Email transport not configured. Verification link (DEV):', verifyUrl);
    return { ok: false, info: 'logged' };
  }

  const mailOptions = {
    from,
    to: toEmail,
    subject,
    text,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  return { ok: true, info };
};

module.exports = { sendVerificationEmail };
