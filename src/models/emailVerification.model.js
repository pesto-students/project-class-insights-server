import mongoose from 'mongoose';

const emailVerifySchema = new mongoose.Schema({
  _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  token: { type: String, required: true },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: 43200,
  },
});

const EmailVerify = mongoose.model('EmailVerify', emailVerifySchema);

export default EmailVerify;
