import mongoose from 'mongoose';

const subtopic = mongoose.Schema({
  subtopicName: String,
  rating: [Number],
});

const comment = mongoose.Schema({
  commentMessage: String,
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
  comments: [comment],
  creationDate: {
    type: String,
  },
  batchId: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
});

const FeedbackFormModel = mongoose.model('feedbackFormModel', feedbackFormSchema);

export default FeedbackFormModel;
