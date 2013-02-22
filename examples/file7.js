// In your code, you would require as follows:
// var Log = require('fuzelog');
var Log = require('../lib/log');

var log = new Log();


function logFunc() {
    return sprintf('%s facility reports %d %s.', 'The fuzelog', 67, 'ducks');
};

// we don't de-reference the function now, fuzelog will evaluate it
// if the logging level is correct
log.info(logFunc);
