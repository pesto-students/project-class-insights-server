require('dotenv').config();

const express = require('express');
const cors = require('cors');

const CONSTANTS = require('./lib/constants');

const { PORT } = CONSTANTS;

const app = express();

app.use(cors());

app.get('/', (req, res) => res.send('Working!'));
app.get('/status', (req, res) => res.json({ status: 'Server is up and running!' }));

app.server = app.listen(PORT, () => {
  console.log(`Server Started listening on port ${PORT}!`); // eslint-disable-line no-console
});

module.exports = app;
