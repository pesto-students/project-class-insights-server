import mongoose from 'mongoose';

const { Schema } = mongoose;

const subtopic = mongoose.Schema({
  subtopicName: String,
  rating: [Number],
});


const feedbackFormSchema = mongoose.Schema({
  date: { type: Date, default: Date.now },
  subject: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  subtopics: [subtopic],
  creationDate: {
    type: Date,
  },
  batchId: {
    type: Schema.Types.ObjectId,
    ref: 'userBatchModel',
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const FeedbackFormModel = mongoose.model('feedbackFormModel', feedbackFormSchema);

export default FeedbackFormModel;
