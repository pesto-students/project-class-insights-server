require('dotenv').config();
const express = require('express');

const PORT = process.env.SERVER_PORT;
const app = express();

app.get('/', (req, res) => res.send('HelloWorld!'));

app.listen(PORT, () => console.log(`Server Started listening on port ${PORT}!`));
