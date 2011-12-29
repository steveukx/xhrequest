var Url = require('url'),
   http = require('http'),
   https = require('https'),
   Session = require('./session');

/**
 * The Xhr object is the external interface to the Session object (though Session can be used directly to
 * allow for custom transport mechanisms), and requires a valid fully qualified URL and a configuration
 * object that includes any options for the request such as the success/error/complete handlers and
 * the method/data to send.
 *
 * @param {String} url
 * @param {Object} config
 * @return {Session}
 */
function Xhr(url, config) {
   var parsedUrl = Url.parse(url),
      transport = http;

   if (parsedUrl.protocol == 'https:') {
      transport = https;
      parsedUrl.port = parsedUrl.port || 443;
   }

   return new Session(parsedUrl, config, transport);
}

Xhr.Cookie = require('./cookie');
Xhr.CookieJar = require('./cookiejar');

module.exports = Xhr;
