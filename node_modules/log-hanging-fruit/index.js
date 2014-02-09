// Main logger class.
var utils = require('util');
var EventEmitter = require('events').EventEmitter;

var Logger = function() {
  this.setupOptions = {};
  this.count = 0;
};


// Make Logger an EventEmitter
utils.inherits(Logger, EventEmitter);


// =========================
// Internal functions
// =========================
Logger.prototype.zeroPad = function(number, zeroes) {
  return ('000000' + number).slice(-zeroes);
}


// Returns current date/time in format yyyy-MM-dd HH:mm:ss.xxx
// Hours are in 24 hr (military) format. xxx are milliseconds.
Logger.prototype.getTimestamp = function() {
  var now = new Date();

  var day = now.getDate();
  var month = now.getMonth() + 1;
  var date = now.getFullYear() + '-' + this.zeroPad(month, 2) + '-' + this.zeroPad(day, 2);
  
  var hours = now.getHours();
  var minutes = now.getMinutes();
  var seconds = now.getSeconds();
  var milliseconds = now.getMilliseconds();
  var time = this.zeroPad(hours, 2) + ':' + this.zeroPad(minutes, 2) + ':' + this.zeroPad(seconds, 2) + '.' + this.zeroPad(milliseconds, 3);

  return date + ' ' + time;
}


// Broadcasts the log message so that all listeners can actually 
// log the message
Logger.prototype.logIt = function(level, text) {
  this.count++;
  var options = {
    date: this.getTimestamp(),
    count: this.count,
    level: level, 
    text: text,
    setup: this.setupOptions };
  this.emit('log', options);
}


// =========================
// External API 
// =========================
Logger.prototype.setup = function(setupOptions) {
  this.setupOptions = setupOptions;
  this.count = 0;
}

Logger.prototype.debug = function(text) {
  this.logIt('debug', text);
}

Logger.prototype.info = function(text) {
  this.logIt('info', text);
}

Logger.prototype.warn = function(text) {
  this.logIt('warn', text);
}

Logger.prototype.error = function(text) {
  this.logIt('error', text);
}


var emptyLogger = new Logger();

var defaultLogger = new Logger();
defaultLogger.consoleLogger = require('./consoleLogger');
defaultLogger.fileLogger = require('./fileLogger');
defaultLogger.on('log', defaultLogger.consoleLogger.log);
defaultLogger.on('log', defaultLogger.fileLogger.log);


exports.emptyLogger = emptyLogger;
exports.defaultLogger = defaultLogger;




