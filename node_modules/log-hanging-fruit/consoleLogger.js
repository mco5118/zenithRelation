var log = function(options) {
  console.log(options.date + ' ' + options.level + ': ' + options.text);
}

exports.log = log;

