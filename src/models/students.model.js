import mongoose from 'mongoose';

const { Schema } = mongoose;

const StudentSchema = mongoose.Schema({
  batchId: {
    type: Schema.Types.ObjectId,
    ref: 'userBatchModel',
    // unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  studentObjectId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { strict: false });

const StudentModel = mongoose.model('studentModel', StudentSchema);

export default StudentModel;
