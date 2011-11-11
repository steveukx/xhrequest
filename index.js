/**
 * @fileoverview
 * The XHR class is pretty much a NODE implementation of the same interface as the jQuery ajax helper
 */


var Url = require('url'),
	 path = require('path'),
	 fs = require('fs'),
	 http = require('http'),
	 https = require('https');


function xhr(url, config) {
	var parsedUrl = Url.parse(url);
	var transport = http;
	
	if(parsedUrl.prototcol == 'https') {
		transport = https;
		parsedUrl.port = parsedUrl.port || 443;
	}
	return new xhr.session(parsedUrl, config, http);
}

xhr.session = function(parsedUrl, config, transport) {
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
};

xhr.session.prototype.port = 80;

xhr.session.prototype.host = '';

xhr.session.prototype.path = '/';

xhr.session.prototype.method = 'GET';

xhr.session.prototype.data = '';

xhr.session.prototype.contentType = 'application/www-urlencoded';

xhr.session.prototype.success = function() {};

xhr.session.prototype.error = function() {};

xhr.session.prototype.complete = function() {};

xhr.session.prototype._send = function(transport) {
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

xhr.session.prototype._error = function(err) {
	console.log('XHR error', err, this);
	try { this.error(); } catch(e) {}
	try { this.complete(); } catch(e) {}
};

xhr.session.prototype._onRequestOpened = function(res) {
	this.response = new xhr.response(res.statusCode, res.headers);
	res.on('data', this._onDataReceived.bind(this));
	res.on('end',  this._onDataComplete.bind(this));
};

xhr.session.prototype._onDataReceived = function(data) {
//	console.log('XHR Data: ' + this.response.data.length + 'b existing, ' + data.length + 'b added');
	this.response.data += data;
};

xhr.session.prototype._onDataComplete = function() {
	console.log('XHR Complete');
	try { this.success(this.response.data, this.response, this); } catch(e) {}
	this.complete();
};

xhr.response = function(statusCode, headers) {
	this.statusCode = statusCode;
	this.headers = headers;
};

xhr.response.prototype.statusCode = 200;

xhr.response.prototype.headers = null;

xhr.response.prototype.data = '';

module.exports = xhr;
