'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _batches = require('../models/batches.model');

var _batches2 = _interopRequireDefault(_batches);

var _students = require('../models/students.model');

var _students2 = _interopRequireDefault(_students);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const updateStudentCount = async () => {
  const results = await _students2.default.find({}, {});
  const map = results.reduce((acc, ele) => {
    ele.batchId.forEach(ele2 => {
      if (!acc[ele2]) {
        acc[ele2] = 0;
      }
      acc[ele2] += 1;
    });
    return acc;
  }, {});
  if (map) {
    Object.keys(map).reduce(async (acc, ele) => {
      const studentCount = map[ele];
      try {
        await _batches2.default.findOneAndUpdate({ _id: ele }, { studentCount });
      } catch (error) {
        console.log('error at student count updater');
      }
      return acc;
    }, {});
  }
};

exports.default = {
  updateStudentCount
};