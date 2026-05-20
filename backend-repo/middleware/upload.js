const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create upload directories if they don't exist
const uploadDir = path.join(__dirname, '../uploads');
const avatarsDir = path.join(uploadDir, 'avatars');
const resumesDir = path.join(uploadDir, 'resumes');

[uploadDir, avatarsDir, resumesDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// ─── Storage Engines ──────────────────────────────────────────────────────────

// Avatar Storage (Images)
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, avatarsDir),
  filename: (req, file, cb) => {
    cb(null, `${req.user?.id || 'user'}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Resume Storage (PDFs)
const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, resumesDir),
  filename: (req, file, cb) => {
    cb(null, `${req.user?.id || 'user'}-${Date.now()}-resume${path.extname(file.originalname)}`);
  }
});

// ─── Upload Instances ─────────────────────────────────────────────────────────
const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only images are allowed'));
  }
}).single('avatar');

const uploadResume = multer({
  storage: resumeStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDFs are allowed'));
  }
}).single('resume');

// ─── Middleware Wrappers (return proper JSON errors) ──────────────────────────
const handleAvatarUpload = (req, res, next) => {
  uploadAvatar(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, message: 'File too large. Maximum size is 5MB.' });
      }
      return res.status(400).json({ success: false, message: err.message });
    }
    if (req.file) req.file.path = `/uploads/avatars/${req.file.filename}`;
    next();
  });
};

const handleResumeUpload = (req, res, next) => {
  uploadResume(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, message: 'File too large. Maximum size is 5MB.' });
      }
      return res.status(400).json({ success: false, message: err.message });
    }
    if (req.file) req.file.path = `/uploads/resumes/${req.file.filename}`;
    next();
  });
};

module.exports = { handleAvatarUpload, handleResumeUpload };
