'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _user = require('../models/user.model');

var _user2 = _interopRequireDefault(_user);

var _instructor = require('../models/instructor.model');

var _instructor2 = _interopRequireDefault(_instructor);

var _feedbackResults = require('../models/feedbackResults.model');

var _feedbackResults2 = _interopRequireDefault(_feedbackResults);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// topbackic subtopic average rating feed counts

const getResults = async (req, res) => {
  const { email } = req.decoded;
  const isActive = true;
  // set active = true to get active results or set as inactive to get all the results
  const user = await _user2.default.findOne({ email }, {});
  /* eslint-disable */
  const instructor = await _instructor2.default.findOne({ loginId: user._id }, {});
  if (instructor) {
    const batchesArray = instructor.batches;
    const results = await batchesArray.reduce(async (promise, ele) => {
      const acc = await promise;
      const result = await _feedbackResults2.default.find({ batchId: ele, isActive }, {});
      if (result.length !== 0) {
        acc.push(...result);
        console.log(result);
      }
      return acc;
    }, Promise.resolve([]));
    res.json(results);
  }
};

exports.default = {
  getResults
};