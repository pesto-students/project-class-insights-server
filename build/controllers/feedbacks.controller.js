'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _verifyInstructor = require('../helpers/verifyInstructor');

var _verifyInstructor2 = _interopRequireDefault(_verifyInstructor);

var _feedbackform = require('../models/feedbackform.model');

var _feedbackform2 = _interopRequireDefault(_feedbackform);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// For Instructor
//  make the feedback inactive by setting a flag
// and making sure it doesn't appears in the student dashboard as well as the instructors.
const setStatusHere = async (body, email) => {
  const { formId, isActive } = body;

  // set active = true to get active results or set as inactive to get all the results
  const validInstructor = await _verifyInstructor2.default.verifyInstructor(email);
  if (validInstructor) {
    const instructorEmail = validInstructor.email;
    await _feedbackform2.default.findOneAndUpdate({
      email: instructorEmail,
      _id: formId
    }, { isActive });
  }
};

const setStatusOfFeedback = async (req, res) => {
  try {
    await setStatusHere(req.body, req.decoded.email);
    res.json({ success: 'Updated form status' });
  } catch (error) {
    res.json({ error: 'Error at deactivating form' });
  }
};

// For Students

exports.default = {
  setStatusOfFeedback,
  setStatusHere
};