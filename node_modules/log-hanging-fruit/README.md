log-hanging-fruit
=================

The simplest logger that could possibly work.

This logger supports logging messages to multiple destinations. It comes with two loggers built-in that log to the console or to a text file.

There are 4 functions that can be used to log, each of them maps to the severity of the message being logged: debug, info, warn, or error. See example below.

This library uses a shared logger which means that you only need to setup the logger once (usually in your app.js) and subsequent calls to require('log-hanging-fruit').defaultLogger will use the same instance.


installation
============
    cd yourApp
    npm install log-hanging-fruit
 

sample of use
==========================

    // sample1.js
    // Use the default logger, outputs to the console and 
    // to a text file.
    var logger = require('log-hanging-fruit').defaultLogger;

    // Set the path for the files (used by the file logger)
    var options = {filePath: __dirname };
    logger.setup(options);

    // Log a few things with different levels
    logger.debug('hello world');
    logger.info('just for your information');
    logger.warn('bridge freezes before the road');
    logger.error('something bad just happend');

    // Output should be in your console and in a file 
    // named with today's date.
    

using a custom logger
=====================
It's very easy to ditch the custom loggers and use your own. Just start with an empty logger by using require('log-hanging-fruit').emptyLogger instead of require('log-hanging-fruit').defaultLogger. 

Then create a function that you want to use for logging. Wire this function to the 'log' event and you are ready to go. All calls to debug/info/warn/error will fire up your custom logger and pass it the information to log.

When your custom logger is called it will receive one parameter with the following structure:  

    data = {
        date: current date and time,
        count: number of messages logged,
        level: debug/info/warn/error, 
        text: text to log,
        setup: any options passed to the setup method
    }

Here is an example:

    // sample2.js
    // Get an empty logger
    var logger = require('log-hanging-fruit').emptyLogger;

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

    // Output should be in your console in whatever format
    // you defined in "customLogger"


default loggers plus your custom logger
=================================================
If you want to add custom loggers and preserve the built-in ones
just start with the default logger and add a new one like we did 
in the previous example.

    // Start with the default logger, outputs to the console and 
    // to a text file.
    var logger = require('log-hanging-fruit').defaultLogger;

    // Create a custom logger function
    var customLogger = function(options) {
      console.log("CUSTOM LOG => " + options.setup.xyz + ' ' + options.level + ': ' + options.text);
    } 

    var options = {filePath: __dirname, xyz: "xyz"};
    logger.setup(options);

    // Wire the log event to your custom logger
    logger.on('log', customLogger);

    // Log a few things with different levels
    logger.debug('hello world');
    logger.error('something bad happened');

    // Output should be in your console (twice, once by 
    // the built-in console logger and once by your custom
    // loggers) plus in a file named with today's date.



limitations
===========
The built-in loggers don't include any advanced features like color logging (to the console) or rolling files after a size has been reached. 

This logger is inspired from Log4net in the sense that it supports multiple loggers (called appenders in log4net lingo) and also supports multiple levels but this logger is not nearly as battle tested as Log4net or any of the other famous node.js loggers like Winston.



