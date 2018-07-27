'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _instructor = require('../models/instructor.model');

var _instructor2 = _interopRequireDefault(_instructor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createInstructor = async (namePassed, _id) => {
  const name = namePassed;
  const loginId = _id;
  const newInstructor = new _instructor2.default({
    name,
    loginId
  });
  try {
    await newInstructor.save();
  } catch (error) {
    console.log(error);
    console.log('error in creating instructor');
  }
};

const addNewBatch = async (_id, loginId) => {
  await _instructor2.default.findOneAndUpdate({ loginId }, { $addToSet: { batches: _id } }, err => {
    if (err) {
      console.log('error in adding new batch to the instructor model');
    }
  });
};

exports.default = {
  createInstructor,
  addNewBatch
};