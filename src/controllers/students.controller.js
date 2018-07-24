import StudentModel from '../models/students.model';
import batchUpdater from '../helpers/batchUpdater';
import UserBatchModel from '../models/batches.model';

const createStudent = async (req, res) => {
  const {
    name, batchId, studentObjectId,
  } = req.body;
  const realBatchId = await UserBatchModel.findOne({ batchId }, { _id: 1 });
  const newStudent = new StudentModel({
    name,
    batchId: realBatchId.id,
    studentObjectId,
  });
  try {
    await newStudent.save();
    try { // error
      UserBatchModel.findOneAndUpdate({ batchId }, { $inc: { studentCount: 1 } }, (err) => {
        if (err) res.json({ error: 'Error updating' });
        res.json({ success: 'Successfully updated' });
      });
    } catch (error) {
      res.json({ error: 'error at update' });
    }

    batchUpdater.updateStudentCount();
    console.log('Student added to the batch');
    res.json({ success: 'Student created and added to the batchId' });
  } catch (error) {
    res.json({ error: 'Error creating students' });
  }
};

export default {
  createStudent,
};
