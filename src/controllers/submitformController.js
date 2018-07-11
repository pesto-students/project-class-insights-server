import FeedbackformModel from '../models/feedbackform.model';

const submit = async (req, res) => {
  const newForm = new FeedbackformModel({
    subject: req.body.subject,
    topic: req.body.topic,

    subtopics: req.body.subtopics.reduce((acc, curr) => {
      return [...acc, { subtopicName: curr.subtopicName },
      ];
    }, []),
  });
  try {
    await newForm.save();
    console.log('form successfully saved');
    res.json({ success: 'Form saved successfully' });
  } catch (error) {
    if (error.message.includes('subject: Path `subject` is required.')) {
      res.status(422);
      res.json({ error: 'subject field is required' });
    }
    if (error.message.includes('topic: Path `topic` is required')) {
      res.status(422);
      res.json({ error: 'Topic field is required' });
    }
    console.log(error.message);
  }
};

export default { submit };
