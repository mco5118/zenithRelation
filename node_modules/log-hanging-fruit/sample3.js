// ---------------------------------------------------
// Getting fancy. Using the built-in loggers plus your
// custom logger.
// ---------------------------------------------------

var logger = require('./index').defaultLogger;

var customLogger = function(options) {
  console.log("CUSTOM LOG => " + options.setup.xyz + ' ' + options.level + ': ' + options.text);
} 

var options = {filePath: __dirname, xyz: "xyz"};
logger.setup(options);
logger.on('log', customLogger);

logger.debug('hello world');
logger.error('something bad happened');

