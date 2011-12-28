
"use strict";

var Cookie = require('./cookie');

function CookieJar() {
   this._cookies = [];
   this._cookiesMap = {};
}

/**
 * @type {Cookie[]}
 */
CookieJar.prototype._cookies = null;

/**
 * @type {Object}
 */
CookieJar.prototype._cookiesMap = null;

/**
 *
 * @param {String|Number} searchFor
 */
CookieJar.prototype.get = function(searchFor) {
   if(typeof searchFor == 'number') {
      return this._cookies[searchFor];
   }
   else if(this._cookiesMap[searchFor] !== undefined) {
      return this._cookies[ this._cookiesMap[searchFor] ];
   }

   return null;
};

/**
 * @return {Cookie[]}
 */
CookieJar.prototype.getAll = function() {
   return [].concat(this._cookies);
};

/**
 * Adds the supplied Cookie to the CookieJar, when the Cookie is a raw HTTP string, the Cookie is parsed
 * before being added to the CookieJar.
 *
 * @param {Cookie|String} cookie
 */
CookieJar.prototype.add = function(cookie) {
   if(typeof cookie == 'string') {
      cookie = Cookie.build(cookie);
   }

   if(!cookie) {
      return;
   }

   var index = this._cookiesMap[cookie.name];
   if(index === undefined) {
      index = this._cookies.length;
      this._cookies.push(cookie);
      this._cookiesMap[cookie.name]
   }
   else {
      this._cookies[index] = cookie;
   }
};

module.exports = CookieJar;
