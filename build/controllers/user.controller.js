'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _user = require('../models/user.model');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getAllUsers = async (req, res) => {
  try {
    const users = await _user2.default.find({});
    res.json(users);
  } catch (error) {
    console.log(error);
  }
};

exports.default = {
  getAllUsers
};