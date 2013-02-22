1.4.3 / 2013-02-16
==================
  * Updated docs to reflect that Javascript objects can be displayed.
  * Added ability to pass functions as a sole argument, which are
        evaluated only if the current logging level is equal to or
        lower than the facility.

1.4.2 / 2013-02-16
==================
  * Added sprintf-like capability to log facilities.

1.4.1 / 2013-02-16
==================
 * Fixed a bug where the pattern could not be changed.
 * Fixed a bug where the colors and font effects could not be set.
 * Added some examples.
 * Minor clean-up of the code.

1.4.0 / 2013-02-10
==================
  * Added log4j layouts.
  * Added colors.
  * Added arg-check on constrcutor enabling config object to direct construction.
  * Added option for code to create stream for you.

1.3.0 / 2012-02-10
==================
  * Changed to use local time zone instead of GMT [thakkar-rushikesh]

1.2.0 / 2011-05-23
==================
  * Added sprintf-like `%s` support

1.1.1 / 2010-09-26
==================
  * Fixed `Log()` initialization without giving a stream [bentruyman]

1.1.0 / 2010-09-26
==================
  * Added streaming reader capabilities (_pass a readable stream_)
  * Added `Log()` log level as string support (_alternative of constants_)
  * Added _./index.js_ so people can clone
