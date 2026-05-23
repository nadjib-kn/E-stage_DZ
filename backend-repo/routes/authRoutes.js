const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const { OAuth2Client } = require('google-auth-library');
const { verifyToken } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../validators/schemas');
const { sendPasswordResetEmail } = require('../utils/emailService');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const router = express.Router();
const prisma = new PrismaClient();

// ─── Helper: strip password from user object ──────────────────────────────────
const safeUser = (user) => {
  const { password, ...safe } = user;
  if (typeof safe.skills === 'string') {
    try { safe.skills = JSON.parse(safe.skills); } catch(e) { safe.skills = []; }
  } else if (!safe.skills) {
    safe.skills = [];
  }
  return safe;
};

// ─── POST /api/auth/register ──────────────────────────────────────────────────
router.post('/register', validate(registerSchema), async (req, res) => {
  try {
    const { role, email, password, firstName, lastName, companyName } = req.body;

    if (!role || !email || !password) {
      return res.status(400).json({ success: false, message: 'Role, email, and password are required.' });
    }
    if (!['student', 'company'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Role must be "student" or "company".' });
    }

    const isBlacklisted = await prisma.blacklist.findUnique({ where: { email } });
    if (isBlacklisted) {
      return res.status(403).json({ success: false, message: 'This email address has been banned and cannot be used to create an account.' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      if (existingUser.status === 'deleted') {
        return res.status(403).json({ success: false, message: 'This account was removed by the admin.' });
      }
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Dicebear avatar
    const seed = encodeURIComponent(email);
    const avatar = `https://api.dicebear.com/8.x/initials/svg?seed=${seed}`;

    const userData = {
      role,
      email,
      password: hashedPassword,
      avatar,
      status: 'active',
    };

    if (role === 'student') {
      userData.firstName = firstName || '';
      userData.lastName = lastName || '';
    } else if (role === 'company') {
      userData.companyName = companyName || '';
      userData.verificationStatus = 'pending';
    }

    const newUser = await prisma.user.create({ data: userData });

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      data: { user: safeUser(newUser) },
    });
  } catch (error) {
    console.error('[POST /auth/register]', error);
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
router.post('/login', validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (!user.password && user.googleId) {
      return res.status(401).json({ success: false, message: 'Please log in with Google.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // ── GATE 1: Suspended accounts ────────────────────────────────────────────
    if (user.status === 'suspended') {
      return res.status(403).json({ success: false, message: 'Your account has been suspended.' });
    }
    if (user.status === 'deleted') {
      return res.status(403).json({ success: false, message: 'This account was removed by the admin.' });
    }

    // ── GATE 2: Company verification ──────────────────────────────────────────
    if (user.role === 'company') {
      if (user.verificationStatus === 'pending') {
        return res.status(403).json({ success: false, message: 'Your company account is pending admin approval.' });
      }
      if (user.verificationStatus === 'rejected') {
        return res.status(403).json({ success: false, message: 'Your company account has been rejected.' });
      }
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'supersecretkey',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      data: { token, user: safeUser(user) },
    });
  } catch (error) {
    console.error('[POST /auth/login]', error);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
});

// ─── POST /api/auth/google ───────────────────────────────────────────────────
router.post('/google', async (req, res) => {
  try {
    const { credential, access_token, role } = req.body;
    if (!credential && !access_token) {
      return res.status(400).json({ success: false, message: 'Google credential or access_token is required.' });
    }

    let googleId, email, given_name, family_name, picture;

    if (access_token) {
      // Handle access_token (from custom useGoogleLogin button)
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${access_token}` }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user info with access token');
      }
      const payload = await response.json();
      googleId = payload.sub;
      email = payload.email;
      given_name = payload.given_name;
      family_name = payload.family_name;
      picture = payload.picture;
    } else {
      // Handle id_token (from standard GoogleLogin button)
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      googleId = payload.sub;
      email = payload.email;
      given_name = payload.given_name;
      family_name = payload.family_name;
      picture = payload.picture;
    }

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      const isBlacklisted = await prisma.blacklist.findUnique({ where: { email } });
      if (isBlacklisted) {
        return res.status(403).json({ success: false, message: 'This email address has been banned and cannot be used to create an account.' });
      }

      // Determine the role for new Google signups (default to student)
      const newRole = role === 'company' ? 'company' : 'student';
      
      // Create a new user based on the selected role
      user = await prisma.user.create({
        data: {
          role: newRole,
          email,
          googleId,
          firstName: newRole === 'student' ? (given_name || '') : null,
          lastName: newRole === 'student' ? (family_name || '') : null,
          companyName: newRole === 'company' ? (given_name ? `${given_name}'s Company` : 'New Company') : null,
          verificationStatus: newRole === 'company' ? 'pending' : null,
          avatar: picture || `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(email)}`,
          status: 'active',
        },
      });
    } else {
      // Update existing user with googleId if they signed up with email before
      if (!user.googleId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { googleId },
        });
      }
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ success: false, message: 'Your account has been suspended.' });
    }
    if (user.status === 'deleted') {
      return res.status(403).json({ success: false, message: 'This account was removed by the admin.' });
    }

    if (user.role === 'company') {
      if (user.verificationStatus === 'pending') {
        return res.status(403).json({ success: false, message: 'Your company account is pending admin approval.' });
      }
      if (user.verificationStatus === 'rejected') {
        return res.status(403).json({ success: false, message: 'Your company account has been rejected.' });
      }
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'supersecretkey',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      data: { token, user: safeUser(user) },
    });
  } catch (error) {
    console.error('[POST /auth/google]', error);
    res.status(500).json({ success: false, message: 'Server error during Google Login.' });
  }
});

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    res.status(200).json({ success: true, data: { user: safeUser(user) } });
  } catch (error) {
    console.error('[GET /auth/me]', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─── POST /api/auth/logout ────────────────────────────────────────────────────
router.post('/logout', verifyToken, (req, res) => {
  // JWT is stateless — client discards token. Server-side: no-op.
  res.status(200).json({ success: true, message: 'Logged out successfully.' });
});

// ─── POST /api/auth/forgot-password ──────────────────────────────────────────
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    // Always return success to prevent email enumeration
    if (!user) {
      return res.status(200).json({ success: true, message: 'If that email exists, a reset link has been sent.' });
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    // Set expiry to 1 hour
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.user.update({
      where: { email },
      data: {
        resetToken: hashedToken,
        resetTokenExpiry,
      },
    });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;
    const userName = user.role === 'student' ? user.firstName : user.companyName;

    const emailSent = await sendPasswordResetEmail(user.email, userName, resetLink);

    if (emailSent && emailSent.error) {
      // Revert token if email failed
      await prisma.user.update({
        where: { email },
        data: { resetToken: null, resetTokenExpiry: null },
      });
      return res.status(500).json({ success: false, message: 'Failed to send reset email: ' + emailSent.error });
    }

    if (!emailSent) {
      // Revert token if email failed
      await prisma.user.update({
        where: { email },
        data: { resetToken: null, resetTokenExpiry: null },
      });
      return res.status(500).json({ success: false, message: 'Failed to send reset email. Please try again later.' });
    }

    res.status(200).json({ success: true, message: 'If that email exists, a reset link has been sent.' });
  } catch (error) {
    console.error('[POST /auth/forgot-password]', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─── POST /api/auth/reset-password ───────────────────────────────────────────
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ success: false, message: 'Token and new password are required.' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await prisma.user.findFirst({
      where: {
        resetToken: hashedToken,
        resetTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    res.status(200).json({ success: true, message: 'Password reset successfully. Please log in.' });
  } catch (error) {
    console.error('[POST /auth/reset-password]', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;