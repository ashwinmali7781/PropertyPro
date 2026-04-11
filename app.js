require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('./config/passport');
const connectDB = require('./init/index');
const ExpressError = require('./utils/ExpressError');

const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/properties');

const app = express();

// ── Connect Database ───────────────────────────────────────────────────────
connectDB();

// ── Middleware ─────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session (needed for Google OAuth redirect flow)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
}));

app.use(passport.initialize());
app.use(passport.session());

// ── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Property Pro API is running 🚀' });
});

// ── 404 Handler ────────────────────────────────────────────────────────────
app.all('*', (req, res, next) => {
  next(new ExpressError(`Route ${req.originalUrl} not found`, 404));
});

// ── Global Error Handler ───────────────────────────────────────────────────
app.use((err, req, res, next) => {
  const { statusCode = 500, message = 'Something went wrong' } = err;
  console.error(`[ERROR] ${statusCode} - ${message}`);
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ── Start Server ───────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV}`);
});
