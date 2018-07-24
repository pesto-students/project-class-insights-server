import UserBatchModel from '../models/batches.model';
import StudentModel from '../models/students.model';

const updateStudentCountByBatch = async (batchId) => {
  let count;
  await StudentModel.find({ batchId }, {}, (err, results) => {
    count = results.length;
  });
  UserBatchModel.findOneAndUpdate({ batchId }, { studentCount: count }, (err) => {
    if (err) {
      console.log('error in updating batch model');
    } else {
      console.log('successfully updated');
    }
  });
};

const updateStudentCount = async () => {
  let map;
  await StudentModel.find({}, {}, (err, results) => {
    map = results.reduce((acc, ele) => {
      if (!acc[ele.batchId]) {
        acc[ele.batchId] = 0;
      }
      acc[ele.batchId] += 1;
      return acc;
    }, {});
  });
  if (map) {
    Object.keys(map).reduce((acc, ele) => {
      UserBatchModel.findOneAndUpdate({ batchId: ele }, { studentCount: map[ele] }, (err) => {
        if (err) {
          console.log('error in updating batch model');
        }
      });
      return acc;
    }, {});
  }
};

export default {
  updateStudentCountByBatch,
  updateStudentCount,
};
