import mongoose from 'mongoose';

import getFromController from '../src/controllers/getFromController';
import CONSTANTS from '../src/lib/constants';

describe('forms', () => {
  beforeAll(async () => {
    await mongoose.connect(CONSTANTS.DB_URI, { useNewUrlParser: true });
  });
  it('get user details', async () => {
    const email = 'tanysingh09@gmail.com';
    const result = await getFromController.getUserDetails(email);
    const expected = {
      _id: '5b61cd881fdda000144010cb',
      isInstructor: true,
    };
    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
  });
});
