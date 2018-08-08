import UserSchema from '../models/user.model';
import InstructorModel from '../models/instructor.model';

const verifyInstructor = async (emailPassed) => {
  const email = emailPassed;
  const user = await UserSchema.findOne({ email }, {});
  // eslint-disable-next-line no-underscore-dangle
  const instructor = await InstructorModel.findOne({ loginId: user._id }, {});
  if (instructor) {
    return instructor;
  }
  return false;
};

export default {
  verifyInstructor,
};
