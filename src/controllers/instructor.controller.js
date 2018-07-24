import InstructorModel from '../models/instructor.model';

const createInstructor = async (namePassed, _id) => {
  const name = namePassed;
  const loginId = _id;
  const newInstructor = new InstructorModel({
    name,
    loginId,
  });
  try {
    await newInstructor.save();
  } catch (error) {
    console.log(error);
    console.log('error in creating instructor');
  }
};

const addNewBatch = async (_id, loginId) => {
  await InstructorModel.findOneAndUpdate(
    { loginId },
    { $addToSet: { batches: _id } },
    (err) => {
      if (err) {
        console.log('error in adding new batch to the instructor model');
      }
    },
  );
};


export default {
  createInstructor,
  addNewBatch,
};
