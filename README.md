
XHREQUEST
=========

A jQuery-like mechanism for making remote requests over http and https.

Installation
============

    npm install xhrequest

Usage
=====

Get a reference to the module:

    var XHR = require('xhrequest');

Then send the request with either of the two syntaxes jQuery accepts:

    // URL as a string and a configuration object
    XHR(url, configurationOptions);

    // or a single configuration object that includes the URL
    XHR(configurationOptionsWithUrl);

That's it, additional configuration and all callback functions are included in the configuration object:

Config.success
--------------
`function(responseData, response, status)` called for any request with status code 200

Config.error
------------
`function(responseData, response, status)` called for any request that has a status code other than 200 (including all 2** responses).

Config.complete
---------------
`function()` called after either the success or error handlers have been called, takes no arguments.

Config.method
-------------
The HTTP verb for the request - for example GET, POST, PUT, DELETE or HEAD.

Config.data
-----------
Any data to send with the request. By default the data is assumed to be a form post so the content-type header will be set to `application/www-urlencoded`, to override this supply the correct header (see below).

Config.headers
--------------
An object of headers to send with the request.

Config.cookies
--------------
An object of cookie names / values to send with the request.


