require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();

// ─── 1. CORS ───────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── 2. BODY PARSERS ──────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── 3. STATIC FILES (uploaded avatars & resumes) ────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── 4. ROUTES ────────────────────────────────────────────────────────────────
const authRoutes        = require('./routes/authRoutes');
const userRoutes        = require('./routes/userRoutes');
const internshipRoutes  = require('./routes/internshipRoutes'); // /api/jobs
const applicationRoutes = require('./routes/applicationRoutes');
const dashboardRoutes   = require('./routes/dashboardRoutes');
const adminRoutes       = require('./routes/adminRoutes');
const ticketRoutes      = require('./routes/ticketRoutes');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: { success: false, message: 'Too many attempts from this IP, please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// app.use('/api/auth/login', authLimiter);
// app.use('/api/auth/register', authLimiter);
// app.use('/api/auth/google', authLimiter);

app.use('/api/auth',         authRoutes);
app.use('/api/users',        userRoutes);
app.use('/api/jobs',         internshipRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/dashboard',    dashboardRoutes);
app.use('/api/admin',        adminRoutes);
app.use('/api/tickets',      ticketRoutes);

// ─── 5. CONTACT ENDPOINT (maps /api/contact → ticket router's /contact) ───────
app.use('/api/contact', (req, res, next) => {
  req.url = '/contact';
  ticketRoutes(req, res, next);
});

// ─── 6. HEALTH CHECK ──────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '🚀 E-Stage DZ API is running.',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// ─── 7. GLOBAL ERROR HANDLER ──────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[Global Error]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'An unexpected server error occurred.',
  });
});

// ─── 8. 404 CATCH-ALL ─────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.url} not found.` });
});

// ─── 9. START ─────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀  E-Stage DZ Backend running on http://localhost:${PORT}`);
  console.log(`📡  Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌐  CORS allowed for: ${process.env.FRONTEND_URL || 'http://localhost:5173'}\n`);
});

// ─── 10. TEMP: CREATE ADMIN USER ON STARTUP ─────────────────────────────────
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prismaInit = new PrismaClient();
prismaInit.user.findUnique({ where: { email: 'ppproject025@gmail.com' } }).then(async (user) => {
  if (!user) {
    const hashed = await bcrypt.hash('ProjectPP2026', 10);
    await prismaInit.user.create({
      data: {
        email: 'ppproject025@gmail.com',
        password: hashed,
        role: 'admin',
        firstName: 'Admin',
        lastName: 'PP',
        status: 'active',
        avatar: 'https://api.dicebear.com/8.x/initials/svg?seed=AdminPP',
      }
    });
    console.log('✅ Created admin ppproject025@gmail.com');
  } else if (user.role !== 'admin') {
    const hashed = await bcrypt.hash('ProjectPP2026', 10);
    await prismaInit.user.update({
      where: { email: 'ppproject025@gmail.com' },
      data: { role: 'admin', password: hashed }
    });
    console.log('✅ Updated ppproject025@gmail.com to admin');
  }
}).catch(console.error);