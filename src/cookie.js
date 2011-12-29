
"use strict";

/**
 * The Cookie class represents a Cookie sent from or to the server.
 *
 * @constructor
 */
function Cookie() {
}

/**
 * @type {String}
 */
Cookie.prototype.name = '';

/**
 * @type {String}
 */
Cookie.prototype.domain = '';

/**
 * @type {String}
 */
Cookie.prototype.value = '';

/**
 * @type {Boolean}
 */
Cookie.prototype.expired = false;

/**
 * @type {Date}
 */
Cookie.prototype.expires = null;

/**
 * @type {String}
 */
Cookie.prototype.path = '/';

/**
 * Given the supplied raw Cookie string sent from the server, creates and returns a valid Cookie
 * instance; if the expires setting in the cookie string requires that the Cookie not be saved,
 * the return value will be null.
 *
 * @param {String} cookieString
 * @return {Cookie}
 */
Cookie.build = function (cookieString) {
   var cookieParams = ('' + cookieString).split('; '),
      cookie = new Cookie(),
      equalsSplit = /([^=]+)=(.*)/,
      cookieParam,
      i, len;

   if (!(cookieParam = cookieParams.shift().match(equalsSplit))) {
      return null;
   }

   cookie.name = cookieParam[1];
   cookie.value = cookieParam[2];

   for (i = 0, len = cookieParams.length; i < len; i++) {
      cookieParam = cookieParams[i].match(equalsSplit);
      if (cookieParam.length && cookie[cookieParam[1]] !== undefined) {
         cookie[cookieParam[1]] = cookieParam[2];
      }
   }

   cookie.expires = new Date(cookie.expires);
   if (+cookie.expires < Date.now()) {
      cookie.expired = true;
   }

   return cookie;
};

module.exports = Cookie;