import verifyInstructor from '../helpers/verifyInstructor';
import FeedbackFormModel from '../models/feedbackform.model';

// For Instructor
//  make the feedback inactive by setting a flag
// and making sure it doesn't appears in the student dashboard as well as the instructors.
const setStatusHere = async (body, email) => {
  const { formId, isActive } = body;

  // set active = true to get active results or set as inactive to get all the results
  const validInstructor = await verifyInstructor.verifyInstructor(email);
  if (validInstructor) {
    const instructorEmail = validInstructor.email;
    await FeedbackFormModel.findOneAndUpdate(
      {
        email: instructorEmail,
        _id: formId,
      },
      { isActive },
    );
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

export default {
  setStatusOfFeedback,
  setStatusHere,
};
