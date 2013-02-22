
/**
 *  Example showing an alternative pattern.
 */

var Log = require('../lib/log');
//
// In your code, you would require as follows:
// var Log = require('fuzelog');
//

var logConfig = {
    level: 'warning',           // WARNING logging level
    name: 'fuzelog',            // Category name, shows as %c
    file: 'file.log',           // file name to write to
    fileFlags: 'a',             // Flags used in fs.createWriteStream
    consoleLogging: true,       // Turn console logging on
    colorConsoleLogging: true,  // Use colors on the console

    // Layout pattern - same as log4js
    logMsgPattern: '%c - %m',
};

var log = new Log(logConfig);

log.debug('a debug message you will not see: %s', 'Hello!');
log.info('an info message: %s', 'hiya');
log.notice('a notice message');
log.warning('a warning message');
log.error('an error message');
log.critical('a critical message');
log.alert('an alert message');
log.emergency('an emergency message');
