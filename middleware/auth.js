const passport = require('passport');
const ExpressError = require('../utils/ExpressError');

// Protect routes — require valid JWT
const protect = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) return next(err);
    if (!user) return next(new ExpressError('Not authenticated. Please log in.', 401));
    req.user = user;
    next();
  })(req, res, next);
};

// Role-based authorization
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ExpressError('You are not authorized to perform this action.', 403));
    }
    next();
  };
};

// Ownership check — user must own the resource
const isOwner = (Model) => async (req, res, next) => {
  try {
    const doc = await Model.findById(req.params.id);
    if (!doc) return next(new ExpressError('Resource not found.', 404));
    if (!doc.owner.equals(req.user._id) && req.user.role !== 'admin') {
      return next(new ExpressError('You do not own this resource.', 403));
    }
    req.doc = doc;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { protect, authorize, isOwner };
