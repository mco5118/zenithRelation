var path = require('path');
var fs = require('fs');

// Logs options.text to a file named after 
// options.date.
var log = function(options) {

  // filename will be in the format yyyy_MM_dd.log
  var fileName = options.date.substring(0,10).replace(/-/g,'_') + ".log";
  
  var logFile = path.join(options.setup.filePath, fileName);
  var textToLog = options.date + ' ' + options.level + ': ' + options.text + '\r\n';

  fs.appendFile(logFile, textToLog, function(err) {
    if(err) {
      console.log('ERROR writting to log file [' + logFile + ']. Error [' + err + ']');
    }
  });

}

exports.log = log;

