'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _validator = require('validator');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Schema = _mongoose2.default.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    index: true,
    unique: true,
    sparse: true,
    required: true,
    validate: [_validator.isEmail, 'invalid email']
  },
  password: {
    type: String,
    minlength: 8,
    required: true
  },
  isInstructor: Boolean,
  created_at: { type: Date, default: Date.now },
  isVerified: { type: Boolean, default: false }
}, { timestamps: true }); /* eslint-disable */
// The pre middleware doesn't seem to work as expected due to lexical
// binding of the this variable when using arrow functions (ES6).
// https://github.com/Automattic/mongoose/issues/4816

Schema.pre('save', function (next) {
  const user = this;
  _bcrypt2.default.hash(user.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
});
const UserSchema = _mongoose2.default.model('User', Schema);

exports.default = UserSchema;