/* eslint-disable */
// The pre middleware doesn't seem to work as expected due to lexical
// binding of the this variable when using arrow functions (ES6).
// https://github.com/Automattic/mongoose/issues/4816

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { isEmail } from 'validator';

const Schema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      index: true,
      unique: true,
      sparse: true,
      required: true,
      validate: [isEmail, 'invalid email'],
    },
    password: {
      type: String,
      minlength: 8,
      required: true,
    },
    created_at: { type: Date, default: Date.now },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true },
);

Schema.pre('save', function (next) {
  const user = this;
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }
    user.password = hash
    next();
  });
});
const UserSchema = mongoose.model('User', Schema);

export default UserSchema;
