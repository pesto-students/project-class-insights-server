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

const receiveResults = async email => {
  const isActive = true;

  // set active = true to get active results or set as inactive to get all the results
  const user = await _user2.default.findOne({ email }, {});
  const isUser = !(user === null);
  if (isUser) {
    /* eslint-disable no-underscore-dangle */
    const instructor = await _instructor2.default.findOne({ loginId: user._id }, {});
    if (instructor) {
      const batchesArray = instructor.batches;
      const results = await batchesArray.reduce(async (promise, ele) => {
        const acc = await promise;
        const result = await _feedbackResults2.default.find({ batchId: ele, isActive }, {});
        if (result.length !== 0) {
          acc.push(...result);
        }
        return acc;
      }, Promise.resolve([]));
      return results;
    }
    return null;
  }

  return null;
};

const getResults = async (req, res) => {
  try {
    const results = await receiveResults(req.decoded.email);
    if (results === null) {
      res.json({ error: 'Not able to get results' });
    } else {
      res.json(results);
    }
  } catch (error) {
    res.json({ error: 'Not able to get results' });
  }
};

exports.default = {
  getResults,
  receiveResults
};