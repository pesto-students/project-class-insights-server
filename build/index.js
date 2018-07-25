'use strict';

require('babel-polyfill');

var _server = require('./server');

var _server2 = _interopRequireDefault(_server);

var _constants = require('./lib/constants');

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const isProduction = process.env.NODE_ENV === _constants2.default.NODE_ENV;
const port = isProduction ? process.env.PORT : _constants2.default.PORT;

_server2.default.listen(port, () => {
  console.log(`Server running on port ${port}`);
});