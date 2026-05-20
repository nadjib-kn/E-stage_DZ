const express = require('express');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const { verifyToken } = require('../middleware/auth');
const { handleAvatarUpload, handleResumeUpload } = require('../middleware/upload');

const router = express.Router();
const prisma = new PrismaClient();

// ─── Helper: strip password ───────────────────────────────────────────────────
const safeUser = (user) => {
  const { password, ...safe } = user;
  if (typeof safe.skills === 'string') {
    try { safe.skills = JSON.parse(safe.skills); } catch(e) { safe.skills = []; }
  } else if (!safe.skills) {
    safe.skills = [];
  }
  return safe;
};

// ─── GET /api/users/me ────────────────────────────────────────────────────────
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.status(200).json({ success: true, data: { user: safeUser(user) } });
  } catch (error) {
    console.error('[GET /users/me]', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─── PUT /api/users/me ────────────────────────────────────────────────────────
router.put('/me', verifyToken, async (req, res) => {
  try {
    const { role, id: _id } = req.user;

    // Fields a student can update
    const studentFields = [
      'firstName', 'lastName', 'phone', 'university', 'major',
      'graduationYear', 'skills', 'portfolioUrl', 'githubUrl',
    ];

    // Fields a company can update
    const companyFields = [
      'companyName', 'industry', 'location', 'website', 'size', 'about',
      'nif', 'registreCommerce',
    ];

    // Common fields any user can update
    const commonFields = ['avatar'];

    let allowedFields = [...commonFields];
    if (role === 'student') allowedFields = [...allowedFields, ...studentFields];
    if (role === 'company') allowedFields = [...allowedFields, ...companyFields];

    const updateData = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        // skills is a JSON array; stringify if it's an array
        if (field === 'skills' && Array.isArray(req.body[field])) {
          updateData[field] = JSON.stringify(req.body[field]);
        } else {
          updateData[field] = req.body[field];
        }
      }
    }

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
    });

    res.status(200).json({ success: true, data: { user: safeUser(updated) } });
  } catch (error) {
    console.error('[PUT /users/me]', error);
    res.status(500).json({ success: false, message: 'Server error updating profile.' });
  }
});

// ─── POST /api/users/me/avatar ────────────────────────────────────────────────
router.post('/me/avatar', verifyToken, handleAvatarUpload, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const avatarUrl = req.file.path;

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: { avatar: avatarUrl },
    });

    res.status(200).json({
      success: true,
      data: { avatarUrl, user: safeUser(updated) },
    });
  } catch (error) {
    console.error('[POST /users/me/avatar]', error);
    res.status(500).json({ success: false, message: 'Server error uploading avatar.' });
  }
});

// ─── POST /api/users/me/resume ────────────────────────────────────────────────
router.post('/me/resume', verifyToken, handleResumeUpload, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const resumeUrl = req.file.path;
    const resumeName = req.file.originalname;

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: { resumeUrl, resumeName },
    });

    res.status(200).json({
      success: true,
      data: { resumeUrl, resumeName, user: safeUser(updated) },
    });
  } catch (error) {
    console.error('[POST /users/me/resume]', error);
    res.status(500).json({ success: false, message: 'Server error uploading resume.' });
  }
});

// ─── GET /api/users/company/:companyId  (Public – company profile for students) ─
router.get('/company/:companyId', verifyToken, async (req, res) => {
  try {
    const company = await prisma.user.findUnique({ where: { id: req.params.companyId } });
    if (!company || company.role !== 'company') {
      return res.status(404).json({ success: false, message: 'Company not found.' });
    }

    // Return only public-safe fields
    const publicProfile = {
      id: company.id,
      companyName: company.companyName,
      industry: company.industry,
      location: company.location,
      website: company.website,
      size: company.size,
      about: company.about,
      avatar: company.avatar,
      verificationStatus: company.verificationStatus,
    };

    res.status(200).json({ success: true, data: { company: publicProfile } });
  } catch (error) {
    console.error('[GET /users/company/:companyId]', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;