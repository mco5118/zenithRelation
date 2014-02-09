// -------------------------------
// Logging with your custom logger
// -------------------------------

// Get an empty logger
var logger = require('./index').emptyLogger;

// Define any options needed by your custom logger 
logger.setup({xyz: "xyz"});

// Create a custom logger function
// (notice how we access the log options and the setup options)
var customLogger = function(options) {
  console.log("CUSTOM LOG => " + options.setup.xyz + ' ' + options.level + ': ' + options.text);
} 

// Wire the log event to your custom logger
logger.on('log', customLogger)

// Log a few things with different levels
logger.debug('a debug message');
logger.warn('a warning message');
