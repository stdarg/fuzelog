/**
 * Example using a config object plus an existing stream.
 */

// In your code, you would require as follows:
// var Log = require('fuzelog');
var Log = require('../lib/log');

var fs = require('fs');
var stream = fs.createWriteStream(__dirname + '/file.log', { flags: 'a' });

var logConfig = {
    level: 'debug',             // DEBUG logging level
    name: 'example log',        // Category name, shows as %c
    file: stream,       // Steam for output
    consoleLogging: true,       // Turn console logging on
    colorConsoleLogging: true,  // Use colors on the console

    // Layout pattern - same as log4js
    logMsgPattern: '[%d{ISO8601}] [%p] %c - %m{1}'
};

// Previous format still works, but execution lacks new features.
//var log = new Log('debug', stream);
var log = new Log(logConfig);

log.debug('a debug message %s', 'Hello!');
log.info('an info message');
log.notice('a notice message');
log.warning('a warning message');
log.error('an error message');
log.critical('a critical message');
log.alert('an alert message');
log.emergency('an emergency message');
