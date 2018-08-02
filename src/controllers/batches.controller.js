import mongoose from 'mongoose';

import UserBatchModel from '../models/batches.model';
import UserSchema from '../models/user.model';
import instructorController from './instructor.controller';
import InstructorModel from '../models/instructor.model';


const getBatches = async (req, res) => {
  const asc = 1;
  const { email } = req.decoded;
  const getInstructorId = await UserSchema.findOne({ email }, { _id: 1 });
  const instructorId = await InstructorModel.findOne({ loginId: getInstructorId }, { _id: 1 });
  const query = UserBatchModel.find(
    { instructorId }, {},
    { sort: { batchId: asc } },
  )
    .populate('instructorId', 'name');
  await query.exec((err, Batches) => {
    if (err) {
      res.json({ error: err.message });
    } else {
      res.json({ Batches });
    }
  });
};

const getBatchById = async (req, res) => {
  const { batchId } = req.query;
  const query = UserBatchModel.find({ batchId }, {})
    .populate('instructorId', 'name');
  await query.exec((err, Batches) => {
    if (err) {
      res.json({ error: err.message });
    }
    res.json({ Batches });
  });
};

const getBatchesMain = async (req, res) => {
  if (req.query.batchId) {
    getBatchById(req, res);
  } else {
    getBatches(req, res);
  }
};

const createBatch = async (req, res) => {
  const {
    batchId, from, to, status,
  } = req.body;
  const { email } = req.decoded;
  const getInstructorId = await UserSchema.findOne({ email }, { _id: 1 });
  const instructorId = await InstructorModel.findOne({ loginId: getInstructorId }, { _id: 1 });
  const newBatch = new UserBatchModel({
    _id: new mongoose.Types.ObjectId(),
    instructorId,
    batchId,
    from,
    to,
    status,
  });
  try {
    await newBatch.save();
    /* eslint-disable */ // newBatch._id dangling _ problem
    instructorController.addNewBatch(newBatch._id, newBatch.instructorId._id);
    console.log('Batch Created');
    res.json({ success: 'Batch created' });
  } catch (error) {
    res.json({ error: 'Error creating batch' });
  }
};

const editBatch = async (req, res) => {
  const { oldBatchId, status,students, startDate, endDate, batchID } = req.body;
  // check with the ensure authenticated call to add the email later in the req.body
  // to get the verified person editing the right batch
  const { email } = req.decoded;
  const form = {
    studentCount: students,
    batchId: batchID,
    from: startDate,
    to: endDate,
    status: Boolean(status),
  };
  const getInstructorId = await UserSchema.findOne({ email }, { _id: 1 });
  const instructorId = await InstructorModel.findOne({ loginId: getInstructorId }, { _id: 1 });
  UserBatchModel.findOneAndUpdate({ batchId: oldBatchId, instructorId }, form, (err) => {
    if (err) {
      res.json({ error: 'error at finding the batch' });
    } else {
      res.json({ success: 'Batch Updated' });
    }
  });
};

const deleteBatch = async (req, res) => {
  // authenticate with the help of ensureauthenticate and get the email from token.
  const { batchId, email } = req.body;
  try {
    const getInstructorId = await UserSchema.findOne({ email }, { _id: 1 });
    const instructorId = await InstructorModel.findOne({ loginId: getInstructorId }, { _id: 1 });
    
    await UserBatchModel.findOneAndRemove({ instructorId, batchId });
    res.json({ success: 'Deleted Succesfully' });
  } catch(error) {
    res.json({ error: 'Error deleting Batch' });
  }
};


export default {
  getBatches,
  createBatch,
  editBatch,
  deleteBatch,
  getBatchesMain,
};
