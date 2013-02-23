
# fuzelog

 Fuzelog is a fusion of the log.js module by TJ Hollowaychuck with the layout and formatting options
 from log4js. Additionally, I ignored the color formatting in log4js and added my own colors and
 formatting.

 The original modules:
 [log4js](https://github.com/nomiddlename/log4js-node)
 [log.js](https://github.com/visionmedia/log.js)

## Installation

    $ npm install fuzelog

## Example

The original function of log.js remains down to the constructor arguments, however, if the first argument is an object, FuzeLog uses the object as a configuration object.

The log level defaults to __debug__, however we specify __info__, and the output stream is set to the file 'example.log':

    var Log = require('fuzelog');
    var logConfig = {
        level: 'info',              // INFO logging level
        name: 'fuzelog',            // Category name, shows as %c in pattern

        // FileStream to log to (can be file name or a stream)
        file: __dirname + '/example.log',

        fileFlags: 'a',             // Flags used in fs.createWriteStream to create log file
        consoleLogging: true,       // Flag to direct output to console
        colorConsoleLogging: true,  // Flag to color output to console

        // Usage of the log4js layout
        logMessagePattern: '[%d{ISO8601}] [%p] %c - %m{1}'
    };

    var log = new Log(logConfig);
    log.debug('You will not see this - preparing email');
    log.info('sending email');
    log.error('failed to send email');

    var obj = { a: 667,
                b: 'This is a string.',
                c: 22 };
    log.emergency('failed to send %s, object: %j', 'email', obj);

 The output for the previous exampls is:

    [2013-02-22 14:55:25.816] [INFO] fuzelog - sending email
    [2013-02-22 14:55:25.819] [ERROR] fuzelog - failed to send email
    [2013-02-22 14:55:25.820] [EMERGENCY] fuzelog - failed to send email, object: {"a":667,"b":"This is a string.","c":22}

 We can also use `%s` much like `console.log()` to pass arguments:

     log.error('oh no, failed to send mail to %s.', 'Edmond');

 Output:

     [2013-02-22 14:58:23.063] [ERROR] fuzelog - oh no, failed to send mail to Edmond.

 fuzelog accepts a function and will only call that function if the appropriate log level exists.

    var Log = require('fuzelog');
    var log = new Log();

    function logFunc() {
        return sprintf('%s facility reports %d %s.', 'The fuzelog', 67, 'ducks');
    };

    // we don't de-reference the function now, fuzelog will evaluate it
    // if the logging level is correct
    log.info(logFunc);

  Output:

    [2013-02-22 14:59:36.892] [INFO] Unnamed - The fuzelog facility reports 67 ducks.

## Notes: 

* fuzelog assumes utf8 encoded data.
* fuzelog uses sprintf.js which places ``sprintf`` in the global namespace, ``printf`` and a ``sprintf`` on the String prototype. See the [sprintf.js github page](https://github.com/stdarg/sprintf.js "sprintf.js") for more information.

## Log Levels

 Mirror that of syslog:

  - 0 __EMERGENCY__  system is unusable
  - 1 __ALERT__ action must be taken immediately
  - 2 __CRITICAL__ the system is in critical condition
  - 3 __ERROR__ error condition
  - 4 __WARNING__ warning condition
  - 5 __NOTICE__ a normal but significant condition
  - 6 __INFO__ a purely informational message
  - 7 __DEBUG__ messages to debug an application

## API
  - [lvlColors](#lvlcolors)
  - [lvlEffects](#lvleffects)
  - [Log()](#log)
  - [Log.emergency()](#logemergencymsgstring)
  - [Log.alert()](#logalertmsgstring)
  - [Log.critical()](#logcriticalmsgstring)
  - [Log.error()](#logerrormsgstring)
  - [Log.warning()](#logwarningmsgstring)
  - [Log.notice()](#lognoticemsgstring)
  - [Log.info()](#loginfomsgstring)
  - [Log.debug()](#logdebugmsgstring)

### lvlColors

  Color settings for console logging. When constructing the logger, you can sepcify
  the colors used on the console by setting property 'debugLvlColors' on the
  configuration object passed to the Log constructor.

### lvlEffects

  In addition to colors, it is possible to apply 1 additional color effect to the
  log line, e.g. bold, underline, inverse. Simple set the 'debugLvlConsoleFx' property
  to an object in the configuration object passed to the Log constructor and on that
  object, set the facility name with the effect desired.

### Log()

  The constructor for fuzelog, called 'log', takes an optional configuration object to set various options. If the config object is not set, fuzelog will log to the console only, using default colors and the logging level is debug.

  The following settings are available in the configuration object:

  *level* - String, Sets the logging level, no messages below this level are visible
  name - String  The name of the log. If you use the layout, the name is %c. The default name is "Unamed".

  *file* - String|Stream, Path to the file to write log. If not specified, file logging does not happen.  consoleLogging - Boolean, If true, logging to the console will occur. If not specified, logging to the console in on by default.

  *debugLvlConsoleFx* - Object, An object contarining the facility names as keys (uppercase), with font effects in quotes, e.g. bold, inverse, underline.

  *debugLvlColors* - Object,  An object contarining the facility names as keys (uppercase), with colors for each facility to display, e.g. green, blue, red, etc.

  *logMessagePattern* - String, A string pattern using the log4js style, e.g.  '[%d{ISO8601}] [%p] %c - %m{1}'

### Log.emergency(msg:String)

  Display a log message in the emergency facility.

### Log.alert(msg:String)

  Display a log message in the alert facility.

### Log.critical(msg:String)

  Display a log message in the critical facility.

### Log.error(msg:String)

  Display a log message in the error facility.

### Log.warning(msg:String)

  Display a log message in the warning facility.

### Log.notice(msg:String)

  Display a log message in the notice facility.

### Log.info(msg:String)

  Display a log message in the info facility.

### Log.debug(msg:String)

  Display a log message in the debug facility.


## License

The MIT License
