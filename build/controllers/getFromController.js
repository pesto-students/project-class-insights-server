'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _feedbackform = require('../models/feedbackform.model');

var _feedbackform2 = _interopRequireDefault(_feedbackform);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getLatestForm = async (req, res) => {
  await _feedbackform2.default.findOne({}, {}, { sort: { date: -1 } }, (err, form) => {
    res.json(form);
  });
};

const getFormById = async (req, res) => {
  await _feedbackform2.default.findById(req.params.id, (err, form) => {
    res.json(form);
  });
};

const getForm = async (req, res) => {
  console.log(req.headers.authorization);
  const limit = Number(req.query.limit) || 5;
  const sort = Number(req.query.sort) || -1;
  const query = _feedbackform2.default.find({}, {}, { sort: { date: sort } }).limit(Number(limit));
  await query.exec((err, form) => {
    if (err) {
      res.json({ error: err.message });
    }
    res.json(form);
  });
};

exports.default = {
  getLatestForm,
  getFormById,
  getForm
};