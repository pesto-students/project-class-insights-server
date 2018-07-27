import mongoose from 'mongoose';

const { Schema } = mongoose;

const StudentSchema = mongoose.Schema({
  batchId: {
    type: Schema.Types.ObjectId,
    ref: 'userBatchModel',
  },
  name: {
    type: String,
    default: '',
  },
  studentObjectId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: new mongoose.Types.ObjectId(),
  },
  email: String,
}, { strict: false });

const StudentModel = mongoose.model('studentsModel', StudentSchema);

export default StudentModel;
