import mongoose from 'mongoose';

import dashboardController from '../src/controllers/dashboard.controller';
import CONSTANTS from '../src/lib/constants';


describe('dashboard should return all the results', () => {
  beforeAll(async () => {
    await mongoose.connect(CONSTANTS.DB_URI, { useNewUrlParser: true });
  });
  it('should give calculated results for the authorised person', async () => {
    const email = 'tanysingh09@gmail.com';
    const expected = {
      comments: ['nice'],
      revisitCount: 1,
      isActive: true,
      _id: '5b61cf891fdda000144010da',
      subject: 'Js Bootcmap',
      topic: 'arrays',
      batchId: '5b61ce1f1fdda000144010cf',
      averageRatings: {
        strings: 8,
      },
      feedbackCounts: 1,
      creationDate: new Date('2018-07-30T00:00:00.000Z'),
      feedbackForm_ID: '5b61cf891fdda000144010d8',
      __v: 0,
    };
    const result = await dashboardController.receiveResults(email);
    expect(JSON.stringify(result[0])).toBe(JSON.stringify(expected));
  });

  it('should return null, when a non authorised email is provided', async () => {
    const email = 'tanusingh09@gmail.com';
    const result = await dashboardController.receiveResults(email);
    expect(result).toBe(null);
  });

  it('should return nulll when a student is passed', async () => {
    const email = 'ajlin500@gmail.com';
    const result = await dashboardController.receiveResults(email);
    expect(result).toBe(null);
  });
});
