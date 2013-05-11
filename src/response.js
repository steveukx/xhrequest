/**
 * The response object exposes the api of an XMLHttpRequest object that would have been returned in the
 * browser if the request had been made in the browser.
 *
 * @param {String} url
 * @param {Number} statusCode
 * @param {Object} headers
 */
function Response(url, statusCode, headers) {
   this.url = url;
   this.statusCode = statusCode;
   this.headers = headers;
   this.data = new Buffer(0);
}

/**
 * The originally requested URL
 * @type {String}
 */
Response.prototype.url = null;

/**
 * The statusCode is the HTTP response code
 * @type {Number}
 */
Response.prototype.statusCode = 200;

/**
 * The headers object contains any HTTP headers received
 * @type {Object}
 */
Response.prototype.headers = null;

/**
 * The data string is the response sent back from the server - this will either be an empty string
 * in the case that nothing was received (ie: response ContentLength header was 0) or the actual
 * response.
 *
 * @type {Buffer}
 */
Response.prototype.data = null;

module.exports = Response;

