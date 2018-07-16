import app from './src/server';
import CONSTANTS from './src/lib/constants';

const isProduction = process.env.NODE_ENV === CONSTANTS.NODE_ENV;
const port = isProduction ? process.env.PORT : CONSTANTS.PORT;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
