import UserBatchModel from '../models/batches.model';
import StudentModel from '../models/students.model';

const updateStudentCount = async () => {
  const results = await StudentModel.find({}, {});
  const map = results.reduce((acc, ele) => {
    (ele.batchId).forEach((ele2) => {
      if (!acc[ele2]) {
        acc[ele2] = 0;
      }
      acc[ele2] += 1;
    });
    return acc;
  }, {});
  if (map) {
    Object.keys(map).reduce(async (acc, ele) => {
      const studentCount = map[ele];
      try {
        await UserBatchModel.findOneAndUpdate({ _id: ele }, { studentCount });
      } catch (error) {
        console.log('error at student count updater');
      }
      return acc;
    }, {});
  }
};

const updateSpecificStudentCount = async (batchId) => {
  try {
    const results = StudentModel.find({ batchId }, {});
    let studentCount;
    if (results.length === null || results.length === undefined) {
      studentCount = 0;
    } else {
      studentCount = results.length;
    }
    await UserBatchModel.findOneAndUpdate({ _id: batchId }, { studentCount });
  } catch (error) {
    console.log('error at the specific count update');
  }
};

export default {
  updateStudentCount,
  updateSpecificStudentCount,
};
