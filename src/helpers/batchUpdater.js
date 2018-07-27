import UserBatchModel from '../models/batches.model';
import StudentModel from '../models/students.model';

const updateStudentCount = async () => {
  const results = await StudentModel.find({}, {});

  const map = results.reduce((acc, ele) => {
    if (!acc[ele.batchId]) {
      acc[ele.batchId] = 0;
    }
    acc[ele.batchId] += 1;
    return acc;
  }, {});

  if (map) {
    Object.keys(map).reduce(async (acc, ele) => {
      const studentCount = map[ele];
      try {
        await UserBatchModel.findOneAndUpdate({ _id: ele }, { studentCount });
      } catch (error) {
        console.log('error');
      }
      return acc;
    }, {});
  }
};

export default {
  updateStudentCount,
};
