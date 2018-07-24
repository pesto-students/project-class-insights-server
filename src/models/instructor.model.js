import mongoose from 'mongoose';

const { Schema } = mongoose;

const Instructor = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  loginId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  batches: {
    type: [Schema.Types.ObjectId],
    ref: 'userBatchModel',
  },
});

const InstructorModel = mongoose.model('instructorsModel', Instructor);

export default InstructorModel;
