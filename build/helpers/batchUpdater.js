'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _batches = require('../models/batches.model');

var _batches2 = _interopRequireDefault(_batches);

var _students = require('../models/students.model');

var _students2 = _interopRequireDefault(_students);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const updateStudentCountByBatch = async batchId => {
  let count;
  await _students2.default.find({ batchId }, {}, (err, results) => {
    count = results.length;
  });
  _batches2.default.findOneAndUpdate({ batchId }, { studentCount: count }, err => {
    if (err) {
      console.log('error in updating batch model');
    } else {
      console.log('successfully updated');
    }
  });
};

const updateStudentCount = async () => {
  let map;
  await _students2.default.find({}, {}, (err, results) => {
    map = results.reduce((acc, ele) => {
      if (!acc[ele.batchId]) {
        acc[ele.batchId] = 0;
      }
      acc[ele.batchId] += 1;
      return acc;
    }, {});
  });
  if (map) {
    Object.keys(map).reduce((acc, ele) => {
      _batches2.default.findOneAndUpdate({ batchId: ele }, { studentCount: map[ele] }, err => {
        if (err) {
          console.log('error in updating batch model');
        }
      });
      return acc;
    }, {});
  }
};

exports.default = {
  updateStudentCountByBatch,
  updateStudentCount
};