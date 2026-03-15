// const express = require('express');
// const router = express.Router();
// const passport = require('passport');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
// const User = require('../models/User');
// const wrapAsync = require('../utils/wrapAsync');
// const ExpressError = require('../utils/ExpressError');
// const { validateRegister, validateLogin } = require('../middleware/validate');
// const { protect } = require('../middleware/auth');

// // Helper: generate JWT
// const signToken = (id) =>
//   jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

// const sendTokenResponse = (user, statusCode, res) => {
//   const token = signToken(user._id);
//   const userObj = user.toObject();
//   delete userObj.password;
//   res.status(statusCode).json({ success: true, token, user: userObj });
// };

// // ── Register ───────────────────────────────────────────────────────────────
// router.post(
//   '/register',
//   validateRegister,
//   wrapAsync(async (req, res, next) => {
//     const { name, email, password } = req.body;
//     const existing = await User.findOne({ email });
//     if (existing) return next(new ExpressError('Email already registered.', 400));

//     const user = await User.create({ name, email, password });
//     sendTokenResponse(user, 201, res);
//   })
// );

// // ── Login ──────────────────────────────────────────────────────────────────
// router.post(
//   '/login',
//   validateLogin,
//   (req, res, next) => {
//     passport.authenticate('local', { session: false }, (err, user, info) => {
//       if (err) return next(err);
//       if (!user) return next(new ExpressError(info?.message || 'Login failed.', 401));
//       sendTokenResponse(user, 200, res);
//     })(req, res, next);
//   }
// );

// // ── Google OAuth ───────────────────────────────────────────────────────────
// router.get(
//   '/google',
//   passport.authenticate('google', { scope: ['profile', 'email'], session: false })
// );

// router.get(
//   '/google/callback',
//   passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login?error=google` }),
//   (req, res) => {
//     const token = signToken(req.user._id);
//     // Redirect to frontend with token in query (frontend stores it)
//     res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}`);
//   }
// );

// // ── Get current user ───────────────────────────────────────────────────────
// router.get(
//   '/me',
//   protect,
//   wrapAsync(async (req, res) => {
//     const user = await User.findById(req.user._id).populate('savedProperties', 'title price location images');
//     res.json({ success: true, user });
//   })
// );

// // ── Update profile ─────────────────────────────────────────────────────────
// router.put(
//   '/me',
//   protect,
//   wrapAsync(async (req, res, next) => {
//     const allowedFields = ['name', 'phone', 'avatar'];
//     const updates = {};
//     allowedFields.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

//     const user = await User.findByIdAndUpdate(req.user._id, updates, {
//       new: true,
//       runValidators: true,
//     });
//     res.json({ success: true, user });
//   })
// );

// // ── Change password ────────────────────────────────────────────────────────
// router.put(
//   '/change-password',
//   protect,
//   wrapAsync(async (req, res, next) => {
//     const { currentPassword, newPassword } = req.body;
//     if (!currentPassword || !newPassword)
//       return next(new ExpressError('Please provide current and new password.', 400));

//     const user = await User.findById(req.user._id).select('+password');
//     if (!user.password)
//       return next(new ExpressError('This account uses Google login. No password to change.', 400));

//     const isMatch = await bcrypt.compare(currentPassword, user.password);
//     if (!isMatch) return next(new ExpressError('Current password is incorrect.', 401));

//     user.password = newPassword;
//     await user.save();
//     sendTokenResponse(user, 200, res);
//   })
// );

// // ── Save / unsave property ─────────────────────────────────────────────────
// router.post(
//   '/save-property/:propertyId',
//   protect,
//   wrapAsync(async (req, res) => {
//     const user = await User.findById(req.user._id);
//     const pid = req.params.propertyId;
//     const idx = user.savedProperties.indexOf(pid);

//     if (idx === -1) {
//       user.savedProperties.push(pid);
//     } else {
//       user.savedProperties.splice(idx, 1);
//     }
//     await user.save();
//     res.json({ success: true, saved: idx === -1, savedProperties: user.savedProperties });
//   })
// );

// module.exports = router;


const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const { validateRegister, validateLogin } = require('../middleware/validate');
const { protect } = require('../middleware/auth');

// Helper: generate JWT
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

const sendTokenResponse = (user, statusCode, res) => {
  const token = signToken(user._id);
  const userObj = user.toObject();
  delete userObj.password;
  res.status(statusCode).json({ success: true, token, user: userObj });
};

// ── Register ───────────────────────────────────────────────────────────────
router.post(
  '/register',
  validateRegister,
  wrapAsync(async (req, res, next) => {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return next(new ExpressError('Email already registered.', 400));
    const user = await User.create({ name, email, password });
    sendTokenResponse(user, 201, res);
  })
);

// ── Login ──────────────────────────────────────────────────────────────────
router.post(
  '/login',
  validateLogin,
  (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err) return next(err);
      if (!user) return next(new ExpressError(info?.message || 'Login failed.', 401));
      sendTokenResponse(user, 200, res);
    })(req, res, next);
  }
);

// ── GitHub OAuth ───────────────────────────────────────────────────────────
router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'], session: false })
);

router.get(
  '/github/callback',
  passport.authenticate('github', {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=github`,
  }),
  (req, res) => {
    const token = signToken(req.user._id);
    res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}`);
  }
);

// ── Get current user ───────────────────────────────────────────────────────
router.get(
  '/me',
  protect,
  wrapAsync(async (req, res) => {
    const user = await User.findById(req.user._id).populate(
      'savedProperties',
      'title price location images'
    );
    res.json({ success: true, user });
  })
);

// ── Update profile ─────────────────────────────────────────────────────────
router.put(
  '/me',
  protect,
  wrapAsync(async (req, res) => {
    const allowedFields = ['name', 'phone', 'avatar'];
    const updates = {};
    allowedFields.forEach((f) => {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    });
    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });
    res.json({ success: true, user });
  })
);

// ── Change password ────────────────────────────────────────────────────────
router.put(
  '/change-password',
  protect,
  wrapAsync(async (req, res, next) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return next(new ExpressError('Please provide current and new password.', 400));

    const user = await User.findById(req.user._id).select('+password');
    if (!user.password)
      return next(new ExpressError('This account uses GitHub login. No password to change.', 400));

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return next(new ExpressError('Current password is incorrect.', 401));

    user.password = newPassword;
    await user.save();
    sendTokenResponse(user, 200, res);
  })
);

// ── Save / unsave property ─────────────────────────────────────────────────
router.post(
  '/save-property/:propertyId',
  protect,
  wrapAsync(async (req, res) => {
    const user = await User.findById(req.user._id);
    const pid = req.params.propertyId;
    const idx = user.savedProperties.indexOf(pid);
    if (idx === -1) {
      user.savedProperties.push(pid);
    } else {
      user.savedProperties.splice(idx, 1);
    }
    await user.save();
    res.json({ success: true, saved: idx === -1, savedProperties: user.savedProperties });
  })
);

module.exports = router;