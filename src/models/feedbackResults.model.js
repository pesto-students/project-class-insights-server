import mongoose from 'mongoose';

const { Schema } = mongoose;

const feedbackFormResultsSchema = mongoose.Schema({
  subject: {
    type: String,
  },
  topic: String,
  batchId: {
    type: Schema.Types.ObjectId,
    ref: 'userBatchModel',
  },
  averageRatings: Object,
  feedbackCounts: Number,
  creationDate: Date,
  comments: [String],
  feedbackForm_ID: {
    type: Schema.Types.ObjectId,
    ref: 'feedbackFormModel',
  },
  revisitCount: {
    type: Number,
    default: 0,
  },
});

const FeedbackFormResultsModel = mongoose.model('feedbackFormResultsModel', feedbackFormResultsSchema);

export default FeedbackFormResultsModel;
