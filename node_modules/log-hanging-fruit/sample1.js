// ---------------------------------------------------
// Using the built-in loggers
// (aka the simplest example that could possible work.
// ---------------------------------------------------

// Use the default logger, outputs to the console and to a text file.
var logger = require('./index').defaultLogger;

// Set the path for the files (used by the file logger)
var options = {filePath: __dirname };
logger.setup(options);

// Log a few things with different levels
logger.debug('hello world');
logger.info('just for your information');
logger.warn('bridge freezes before the road');
logger.error('something bad just happend');

console.log("\r\n\r\nTest is done.");
console.log("There should be a file (named with today's date) with these log entries too");
