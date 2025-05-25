import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    token: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: 'User',
    },
    about: {
      type: String,
      default: null,
    },
    photo: {
      type: String,
      default: null,
    },
    verify: {
      type: Boolean,
      default: function () {
        return !!this.googleId;
      },
    },
    verificationToken: {
      type: String,
      required: function () {
        return !this.googleId;
      },
    },
    
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export default mongoose.model('User', userSchema);
