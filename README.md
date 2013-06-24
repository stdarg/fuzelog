# fuzelog

fuzelog is a fusion of the log.js module by TJ Hollowaychuck with the layout and formatting options
from log4js. Additionally, there is printf-like functionality and the ability to pass functions called only
when the level is correct.

The logic behind this module is that, when you are logging copious amounts of data, you often find yourself doing:

    log.debug('The user object is: '+JSON.stringify(userObj));

And this code runs in production. Though it produces no output to the log file or the console, the arguement evaluation is always done, which can
many calls to functions like JSON.stringify. The goal of fuzelog is to provide means to avoid this if it is not needed. fuzelog gives you 2 ways to
do this:

1. printf-style argument evaluation done only if the right logging is in place
1. function arguments that are called only when the logging level is correct

The original modules from which fuzelog borrowed code:
<table>
<tr><td><b>Module</b></td>  <td><b>Description</b></td></tr>
<tr><td><a href="https://github.com/nomiddlename/log4js-node" title="Link to log4js">log4js<a/></td><td>Robust and solid logging API which is very simmilar to the Java logging framework Log4j</td></tr>
<tr><td><a gref="https://github.com/visionmedia/log.js" title="Link to log.js">log.js</a></td><td>Super light-weight nodejs logging + streaming log reader</td></tr>
</table>

## Installation

    $ npm install fuzelog

## Example

The original usage of log.js remains down to the constructor arguments, however, if the first argument is an object, FuzeLog uses the object as a configuration object.

The log level defaults to __debug__, however we specify __info__ below and the output stream is set to the file 'example.log':

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

 fuzelog also accepts a function and will only call that function if the appropriate log level exists.

    var Log = require('fuzelog');
    var log = new Log();

    function logFunc() {
        // fuzelog uses sprintf.js which places sprintf and printf into the global scope
        return sprintf('%s facility reports %d %s.', 'The fuzelog', 67, 'ducks');
    };

    // we don't de-reference the function now, fuzelog will evaluate it
    // if the logging level is correct
    log.info(logFunc);

  Output:

    [2013-02-22 14:59:36.892] [INFO] Unnamed - The fuzelog facility reports 67 ducks.

## Notes: 

* fuzelog assumes utf8 encoded data.
* fuzelog uses sprintf.js which places ``printf`` and a ``sprintf`` in the global scope and onto the String prototype. See the [sprintf.js github page](https://github.com/stdarg/sprintf.js "sprintf.js") for more information.

## Log Levels

 Mirror that of syslog:

<table>
<tr><td><b>Log Level</b></td> <td><b>Meaning</b></td></tr>
<tr><td>EMERGENCY</td>        <td>system is unusable</td></tr>
<tr><td>ALERT</td>            <td>action must be taken immediately</td></tr>
<tr><td>CRITICAL</td>         <td>the system is in critical condition</td></tr>
<tr><td>ERROR</td>            <td>error condition</td></tr>
<tr><td>WARNING</td>          <td>warning condition</td></tr>
<tr><td>NOTICE</td>           <td>a normal but significant condition</td></tr>
<tr><td>INFO</td>             <td>a purely informational message</td></tr>
<tr><td>DEBUG</td>            <td>messages to debug an application</td></tr>
</table>

When specifying the log level, fuzelog looks for an object in its constructor with a property named "level" having a string with the log level name (case does not matter).

## API
  - [lvlColors](#lvlcolors)
  - [lvlEffects](#lvleffects)
  - [Log() (constructor)](#log)
  - [Log.emergency()](#logemergencymsgstring)
  - [Log.alert()](#logalertmsgstring)
  - [Log.critical()](#logcriticalmsgstring)
  - [Log.error()](#logerrormsgstring)
  - [Log.warning()](#logwarningmsgstring)
  - [Log.notice()](#lognoticemsgstring)
  - [Log.info()](#loginfomsgstring)
  - [Log.debug()](#logdebugmsgstring)

#### lvlColors
Color settings for console logging. When constructing the logger, you can sepcify
the colors used on the console by setting property 'debugLvlColors' on the
configuration object passed to the Log constructor.  However, you must also turn on ``colorConsoleLogging`` which by default, is false.

Example:

    var Log = require('fuzelog');
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

    var log = new Log( { colorConsoleLogging: true, debugLvlColors: lvlColors } );
    log.warning('a warning message');

#### lvlEffects
In addition to colors, it is possible to apply 1 additional effect to the
log line, e.g. bold, underline, inverse. Simple set the 'debugLvlConsoleFx' property
to an object in the configuration object passed to the Log constructor and on that
object, set the facility name with the effect desired. However, you must also turn on ``colorConsoleLogging`` which by default, is false.

    var Log = require('fuzelog');
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
        colorConsoleLogging: true,     // Use colors on the console
        debugLvlConsoleFx: lvlEffects, // set font fx
    };

    var log = new Log(logConfig);
    log.warning('a warning message');

#### Log() (constructor)

The constructor for fuzelog, called 'Log', takes an optional configuration object to set various options. If the config object is not set, fuzelog will log to the console only, using default colors and the logging level is debug.

The following settings are available in the configuration object:

<table>
<tr><td><b>Option</b></td>      <td><b>Meaning</b></td></tr>
<tr><td>file</td>               <td>String|Stream, Path to the file to write log. If not specified, file logging does not happen.</td><tr>
<tr><td>colorConsoleLogging</td><td>If true, colors and effects (bold, inverse and underline) are displayed to the console. False by default.</td><tr>
<tr><td>consoleLogging          <td>Boolean, If true, logging to the console will occur. If not specified, logging to the console is true by default.</td></tr>
<tr><td>debugLvlColors          <td>Object,  An object contarining the facility names as keys (uppercase), with colors for each facility to display, e.g. green, blue, red, etc. If not specified and colorConsoleLogging is true, default colors are used.</td></tr>
<tr><td>debugLvlConsoleFx</td>  <td>Object, An object contarining the facility names as keys (uppercase), with font effects in quotes, e.g. bold, inverse, underline.</td></tr>
<tr><td>level</td>              <td>String, e.g. "info", sets the logging level, no messages below this level are visible.</td></tr>
<tr><td>logMessagePattern</td>  <td>String, a template from log4js to specificy how each log line should appear, e.g. '[%d{ISO8601}] [%p] %c - %m{1}'
</td></tr>
<tr><td>name</td>               <td>String The name of the log. If you use the layout via logMessagePattern, the name is %c. The default name is "Unamed".</td></tr>
<table>

The following format descriptors exist for the logMessagePattern:

<table>
<tr><td><b>Descriptor</b></td>    <td><b>Meaning<b></td></tr>
<tr><td>%r</td>                   <td>time in toLocaleTimeString format</td></tr>
<tr><td>%p</td>                   <td>log level</td></tr>
<tr><td>%c</td>                   <td>log category</td></tr>
<tr><td>%m</td>                   <td>log data</td></tr>
<tr><td>%d</td>                   <td>date in various formats</td></tr>
<tr><td>%%</td>                   <td>%</td></tr>
<tr><td>%n</td>                   <td>newline</td></tr>
</table>

If the logMessagePattern is ``'[%d{ISO8601}] [%p] %c - %m{1}'`` then the following line:

    log.info('an info message');

will produce the following output:

    [2013-06-23 18:11:24.452] [INFO] example log - an info message

#### Log.emergency(msg:String)

  Display a log message in the emergency facility.

#### Log.alert(msg:String)

  Display a log message in the alert facility.

#### Log.critical(msg:String)

  Display a log message in the critical facility.

#### Log.error(msg:String)

  Display a log message in the error facility.

#### Log.warning(msg:String)

  Display a log message in the warning facility.

#### Log.notice(msg:String)

  Display a log message in the notice facility.

#### Log.info(msg:String)

  Display a log message in the info facility.

#### Log.debug(msg:String)

  Display a log message in the debug facility.


## License

[The MIT License](http://opensource.org/licenses/MIT "Link to the MIT license")
