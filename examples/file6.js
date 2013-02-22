/**
 * Example using a config object plus an existing stream and an output function.
 */

// In your code, you would require as follows:
// var Log = require('fuzelog');
var Log = require('../lib/log');

var fs = require('fs');
var stream = fs.createWriteStream(__dirname + '/file.log', { flags: 'a' });

var logConfig = {
    level: 'info',              // DEBUG logging level
    name: 'example log',        // Category name, shows as %c
    file: stream,               // Stream for output
    consoleLogging: true,       // Turn console logging on
    colorConsoleLogging: true,  // Use colors on the console

    // Layout pattern - same as log4js
    logMsgPattern: '[%d{ISO8601}] [%p] %c - %m{1}'
};

// Previous format still works, but execution lacks new features.
//var log = new Log('debug', stream);
var log = new Log(logConfig);


function logFunc() {
    return sprintf('%s facility reports %d %s.', 'The fuzelog', 67, 'ducks');
};

// we don't de-reference the function now, fuzelog will evaluate it
// if the logging level is correct
log.info(logFunc);

