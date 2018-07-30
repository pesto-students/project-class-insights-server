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
  console.log(instructorId);
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
  const oldBatchId = req.params.id;
  // check with the ensure authenticated call to add the email later in the req.body
  // to get the verified person editing the right batch
  const { email } = req.body;
  const getInstructorId = await UserSchema.findOne({ email }, { _id: 1 });
  const instructorId = await InstructorModel.findOne({ loginId: getInstructorId }, { _id: 1 });
  UserBatchModel.findOneAndUpdate({ batchId: oldBatchId, instructorId }, req.body, (err) => {
    if (err) res.json({ error: 'error' });
    res.json({ success: 'Updated the batch ' });
  });
};

const deleteBatch = async (req, res) => {
  // authenticate with the help of ensureauthenticate and get the email from token.
  const { batchId, email } = req.body;
  const getInstructorId = await UserSchema.findOne({ email }, { _id: 1 });
  const instructorId = await InstructorModel.findOne({ loginId: getInstructorId }, { _id: 1 });
  console.log(instructorId, getInstructorId);
  UserBatchModel.findOneAndRemove({ instructorId, batchId }, (err) => {
    if (err) res.json({ error: 'Error deleting Batch' });
    res.json({ success: 'Deleted Succesfully' });
  });
};


export default {
  getBatches,
  createBatch,
  editBatch,
  deleteBatch,
  getBatchesMain,
};
