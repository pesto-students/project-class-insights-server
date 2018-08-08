import FeedbackformModel from '../models/feedbackform.model';
import UserSchema from '../models/user.model';
import UserBatchModel from '../models/batches.model';
import analyseFeedbacks from '../helpers/analyseFeedbacks';

const createForm = async (req, res) => {
  const {
    batchId, date, subject, topic,
  } = req.body;
  const { email } = req.decoded;
  let userId;
  let batchIdRef;
  try {
    const getUserId = await UserSchema.findOne({ email }, { _id: 1 });
    const batchReferenceId = await UserBatchModel.findOne({ batchId }, { _id: 1 });
    userId = getUserId;
    batchIdRef = batchReferenceId;
  } catch (error) {
    console.error('error at creating form');
    res.json({ error: 'batch does not exist' });
  }

  const newForm = new FeedbackformModel({
    subject,
    topic,
    creationDate: new Date(date),
    batchId: batchIdRef,
    userId,
    subtopics: req.body.subtopics.reduce((acc, curr) => {
      return [...acc, { subtopicName: curr.subtopicName },
      ];
    }, []),
  });
  try {
    await newForm.save();
    analyseFeedbacks.setInitialResults();
    console.log('form successfully saved');
    res.json({ success: 'Form saved successfully' });
  } catch (error) {
    if (error.message.includes('subject: Path `subject` is required.')) {
      res.status(422);
      res.json({ error: 'subject field is required' });
    }
    if (error.message.includes('topic: Path `topic` is required')) {
      res.status(422);
      res.json({ error: 'Topic field is required' });
    }
    console.log(error.message);
  }
};

export default { createForm };
