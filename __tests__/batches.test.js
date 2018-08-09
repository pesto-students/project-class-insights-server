import mongoose from 'mongoose';
import CONSTANTS from '../src/lib/constants';
import batchesController from '../src/controllers/batches.controller';

describe('batches', () => {
  beforeAll(async () => {
    await mongoose.connect(CONSTANTS.DB_URI, { useNewUrlParser: true });
  });
  it('should return the batch by it\'s ID', async () => {
    const result = await batchesController.getBatchById('Pesto-01');
    const expected = {
      studentCount: 4,
      _id: '5b5e94b0fd12b10014f325e3',
      instructorId: {
        _id: '5b5d7e9bc2413d3a63c867e5',
        name: 'monis',
      },
      batchId: 'Pesto-01',
      from: new Date('2018-06-04T00:00:00.000Z'),
      to: new Date('2018-08-24T00:00:00.000Z'),
      status: true,
      __v: 0,
    };
    expect(JSON.stringify(result[0])).toBe(JSON.stringify(expected));
  });

  it('should return all the batches when authenticated user is provided', async () => {
    const result = await batchesController.getBatches('aayushjaiswal07@gmail.com');
    const expected = [{
      studentCount: 3,
      _id: '5b5ef2eed31dce00140f73ef',
      instructorId: {
        _id: '5b5ef1fcd31dce00140f73ed',
        name: 'Ayush Jaiswal',
      },
      batchId: 'ayush',
      from: new Date('2018-07-19T00:00:00.000Z'),
      to: new Date('2018-12-05T00:00:00.000Z'),
      status: true,
      __v: 0,
    },
    ];
    expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
  });

  it('should return an empty array when unauthorised email is passed', async () => {
    const result = await batchesController.getBatches('aditya@gmail.com');
    const expected = [];
    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
  });

  it('should return an empty array when batch doesn\'t exist', async () => {
    const result = await batchesController.getBatchById('Test-12');
    const expected = [];
    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
  });

  it('should create a batch successfully', async () => {
    const randomNumber = Math.floor(100000 + (Math.random() * 900000));
    const batchDetails = {
      batchId: `Pestorandomtest${randomNumber}`,
      from: new Date(),
      to: new Date(),
      status: Boolean(1),
    };
    const email = 'monis.ahmad42@gmail.com';
    await batchesController.createBatchHere(batchDetails, email);
  });

  it('should edit the batch details successfully when authorised email is entered', async () => {
    const batchDetails = {
      oldBatchId: 'Pesto-02',
      status: Boolean(0),
      students: 0,
      startDate: new Date(),
      endDate: new Date(),
      batchId: 'Pesto-02',
    };
    const email = 'monis.ahmad42@gmail.com';
    await batchesController.editBatchHere(batchDetails, email);
  });

  it('should delete the batch successfully if the user is authorised', async () => {
    const body = {
      batchId: 'Test',
    };
    const email = 'monis.ahmad42@gmail.com';
    await batchesController.deleteBatchHere(body, email);
  });
});
