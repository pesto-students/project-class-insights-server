import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserBatchSchema = mongoose.Schema({
  instructorId: {
    type: Schema.Types.ObjectId,
    ref: 'instructorsModel',
    required: true,
  },
  batchId: {
    type: String,
    required: true,
    unique: true,
  },
  from: {
    type: Date,
    required: true,
  },
  to: {
    type: Date,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
});

const UserBatchModel = mongoose.model('userBatchModel', UserBatchSchema);

export default UserBatchModel;
