// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const JwtStrategy = require('passport-jwt').Strategy;
// const ExtractJwt = require('passport-jwt').ExtractJwt;
// const bcrypt = require('bcryptjs');
// const User = require('../models/User');

// // ── Local Strategy ─────────────────────────────────────────────────────────
// passport.use(
//   new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
//     try {
//       const user = await User.findOne({ email }).select('+password');
//       if (!user) return done(null, false, { message: 'No account found with that email.' });
//       if (!user.password) return done(null, false, { message: 'Please login with Google.' });

//       const isMatch = await bcrypt.compare(password, user.password);
//       if (!isMatch) return done(null, false, { message: 'Incorrect password.' });

//       return done(null, user);
//     } catch (err) {
//       return done(err);
//     }
//   })
// );

// // ── JWT Strategy ───────────────────────────────────────────────────────────
// passport.use(
//   new JwtStrategy(
//     {
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       secretOrKey: process.env.JWT_SECRET,
//     },
//     async (payload, done) => {
//       try {
//         const user = await User.findById(payload.id);
//         if (!user) return done(null, false);
//         return done(null, user);
//       } catch (err) {
//         return done(err, false);
//       }
//     }
//   )
// );

// // ── Google OAuth Strategy ──────────────────────────────────────────────────
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: process.env.GOOGLE_CALLBACK_URL,
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         let user = await User.findOne({ googleId: profile.id });

//         if (!user) {
//           // Check if email already registered locally
//           user = await User.findOne({ email: profile.emails[0].value });
//           if (user) {
//             user.googleId = profile.id;
//             if (!user.avatar) user.avatar = profile.photos[0].value;
//             await user.save();
//           } else {
//             user = await User.create({
//               googleId: profile.id,
//               name: profile.displayName,
//               email: profile.emails[0].value,
//               avatar: profile.photos[0].value,
//             });
//           }
//         }

//         return done(null, user);
//       } catch (err) {
//         return done(err, false);
//       }
//     }
//   )
// );

// passport.serializeUser((user, done) => done(null, user.id));
// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findById(id);
//     done(null, user);
//   } catch (err) {
//     done(err);
//   }
// });

// module.exports = passport;

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// ── Local Strategy ─────────────────────────────────────────────────────────
passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = await User.findOne({ email }).select('+password');
      if (!user) return done(null, false, { message: 'No account found with that email.' });
      if (!user.password) return done(null, false, { message: 'Please login with GitHub.' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return done(null, false, { message: 'Incorrect password.' });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

// ── JWT Strategy ───────────────────────────────────────────────────────────
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (payload, done) => {
      try {
        const user = await User.findById(payload.id);
        if (!user) return done(null, false);
        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

// ── GitHub OAuth Strategy ──────────────────────────────────────────────────
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ['user:email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Get primary email from GitHub
        const email =
          profile.emails?.[0]?.value ||
          `${profile.username}@github.com`;

        const avatar =
          profile.photos?.[0]?.value ||
          `https://avatars.githubusercontent.com/u/${profile.id}`;

        // Check if user already exists with GitHub ID
        let user = await User.findOne({ githubId: profile.id });

        if (!user) {
          // Check if email already registered locally
          user = await User.findOne({ email });
          if (user) {
            // Link GitHub to existing account
            user.githubId = profile.id;
            if (!user.avatar || user.avatar.includes('randomuser')) {
              user.avatar = avatar;
            }
            await user.save();
          } else {
            // Create brand new user
            user = await User.create({
              githubId: profile.id,
              name: profile.displayName || profile.username,
              email,
              avatar,
            });
          }
        }

        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;