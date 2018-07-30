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

const getBatches = async (req, res) => {
  const asc = 1;
  const { email } = req.decoded;
  const getInstructorId = await _user2.default.findOne({ email }, { _id: 1 });
  const instructorId = await _instructor4.default.findOne({ loginId: getInstructorId }, { _id: 1 });
  const query = _batches2.default.find({ instructorId }, {}, { sort: { batchId: asc } }).populate('instructorId', 'name');
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
  const query = _batches2.default.find({ batchId }, {}).populate('instructorId', 'name');
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
    batchId, from, to, status
  } = req.body;
  const { email } = req.decoded;
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
  try {
    await newBatch.save();
    /* eslint-disable */ // newBatch._id dangling _ problem
    _instructor2.default.addNewBatch(newBatch._id, newBatch.instructorId._id);
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
  const getInstructorId = await _user2.default.findOne({ email }, { _id: 1 });
  const instructorId = await _instructor4.default.findOne({ loginId: getInstructorId }, { _id: 1 });
  _batches2.default.findOneAndUpdate({ batchId: oldBatchId, instructorId }, req.body, err => {
    if (err) res.json({ error: 'error' });
    res.json({ success: 'Updated the batch ' });
  });
};

const deleteBatch = async (req, res) => {
  // authenticate with the help of ensureauthenticate and get the email from token.
  const { batchId, email } = req.body;
  const getInstructorId = await _user2.default.findOne({ email }, { _id: 1 });
  const instructorId = await _instructor4.default.findOne({ loginId: getInstructorId }, { _id: 1 });
  console.log(instructorId, getInstructorId);
  _batches2.default.findOneAndRemove({ instructorId, batchId }, err => {
    if (err) res.json({ error: 'Error deleting Batch' });
    res.json({ success: 'Deleted Succesfully' });
  });
};

exports.default = {
  getBatches,
  createBatch,
  editBatch,
  deleteBatch,
  getBatchesMain
};