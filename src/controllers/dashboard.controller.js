import UserSchema from '../models/user.model';
import InstructorModel from '../models/instructor.model';
import feedbackFormResultsModel from '../models/feedbackResults.model';

// topbackic subtopic average rating feed counts

const getResults = async (req, res) => {
  const { email } = req.decoded;
  const isActive = true;
  // set active = true to get active results or set as inactive to get all the results
  const user = await UserSchema.findOne({ email }, {});
  /* eslint-disable */
  const instructor = await InstructorModel.findOne({ loginId: user._id }, {});
  if (instructor) {
    const batchesArray = instructor.batches;
    const results = await batchesArray.reduce(async (promise, ele) => {
      const acc = await promise;
      const result = await feedbackFormResultsModel.find({ batchId: ele, isActive }, {});
      if(result.length !== 0){
        acc.push(...result);
      }
      return acc;
    }, Promise.resolve([]));
    res.json(results);
  } else {
    res.json({error: 'Not able to get results'});
  }
};

export default {
  getResults,
};
