import UserSchema from '../models/user.model';
import InstructorModel from '../models/instructor.model';
import feedbackFormResultsModel from '../models/feedbackResults.model';

// topbackic subtopic average rating feed counts

const getResults = async (req, res) => {
  const { email } = req.decoded;
  const user = await UserSchema.findOne({ email }, {});
  /* eslint-disable */
  const instructor = await InstructorModel.findOne({ loginId: user._id }, {});
  if (instructor) {
    const batchesArray = instructor.batches;
    const results = await batchesArray.reduce(async (promise, ele) => {
      const acc = await promise;
      const result = await feedbackFormResultsModel.find({ batchId: ele }, {});
      console.log(result);
      acc.push(...result);
      return acc;
    }, Promise.resolve([]));
    res.json(results);
  }
};

export default {
  getResults,
};
