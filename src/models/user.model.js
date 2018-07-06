import mongoose from 'mongoose';

const Schema = mongoose.Schema(
  {
    name: { type: String },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      index: true,
      unique: true,
      sparse: true,
    },
    password: { type: String },
    created_at: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const UserSchema = mongoose.model('User', Schema);

export default UserSchema;
