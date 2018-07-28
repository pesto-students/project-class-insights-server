import StudentModel from '../models/students.model';
import batchUpdater from '../helpers/batchUpdater';
import UserBatchModel from '../models/batches.model';
import triggerStudentInvite from '../helpers/triggerStudentInvite';
import UserModel from '../models/user.model';

const createStudent = async (req, res) => {
  const {
    email, batchId,
  } = req.body;
  try {
    const realBatchId = await UserBatchModel.findOne({ batchId }, { _id: 1 });
    const newStudent = new StudentModel({
      email,
      batchId: realBatchId.id,
    });
    const userId = await UserModel.findOne({ email }, { _id: 1 });
    const student = await StudentModel.findOne({ studentObjectId: userId }, {});
    if (student) {
      /* eslint-disable */
      await StudentModel.findOneAndUpdate({ studentObjectId: userId }, { $addToSet: { batchId: realBatchId } });
      await triggerStudentInvite(newStudent);
    } else {
      const savedStudent = await newStudent.save();
      await triggerStudentInvite(savedStudent);
    }

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

const getStudents = async (req, res) => {
  const batchId = req.params.id;
  try {
    const students = await StudentModel.find({ batchId });
    res.json(students);
  } catch (error) {
    res.status(500);
    console.log(error.message);
  }
};

export default {
  createStudent,
  passTheStudentId,
  getStudents,
};
