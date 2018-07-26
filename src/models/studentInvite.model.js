import mongoose from 'mongoose';

const studentInviteSchema = new mongoose.Schema({
  email: { type: String, required: true },
  batchId: { type: String },
  token: { type: String, required: true },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const StudentInvite = mongoose.model('StudentInvite', studentInviteSchema);

export default StudentInvite;
