
/**
 * Example showing setting colors and font effects, also specifies a file name to 
 * capture log output.
 */

// In your code, you would require as follows:
// var Log = require('fuzelog');
var Log = require('../lib/log');

var lvlColors = {
    EMERGENCY:  'red',
    ALERT:      'red',
    CRITICAL:   'red',
    ERROR:      'red',
    WARNING:    'yellow',
    NOTICE:     'grey',
    INFO:       'grey',
    DEBUG:      'grey'
};

var lvlEffects = {
    EMERGENCY:  'inverse',
    ALERT:      false,
    CRITICAL:   false,
    ERROR:      false,
    WARNING:    'inverse',
    NOTICE:     false,
    INFO:       false,
    DEBUG:      'underline',
};

var logConfig = {
    level: 'info',             // DEBUG logging level
    name: 'example log',        // Category name, shows as %c
    file: 'file.log',           // file name to write to
    fileFlags: 'a',             // Flags used in fs.createWriteStream
    consoleLogging: true,       // Turn console logging on
    colorConsoleLogging: true,  // Use colors on the console

    // set the colors
    debugLvlColors: lvlColors,

    // set font fx
    debugLvlConsoleFx: lvlEffects,

    // Layout pattern - same as log4js
    logMsgPattern: '[%d{ISO8601}] [%p] %c - %m{1}'
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
