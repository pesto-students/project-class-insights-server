'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _auth = require('../services/auth.service');

var _auth2 = _interopRequireDefault(_auth);

var _urls = require('../lib/urls');

var _urls2 = _interopRequireDefault(_urls);

var _submitformController = require('../controllers/submitformController');

var _submitformController2 = _interopRequireDefault(_submitformController);

var _getFromController = require('../controllers/getFromController');

var _getFromController2 = _interopRequireDefault(_getFromController);

var _submitfeedbackController = require('../controllers/submitfeedbackController');

var _submitfeedbackController2 = _interopRequireDefault(_submitfeedbackController);

var _batches = require('../controllers/batches.controller');

var _batches2 = _interopRequireDefault(_batches);

var _students = require('../controllers/students.controller');

var _students2 = _interopRequireDefault(_students);

var _dashboard = require('../controllers/dashboard.controller');

var _dashboard2 = _interopRequireDefault(_dashboard);

var _feedbacks = require('../controllers/feedbacks.controller');

var _feedbacks2 = _interopRequireDefault(_feedbacks);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const userRoutes = _express2.default.Router();

userRoutes.use(_urls2.default.home, _auth2.default.ensureAuthenticated);

userRoutes.get(_urls2.default.getForm, _getFromController2.default.getForm);
userRoutes.get(_urls2.default.batches, _batches2.default.getBatchesMain);
userRoutes.get(_urls2.default.dashboard, _dashboard2.default.getResults);
userRoutes.get(`${_urls2.default.getFormById}/:id`, _getFromController2.default.getFormById);
userRoutes.get(`${_urls2.default.students}/:id`, _students2.default.getStudents);

userRoutes.post(_urls2.default.batches, _batches2.default.createBatch);
userRoutes.post(_urls2.default.submitfeedback, _submitfeedbackController2.default.submitfeedback);
userRoutes.post(_urls2.default.submitform, _submitformController2.default.createForm);
userRoutes.post(_urls2.default.students, _students2.default.createStudent);

userRoutes.patch(_urls2.default.batches, _batches2.default.editBatch);
userRoutes.patch(_urls2.default.feedbacks, _feedbacks2.default.setStatusOfFeedback);

userRoutes.delete(_urls2.default.batches, _batches2.default.deleteBatch);

exports.default = userRoutes;