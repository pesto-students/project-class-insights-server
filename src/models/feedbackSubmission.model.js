import mongoose from 'mongoose';

const subtopic = mongoose.Schema({
  subtopicName: String,
  rating: Number,
});

const { Schema } = mongoose;

const feedbackSubmissionSchema = mongoose.Schema({
  date: { type: Date, default: Date.now },
  feedbackForm_ID: {
    type: Schema.Types.ObjectId,
    ref: 'feedbackFormModel',
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  creationDate: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  batchId: {
    type: Schema.Types.ObjectId,
    ref: 'userBatchModel',
  },
  subtopics: [subtopic],
  comments: String,
  revisit: {
    type: Boolean,
    default: false,
  },
});

const FeedbackSubmissionModel = mongoose.model('feedbackSubmissionModel', feedbackSubmissionSchema);

export default FeedbackSubmissionModel;
