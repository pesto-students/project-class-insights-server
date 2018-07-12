import UserModel from '../models/user.model';

const signup = async (req, res) => {
  const newUser = new UserModel({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  try {
    await newUser.save();
    console.log('User saved successfully');
    res.json({ success: 'user registration successful' });
  } catch (error) {
    if (error.message.includes('11000')) {
      res.status(422);
      res.json({ error: 'email already registered' });
    }
    if (error.message.includes('is required')) {
      res.status(422);
      res.json({ error: 'All fields are required' });
    }
    if (error.message.includes('email: invalid email')) {
      res.status(422);
      res.json({ error: 'email is not valid' });
    }
    if (error.message.includes('shorter than the minimum allowed length')) {
      res.status(422);
      res.json({ error: 'Password should be minimum 8 characters long' });
    }
    console.log(error.message);
  }
};

export default { signup };

