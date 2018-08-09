import mongoose from 'mongoose';

import UserBatchModel from '../models/batches.model';
import UserSchema from '../models/user.model';
import instructorController from './instructor.controller';
import InstructorModel from '../models/instructor.model';

const getBatches = async (email) => {
  const asc = 1;
  const getInstructorId = await UserSchema.findOne({ email }, { _id: 1 });
  const instructorId = await InstructorModel.findOne({ loginId: getInstructorId }, { _id: 1 });
  return UserBatchModel
    .find({ instructorId }, {}, { sort: { batchId: asc } })
    .populate('instructorId', 'name')
    .exec();
};

const getBatchById = batchId => UserBatchModel
  .find({ batchId }, {})
  .populate('instructorId', 'name')
  .exec();

const getBatchesMain = async (req, res) => {
  try {
    const isBatchId = req.query.batchId !== undefined;
    const Batches = isBatchId
      ? await getBatchById(req.query.batchId)
      : await getBatches(req.decoded.email);
    res.json({ Batches });
  } catch (error) {
    res.json({ error: error.message });
  }
};

const createBatchHere = async (body, email) => {
  const {
    batchId, from, to, status,
  } = body;
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
  await newBatch.save();
  /* eslint-disable no-underscore-dangle */
  instructorController.addNewBatch(newBatch._id, newBatch.instructorId._id);
};

const createBatch = async (req, res) => {
  try {
    await createBatchHere(req.body, req.decoded.email);
    console.log('Batch Created');
    res.json({ success: 'Batch created' });
  } catch (error) {
    res.json({ error: 'Error creating batch' });
  }
};

const editBatchHere = async (body, email) => {
  const {
    oldBatchId, status, students, startDate, endDate, batchID,
  } = body;
  const form = {
    studentCount: students,
    batchId: batchID,
    from: startDate,
    to: endDate,
    status: Boolean(status),
  };
  const getInstructorId = await UserSchema.findOne({ email }, { _id: 1 });
  const instructorId = await InstructorModel.findOne({ loginId: getInstructorId }, { _id: 1 });
  await UserBatchModel.findOneAndUpdate({ batchId: oldBatchId, instructorId }, form);
};

const editBatch = async (req, res) => {
  try {
    await editBatchHere(req.body, req.decoded.email);
    res.json({ success: 'Batch Updated' });
  } catch (error) {
    res.json({ error: 'error at finding the batch' });
  }
};

const deleteBatchHere = async (body, email) => {
  const { batchId } = body;
  const getInstructorId = await UserSchema.findOne({ email }, { _id: 1 });
  const instructorId = await InstructorModel.findOne({ loginId: getInstructorId }, { _id: 1 });
  await UserBatchModel.findOneAndRemove({ instructorId, batchId });
};

const deleteBatch = async (req, res) => {
  // authenticate with the help of ensureauthenticate and get the email from token.
  try {
    await deleteBatchHere(req.body, req.decoded.email);
    res.json({ success: 'Deleted Succesfully' });
  } catch (error) {
    res.json({ error: 'Error deleting Batch' });
  }
};


export default {
  getBatches,
  getBatchById,
  getBatchesMain,
  createBatch,
  createBatchHere,
  editBatch,
  editBatchHere,
  deleteBatch,
  deleteBatchHere,
};
