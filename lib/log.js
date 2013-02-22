/*!
 * fuzelog
 * A combination of log.js log4js features.
 * Copyright(c) 2013 Edmond Meinfelder <edmond@stdarg.com>
 * Derived from log.js by:
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */
'use strict';

var colors = require('colors');
require('sprintf.js');
exports = module.exports = Log;

/**
 * Color settings for console logging. When constructing the logger, you can sepcify
 * the colors used on the console by setting property 'debugLvlColors' on the
 * configuration object passed to the Log constructor. Note: You can only see colors
 * if you specify 'colorConsoleLogging: true' in the config object passed to the
 * constructor. The default, if colorConsoleLogging is not specified, is to not
 * show colors on the console output.
 * @type Object
 */
var lvlColors = {
    EMERGENCY:  'red',
    ALERT:      'red',
    CRITICAL:   'red',
    ERROR:      'red',
    WARNING:    'yellow',
    NOTICE:     'cyan',
    INFO:       'green',
    DEBUG:      'blue',
};

/**
 * In addition to colors, it is possible to apply 1 additional color effect to the
 * log line, e.g. bold, underline, inverse. Simple set the 'debugLvlConsoleFx' property
 * to an object in the configuration object passed to the Log constructor and on that
 * object, set the facility name with the effect desired.
 * @type Object
 */
var lvlEffects = {
    EMERGENCY:  'inverse',
    ALERT:      'bold',
    CRITICAL:   'underline',
    ERROR:      false,
    WARNING:    false,
    NOTICE:     false,
    INFO:       false,
    DEBUG:      'bold',
};

/**
 * Numeric values for the logging facilities.
 * @type Number
 * @api private
 */
var logLevels = {
    EMERGENCY : 0,
    ALERT     : 1,
    CRITICAL  : 2,
    ERROR     : 3,
    WARNING   : 4,
    NOTICE    : 5,
    INFO      : 6,
    DEBUG     : 7,
};

/**
 * The constructor for fuzelog, called 'log', takes an optional configuration object
 * to set various options. If the config object is not set, fuzelog will log to the
 * console only, using default colors and the logging level is debug.
 *
 * The following settings are available in the configuration object:
 *
 * level - String  Sets the logging level, no messages below this level are visible
 * name - String  The name of the log. If you use the layout, the name is %c. THe default
 * name is "Unamed".
 * file - String  Path to the file to write log. If not specified, file logging does not
 * happen.
 * consoleLogging - Boolean If true, logging to the console will occur. If not specified,
 * logging to the console in on by default.
 * debugLvlConsoleFx - Object  An object contarining the facility names as keys (uppercase),
 * with font effects in quotes, e.g. bold, inverse, underline.
 * debugLvlColors - Object  An object contarining the facility names as keys (uppercase),
 * with colors for each facility to display, e.g. green, blue, red, etc.
 * logMsgPattern - String  A string pattern using the log4js style, e.g.
 * '[%d{ISO8601}] [%p] %c - %m{1}'
 * @param {Object} configObj  A configuration object to set-up logging.
 */
function Log(configObject) {
    if (typeof configObject === 'object') {
        this.setOptions(configObject);
        return;
    }

    this.setOptions( { level: logLevels.DEBUG } );
}

/**
 * An easy way to set the Log object options.
 * @param {Object} cfg A confiruation object, with key value pairs to set options.
 * @api private
 */
Log.prototype.setOptions = function (cfg) {

    if ('string' === typeof cfg.level) {
        this.level = logLevels[cfg.level.toUpperCase()];
    } else if ('number' === typeof cfg.level) {
        this.level = cfg.level;
    } else {
        this.level = exports.DEBUG;
    }

    if (typeof this.level === 'undefined')
        this.level = exports.DEBUG;

    if (typeof cfg.name === 'string')
        this.categoryName = cfg.name;

    if (typeof this.categoryName === 'undefined')
        this.categoryName = 'Unnamed';

    if (typeof cfg.file === 'string')
        this.stream = this.openStream(cfg.file, cfg.fileFlags);
    else
        this.stream = cfg.file || false;

    if (typeof cfg.consoleLogging === 'undefined')
        cfg.consoleLogging = true;

    this.console = (cfg.consoleLogging === true ? process.stdout : false);
    this.color = (cfg.colorConsoleLogging === true ? true : false);

    if (typeof cfg.debugLvlConsoleFx === 'object')
        lvlEffects = cfg.debugLvlConsoleFx;

    if (typeof cfg.debugLvlColors === 'object')
        lvlColors = cfg.debugLvlColors;

    if (typeof cfg.logMsgPattern === 'string') {
        this.logMsgPattern = cfg.logMsgPattern;
    } else {
        this.logMsgPattern = '[%d{ISO8601}] [%p] %c - %m{1}';
    }
 };

 /**
  * Open the file stream.
  * @param {String} The file name to write to.
  * @param {String} Flags used in fs.createWriteStream.
  * @api private
  */
 Log.prototype.openStream = function(filename, flags) {
    if (typeof filename !== 'string')
        return false;

    if (typeof flags === 'undefined')
        flags = 'a';

    var fs = require('fs');
    var stream = fs.createWriteStream(filename, { flags: flags });
    return stream;
 };

/**
 * Log output message.
 * @param    {String} levelStr The debugging level.
 * @param    {Array} args Output arguments.
 * @api private
 */
 Log.prototype.log = function(levelStr, args) {

    var msg;
    var formatStr = args[0];
    var values = [];
    for (var i=1; i<args.length; ++i) {
        values[i-1] = args[i];
    }

    // If the first arg is NOT a function, we just use sprintf as normal.
    // If the first arg IS a function, we evaluate it and get the response.
    if ('[object Function]' !== toString.call(formatStr)) {
        console.log('here');
        msg = sprintf(formatStr, values);
    } else {
        msg = formatStr();
        if ('[object String]' !== toString.call(msg))
            return;
    }

    var event = {
        categoryName: this.categoryName,
        startTime: new Date(),
        data: msg,
        level: levelStr
    };

    var layouts = require('./layouts');
    var makeMsg = layouts.patternLayout(this.logMsgPattern);
    var msgWithHeader = makeMsg(event) + '\n';

    if (this.console) {
        var consoleMsg;
        if (this.color && typeof lvlColors[levelStr] !== 'undefined') {
            consoleMsg = msgWithHeader[lvlColors[levelStr]];
        } else {
            consoleMsg = msgWithHeader;
        }
        if (this.color && lvlEffects[levelStr])
            consoleMsg = consoleMsg[lvlEffects[levelStr]];
        this.console.write(consoleMsg);
    }

    if (this.stream !== false)
        this.stream.write(msgWithHeader);
};

/**
 * Display a log message in the emergency facility.
 * @param {String} msg The message to display in the facility.
 */
Log.prototype.emergency = function() {
    if (logLevels.EMERGENCY > this.level)
        return;
    this.log('EMERGENCY', arguments);
};

/**
 * Display a log message in the alert facility.
 * @param {String} msg The message to display in the facility.
 */
Log.prototype.alert = function() {
    if (logLevels.ALERT > this.level)
        return;
    this.log('ALERT', arguments);
};

/**
 * Display a log message in the critical facility.
 * @param {String} msg The message to display in the facility.
 */
Log.prototype.critical = function() {
    if (logLevels.CRITICAL > this.level)
        return;
    this.log('CRITICAL', arguments);
};

/**
 * Display a log message in the error facility.
 * @param {String} msg The message to display in the facility.
 */
Log.prototype.error = function() {
    if (logLevels.ERROR > this.level)
        return;
    this.log('ERROR', arguments);
};

/**
 * Display a log message in the warning facility.
 * @param {String} msg The message to display in the facility.
 */
Log.prototype.warning = function() {
    if (logLevels.WARNING > this.level)
        return;
    this.log('WARNING', arguments);
};

/**
 * For compatibility
 * @api private
 */
Log.prototype.warn = Log.prototype.warning;

/**
 * Display a log message in the notice facility.
 * @param {String} msg The message to display in the facility.
 */
Log.prototype.notice = function() {
    if (logLevels.NOTICE > this.level)
        return;
    this.log('NOTICE', arguments);
};

/**
 * Display a log message in the info facility.
 * @param {String} msg The message to display in the facility.
 */
Log.prototype.info = function() {
    if (logLevels.INFO > this.level)
        return;
    this.log('INFO', arguments);
};

/**
 * Display a log message in the debug facility.
 * @param {String} msg The message to display in the facility.
 */
Log.prototype.debug = function() {
    if (logLevels.DEBUG > this.level)
        return;
    this.log('DEBUG', arguments);
};
