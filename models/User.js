// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, 'Name is required'],
//       trim: true,
//       maxlength: [50, 'Name cannot exceed 50 characters'],
//     },
//     email: {
//       type: String,
//       required: [true, 'Email is required'],
//       unique: true,
//       lowercase: true,
//       trim: true,
//       match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
//     },
//     password: {
//       type: String,
//       minlength: [6, 'Password must be at least 6 characters'],
//       select: false,
//     },
//     googleId: {
//       type: String,
//       default: null,
//     },
//     avatar: {
//       type: String,
//       default: 'https://res.cloudinary.com/demo/image/upload/v1/samples/people/smiling-man.jpg',
//     },
//     role: {
//       type: String,
//       enum: ['user', 'agent', 'admin'],
//       default: 'user',
//     },
//     phone: {
//       type: String,
//       default: '',
//     },
//     savedProperties: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Property',
//       },
//     ],
//   },
//   { timestamps: true }
// );

// // Hash password before saving
// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password') || !this.password) return next();
//   this.password = await bcrypt.hash(this.password, 12);
//   next();
// });

// module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    githubId: {
      type: String,
      default: null,
    },
    avatar: {
      type: String,
      default: 'https://avatars.githubusercontent.com/u/0',
    },
    role: {
      type: String,
      enum: ['user', 'agent', 'admin'],
      default: 'user',
    },
    phone: {
      type: String,
      default: '',
    },
    savedProperties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
      },
    ],
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model('User', userSchema);