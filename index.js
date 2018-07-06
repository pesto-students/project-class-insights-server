import mongoose from 'mongoose';
import app from './src/server';
import CONSTANTS from './src/lib/constants';

const isProduction = process.env.NODE_ENV === CONSTANTS.NODE_ENV;
const port = isProduction ? process.env.PORT : CONSTANTS.PORT;

const { DB_URI } = CONSTANTS;

mongoose.connect(
  DB_URI,
  { useNewUrlParser: true },
);

mongoose.connection.on('open', () => {
  console.log('Connected to mongo server.');
  // return start_up();
});

mongoose.connection.on('error', (err) => {
  console.log('Could not connect to mongo server!');
  return console.log(err);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
