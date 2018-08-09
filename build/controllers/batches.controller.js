'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _batches = require('../models/batches.model');

var _batches2 = _interopRequireDefault(_batches);

var _user = require('../models/user.model');

var _user2 = _interopRequireDefault(_user);

var _instructor = require('./instructor.controller');

var _instructor2 = _interopRequireDefault(_instructor);

var _instructor3 = require('../models/instructor.model');

var _instructor4 = _interopRequireDefault(_instructor3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getBatches = async email => {
  const asc = 1;
  const getInstructorId = await _user2.default.findOne({ email }, { _id: 1 });
  const instructorId = await _instructor4.default.findOne({ loginId: getInstructorId }, { _id: 1 });
  return _batches2.default.find({ instructorId }, {}, { sort: { batchId: asc } }).populate('instructorId', 'name').exec();
};

const getBatchById = batchId => _batches2.default.find({ batchId }, {}).populate('instructorId', 'name').exec();

const getBatchesMain = async (req, res) => {
  try {
    const isBatchId = req.query.batchId !== undefined;
    const Batches = isBatchId ? await getBatchById(req.query.batchId) : await getBatches(req.decoded.email);
    res.json({ Batches });
  } catch (error) {
    res.json({ error: error.message });
  }
};

const createBatchHere = async (body, email) => {
  const {
    batchId, from, to, status
  } = body;
  const getInstructorId = await _user2.default.findOne({ email }, { _id: 1 });
  const instructorId = await _instructor4.default.findOne({ loginId: getInstructorId }, { _id: 1 });
  const newBatch = new _batches2.default({
    _id: new _mongoose2.default.Types.ObjectId(),
    instructorId,
    batchId,
    from,
    to,
    status
  });
  await newBatch.save();
  /* eslint-disable no-underscore-dangle */
  _instructor2.default.addNewBatch(newBatch._id, newBatch.instructorId._id);
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
    oldBatchId, status, students, startDate, endDate, batchID
  } = body;
  const form = {
    studentCount: students,
    batchId: batchID,
    from: startDate,
    to: endDate,
    status: Boolean(status)
  };
  const getInstructorId = await _user2.default.findOne({ email }, { _id: 1 });
  const instructorId = await _instructor4.default.findOne({ loginId: getInstructorId }, { _id: 1 });
  await _batches2.default.findOneAndUpdate({ batchId: oldBatchId, instructorId }, form);
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
  const getInstructorId = await _user2.default.findOne({ email }, { _id: 1 });
  const instructorId = await _instructor4.default.findOne({ loginId: getInstructorId }, { _id: 1 });
  await _batches2.default.findOneAndRemove({ instructorId, batchId });
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

exports.default = {
  getBatches,
  getBatchById,
  getBatchesMain,
  createBatch,
  createBatchHere,
  editBatch,
  editBatchHere,
  deleteBatch,
  deleteBatchHere
};