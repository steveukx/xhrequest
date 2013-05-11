var Response = require('./response'),
   CookieJar = require('./cookiejar');

var debug = (process.env.DEBUG) ? console.log.bind(console) : function() {};

/**
 * The session object is used to manage the request as it is made and configure how the request will be
 * issued. The session itself can use any transport mechanism that suports the same interface as the
 * standard http/https request classes in Node.
 *
 * @param {Object} parsedUrl The result of running Url.parse on a string
 * @param {Object} config Any configuration required (currently see jQuery docs)
 * @param {Object} transport Any object with the interface of http/https
 */
function Session(parsedUrl, config, transport) {
   this.port = parsedUrl.port || this.port;
   this.host = parsedUrl.hostname;
   this.path = parsedUrl.pathname;
   this.url = parsedUrl.href;

   if (parsedUrl.search) {
      this.path += parsedUrl.search;
   }

   // apply optional things using the prototype as the default
   'success error complete context method data cookies headers followRedirects'.split(' ').forEach(function (el) {
      this[el] = config.hasOwnProperty(el) ?  config[el] : this[el];
   }, this);

   if(!(this.cookies instanceof CookieJar)) {
      this.cookies = CookieJar.build(this.cookies || {});
   }

   debug('XHR session created', this);
   this._send(transport);
}

/**
 * The port number to connect to the remote host on - default is 80 for standard HTTP
 * @type {Number}
 */
Session.prototype.port = 80;

/**
 * The remote host name to connect to
 * @type {String}
 */
Session.prototype.host = '';

/**
 * The path to request - this should begin with a slash
 * @type {String}
 */
Session.prototype.path = '/';

/**
 * The CookieJar of Cookie instances to send with the request.
 * @type {CookieJar}
 */
Session.prototype.cookies = '';

/**
 * The HTTP method name to use - default is GET but can be any of the recognised method names
 * @type {String}
 */
Session.prototype.method = 'GET';

/**
 * The data that should be sent along with the request - there is currently no manipulation of the
 * data before it is sent, so for now - make it into the JSON string / URL encoded parameters string
 * @type {String}
 */
Session.prototype.data = '';

/**
 * If the session is going to send data to the remote host, this will be used as the ContentType
 * header that is sent along with it.
 * @type {String}
 */
Session.prototype.contentType = 'application/www-urlencoded';

/**
 * A map of HTTP header values to send along with the request; if a Cookie header is supplied as well
 * as a CookieJar for the cookies, the CookieJar will take precedence.
 * @type {Object}
 */
Session.prototype.headers = null;

/**
 * The number of 30x redirects that should be followed before returning the success or error handlers, by default
 * this is zero which will ignore the redirection of a resource.
 * @type {Number}
 */
Session.prototype.followRedirects = 0;

/**
 * The client request object generated when attempting to connect to the remote host
 * @type {http.ClientRequest}
 */
Session.prototype._clientRequest = null;

/**
 * When a successful response (ie: status code 200) is received this method will be called, this is
 * a NoOp function that can be overridden in the configuration object.
 */
Session.prototype.success = function () {
};

/**
 * When an error response (ie: anything other than status code 200) is received this method will be
 * called, this is a noop function that can be overridden in the configuration object.
 */
Session.prototype.error = function () {
};

/**
 * @type {Object} The scope that any of the handlers should be called in, when not set will be the scope of the Session instance
 */
Session.prototype.context = null;


/**
 * Irrespective of whether there was a success or error response, this method will be called after
 * the success/error methods are called, this is a noop function that can be overridden in the configuration object.
 */
Session.prototype.complete = function () {
};

/**
 * This method actually creates the request using the transport mechanism supplied.
 *
 * @param {Object} transport Any object that implements the interface used by the built in http/https objects
 */
Session.prototype._send = function (transport) {
   var options = {
      host:this.host,
      port:this.port,
      path:this.path,
      method:this.method,
      headers:{}
   };

   if(this.headers) {
      for(var header in this.headers) {
         options.headers[header] = this.headers[header];
      }
   }

   // add the cookies
   if (this.cookies && this.cookies.count()) {
      options.headers['Cookie'] = this.cookies.getHeaderStringForPath(this.host, this.path);
   }

   // add the post data
   if (this.data) {
      options.headers['Content-Type'] = options.headers['Content-Type'] || this.contentType;
      options.headers['Content-Length'] = options.headers['Content-Length'] || this.data.length;
   }

// TODO - options.headers.Authorization = 'Basic ' + new Buffer(opts.auth).toString('base64');

   var req = this._clientRequest = transport.request(options, this._onRequestOpened.bind(this));
   if (this.data) {
      req.write(this.data);
   }
   req.end();

   req.on('error', this._error.bind(this));
};

/**
 * If there is an error when connecting to the remote host, this method is used to call the error and complete
 * handlers.
 *
 * @param {Error} err Details of the connection failure
 */
Session.prototype._error = function (err) {
   debug('XHR error', err, this);
   var context = this.context || this;
   try {
      this.error.call(context, err, this.response && this.response.data, this.response, this);
   } catch (e1) {
   }
   try {
      this.complete.call(context, this.response, this);
   } catch (e2) {
   }
};

/**
 * Once the connection has been made to the remote host, this method sets up the Response object that the
 * handlers will ultimately be passed when the operation completes.
 *
 * @param {Object} res The response object from the remote call
 */
Session.prototype._onRequestOpened = function (res) {
   if(/^30\d$/.test(res.statusCode) && res.headers.location && this.followRedirects) {
      require('./index.js')(res.headers.location, {
         success: function() {
            this.success.apply(this.context || this, arguments);
         },
         error: function() {
            this.error.apply(this.context || this, arguments);
         },
         complete: function() {
            this.complete.apply(this.context || this, arguments);
         },
         context: this,
         headers: this.headers,
         followRedirects: this.followRedirects - 1
      });
      this._clientRequest.abort();
   }
   else {
      this.response = new Response(this.url, res.statusCode, res.headers);
      res.on('data', this._onDataReceived.bind(this));
      res.on('end', this._onDataComplete.bind(this));
   }
};

/**
 * As data is received it is appended to the Response object in the current Session.
 *
 * @param {Buffer} data The block of data to append
 */
Session.prototype._onDataReceived = function (data) {
   var existingResponseData = this.response.data;
   this.response.data = existingResponseData.length ? Buffer.concat([existingResponseData, data]) : data;
};

/**
 * Once data has finished being received from the remote connection, this method runs the handlers from the
 * original configuration object.
 */
Session.prototype._onDataComplete = function () {
   var response = this.response;
   var context = this.context || this;

   if (response.statusCode == 200) {
      try {
         this.success.call(context, this.response.data, this.response, this);
      } catch (e1) {
      }
   }
   else {
      try {
         this.error.call(context, this.response.data, this.response, this);
      } catch (e2) {
      }
   }
   try {
      this.complete.call(context, this.response, this);
   } catch (e) {
   }
};

module.exports = Session;
