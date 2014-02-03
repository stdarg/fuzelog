'use strict';
//var assert = require('assert');
//var is = require('is2');
var nexpect = require('nexpect');

// Environment
describe('fuzelog', function() {
    it('should display text for each log facility to stdout', function(done) {
        var doneCalled = false;
        nexpect.spawn('node', ['./examples/file1.js'], {stripColors: true})
        .expect(' [DEBUG] Unnamed - a debug message you will see: Hello!')
        .expect(' [INFO] Unnamed - an info message: hiya')
        .expect(' [NOTICE] Unnamed - a notice message')
        .expect(' [WARNING] Unnamed - a warning message')
        .expect(' [ERROR] Unnamed - an error message')
        .expect(' [CRITICAL] Unnamed - a critical message')
        .expect(' [ALERT] Unnamed - an alert message')
        .expect(' [EMERGENCY] Unnamed - an emergency message')
        .run(function (err) {
            if (!err) {
                if (!doneCalled) {
                    doneCalled = true;
                    return done();
                } else {
                    return;
                }
            }
            if (!doneCalled) {
                doneCalled = true;
                done(err);
            }
        });
    });
});



