import mongoose from 'mongoose';

const subtopic = mongoose.Schema({
  subtopicName: String,
  rating: Number,
});


const feedbackSubmissionSchema = mongoose.Schema({
  date: { type: Date, default: Date.now },
  feedbackForm_ID: {
    type: String,
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
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  batchId: String,
  subtopics: [subtopic],
  comments: String,
});

const FeedbackSubmissionModel = mongoose.model('feedbackSubmissionModel', feedbackSubmissionSchema);

export default FeedbackSubmissionModel;
