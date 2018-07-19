import mongoose from 'mongoose';

const UserBatchSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  batchId: String,
});

const UserBatchModel = mongoose.model('userBatchModel', UserBatchSchema);

export default UserBatchModel;
