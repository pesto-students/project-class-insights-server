import StudentModel from '../models/students.model';
import batchUpdater from '../helpers/batchUpdater';
import UserBatchModel from '../models/batches.model';
import triggerStudentInvite from '../helpers/triggerStudentInvite';
import UserModel from '../models/user.model';
import InstructorModel from '../models/instructor.model';

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
      await StudentModel.findOneAndUpdate({ studentObjectId: userId }, {
        $addToSet: { batchId: realBatchId },
      });
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

const deleteStudents = async (req, res) => {
  const { email } = req.decoded;
  const studentEmail = req.body.email;
  const { batchId } = req.body;
  const batches = batchId;
  try {
    const instructorId = await InstructorModel.findOne({ batches }, { loginId: 1 });
    console.log(instructorId, batchId);
    const emailBelongingForTheBatch = await UserModel.findOne(
      { _id: instructorId.loginId },
      { email: 1 },
    );
    if (email === emailBelongingForTheBatch.email) {
      const studentObjectId = await UserModel.findOne({ email: studentEmail }, { _id: 1 });

      if (studentObjectId === null) {
        // not registered in the user collection

        await StudentModel.findOneAndRemove({ email: studentEmail }, {});
      } else {
        // registered in the user collection

        const result = await StudentModel.findOneAndUpdate({ studentObjectId }, {
          $pull: {
            batchId: req.body.batchId,
          },
        }, { new: true });
        console.log(result.batchId);
        // if(result.batchId.length)
        // if the user is not in any more batches then delete the user from
        // the student table, user table as well
      }
    }

    // update specific batch student count
    batchUpdater.updateSpecificStudentCount(batchId);
    res.json({ message: 'done deleting your student but keep them in your heart' });
  } catch (error) {
    console.log('error in removing student');
    res.json({ error: 'You just can\'t remove some people' });
  }
};

export default {
  createStudent,
  passTheStudentId,
  getStudents,
  deleteStudents,
};
