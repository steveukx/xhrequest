
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
 * Gets the number of cookies in the CookieJar
 * @return {Number}
 */
CookieJar.prototype.count = function() {
   return this._cookies.length;
};

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
   if(index === undefined && !cookie.expired) {
      index = this._cookies.length;
      this._cookies.push(cookie);
      this._cookiesMap[cookie.name] = index;
   }
   else if(!cookie.expired) {
      this._cookies[index] = cookie;
   }
   else if(index !== undefined) {
      this._cookies[index] = null;
   }
};

/**
 * Creates the header string that should be sent with a request to the supplied domain and path values. If a Cookie
 * instance in the CookieJar has no domain set, it will be assumed valid for every domain.
 *
 * @param {String} domain
 * @param {String} path
 * @return {String}
 */
CookieJar.prototype.getHeaderStringForPath = function(domain, path) {
   var cookies = [];
   for(var i = 0, l = this._cookies.length; i < l; i++) {
      if(this._cookies[i]) {
         cookies.push(this._cookies[i].name + '=' + this._cookies[i].value);
      }
   }
   return cookies.join('; ');
};

/**
 * Creates a CookieJar from the supplied map, the values of which can be HTTP Cookie Strings, name/value pairs
 * or actual Cookie instances.
 *
 * @param cookiesMap
 * @return CookieJar
 */
CookieJar.build = function(cookiesMap) {
   var cookieJar = new CookieJar(),
       cookieFormat = /\w+=([^;]+); /;

   for(var cookieName in cookiesMap) {
      var cookie = cookiesMap[cookieName];
      if(typeof cookie == 'string' && !cookieFormat.test(cookie)) {
         cookie = new Cookie(cookieName, cookie);
      }
      
      cookieJar.add(cookie);
   }
   return cookieJar;
};

module.exports = CookieJar;
