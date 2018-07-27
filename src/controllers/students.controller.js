import StudentModel from '../models/students.model';
import batchUpdater from '../helpers/batchUpdater';
import UserBatchModel from '../models/batches.model';
import triggerStudentInvite from '../helpers/triggerStudentInvite';

const createStudent = async (req, res) => {
  const {
    email, batchId,
  } = req.body;
  const realBatchId = await UserBatchModel.findOne({ batchId }, { _id: 1 });
  const newStudent = new StudentModel({
    email,
    batchId: realBatchId.id,
  });
  try {
    const savedStudent = await newStudent.save();
    await triggerStudentInvite(savedStudent);

    batchUpdater.updateStudentCount();
    console.log('Student added to the batch');
    res.json({ success: 'Student created and added to the batchId' });
  } catch (error) {
    console.log(error);
    res.json({ error: 'Error creating students' });
  }
};

const passTheStudentId = async (namePassed, id, emailMatcher) => {
  const studentObjectId = id;
  const name = namePassed;
  const email = emailMatcher;
  try {
    await StudentModel.findOneAndUpdate({ email }, { name, studentObjectId });
    console.log('successfully updated the right student reference');
  } catch (error) {
    console.log('error at passing the right student reference');
  }
};

export default {
  createStudent,
  passTheStudentId,
};
