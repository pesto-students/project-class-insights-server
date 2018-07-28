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

const addNewBatch = async (batchesId, InstructorId) => {
  const batches = batchesId;
  const id = InstructorId;
  await InstructorModel.findOneAndUpdate(
    { _id: id },
    { $addToSet: { batches } },
    (err) => {
      if (err) {
        console.log('error in adding new batch to the instructor model');
      }
    },
  );
};

// delete from instructor

export default {
  createInstructor,
  addNewBatch,
};
