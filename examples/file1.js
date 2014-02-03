/**
 *  Example showing all defaults.
 */

// In your code, you would require as follows:
// var Log = require('fuzelog');
var Log = require('../lib/log');

var log = new Log();

log.debug('a debug message you will see: %s', 'Hello!');
log.info('an info message: %s', 'hiya');
log.notice('a notice message');
log.warning('a warning message');
log.error('an error message');
log.critical('a critical message');
log.alert('an alert message');
log.emergency('an emergency message');
