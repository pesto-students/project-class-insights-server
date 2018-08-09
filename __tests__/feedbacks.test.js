import mongoose from 'mongoose';

import feedbacksController from '../src/controllers/feedbacks.controller';
import CONSTANTS from '../src/lib/constants';

describe('feedbacks', () => {
  beforeAll(async () => {
    await mongoose.connect(CONSTANTS.DB_URI, { useNewUrlParser: true });
  });
  it('should set the status of feedback as active or inactive', async () => {
    const email = 'tanysingh09@gmail.com';
    const body = {
      formId: new mongoose.Types.ObjectId('5b61cf891fdda000144010d8'),
      isActive: true,
    };
    await feedbacksController.setStatusHere(body, email);
  });
});
