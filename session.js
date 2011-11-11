
var Response = require('./response');

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
	this.host = parsedUrl.host;
	this.path = parsedUrl.pathname;

	if(parsedUrl.search) {
		this.path += parsedUrl.search;
	}

	// apply optional things using the prototype as the default
	('success|error|complete|' + 'method|data').split('|').forEach((function(el) {
		this[el] = config[el] || this[el];
	}).bind(this));

	console.log('XHR session created', this);
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
 * When a successful response (ie: status code 200) is received this method will be called, this is
 * a noop function that can be overridden in the configuration object.
 * @type {Function}
 */
Session.prototype.success = function() {};

/**
 * When an error response (ie: anything other than status code 200) is received this method will be
 * called, this is a noop function that can be overridden in the configuration object.
 * @type {Function}
 */
Session.prototype.error = function() {};

/**
 * Irrispective of whether there was a success or error response, this method will be called after
 * the success/error methods are called, this is a noop function that can be overridden in the configuration object.
 * @type {Function}
 */
Session.prototype.complete = function() {};

/**
 * This method actually creates the request using the transport mechanism supplied.
 * 
 * @param {Object} transport Any object that implements the interface used by the built in http/https objects
 */
Session.prototype._send = function(transport) {
	var options = {
		host: this.host,
		port: this.port,
		path: this.path,
		method: this.method
	};

// TODO - if(this.data && this.contentType) {
// TODO - options.headers = { 'Content-Type': this.contentType, 'Content-Length': this.data.length };

	var req = transport.request(options, this._onRequestOpened.bind(this));
//	if(this.data) {
//	}
	req.end();

	req.on('error', this._error.bind(this));
};

/**
 * If there is an error when connecting to the remote host, this method is used to call the error and complete
 * handlers.
 * 
 * @param {Error} err Details of the connection failure
 */
Session.prototype._error = function(err) {
	console.log('XHR error', err, this);
	try { this.error(err); } catch(e1) {}
	try { this.complete(); } catch(e2) {}
};

/**
 * Once the connection has been made to the remote host, this method sets up the Response object that the
 * handlers will ultimately be passed when the operation completes.
 * 
 * @param {Object} res The response object from the remote call
 */
Session.prototype._onRequestOpened = function(res) {
	this.response = new Response(res.statusCode, res.headers);
	res.on('data', this._onDataReceived.bind(this));
	res.on('end',  this._onDataComplete.bind(this));
};

/**
 * As data is received it is appended to the Response object in the current Session.
 * 
 * @param {String} data The block of data to append
 */
Session.prototype._onDataReceived = function(data) {
	this.response.data += data;
};

/**
 * Once data has finished being received from the remote connection, this method runs the handlers from the
 * original configuration object.
 */
Session.prototype._onDataComplete = function() {
	var response = this.response;
	if(response.statusCode == 200) {
		try { this.success(this.response.data, this.response, this); } catch(e1) {}
	}
	else {
		try { this.error(this.response.data, this.response, this); } catch(e2) {}
	}
	try { this.complete(); } catch(e) {}
};

module.exports = Session;


