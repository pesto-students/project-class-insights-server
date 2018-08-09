import UserSchema from '../models/user.model';
import InstructorModel from '../models/instructor.model';
import feedbackFormResultsModel from '../models/feedbackResults.model';

// topbackic subtopic average rating feed counts

const receiveResults = async (email) => {
  const isActive = true;

  // set active = true to get active results or set as inactive to get all the results
  const user = await UserSchema.findOne({ email }, {});
  const isUser = !(user === null);
  if (isUser) {
    /* eslint-disable no-underscore-dangle */
    const instructor = await InstructorModel.findOne({ loginId: user._id }, {});
    if (instructor) {
      const batchesArray = instructor.batches;
      const results = await batchesArray.reduce(async (promise, ele) => {
        const acc = await promise;
        const result = await feedbackFormResultsModel.find({ batchId: ele, isActive }, {});
        if (result.length !== 0) {
          acc.push(...result);
        }
        return acc;
      }, Promise.resolve([]));
      return results;
    }
    return null;
  }

  return null;
};

const getResults = async (req, res) => {
  try {
    const results = await receiveResults(req.decoded.email);
    if (results === null) {
      res.json({ error: 'Not able to get results' });
    } else {
      res.json(results);
    }
  } catch (error) {
    res.json({ error: 'Not able to get results' });
  }
};

export default {
  getResults,
  receiveResults,
};
