
function require(requiredThing) {
   var requiredThingName = ('' + requiredThing).replace(/.*\//, '');
   if(window[requiredThingName] !== undefined) {
      return window[requiredThingName];
   }
   else {
      switch(requiredThingName) {
         case 'cookie':    return window.Cookie;
         case 'cookiejar': return window.CookieJar;
         case 'response': return window.Response;
         case 'session': return window.Session;
         default: return {};
      }
   }
}

module = {
   exports: {}
};

function anHttpCookieString(name, value, path, domain) {
   return anHttpCookieStringExpiringIn(new Date().getFullYear() + 1, name, value, path, domain);
}


function anExpiredHttpCookieString(name, value, path, domain) {
   return anHttpCookieStringExpiringIn(new Date().getFullYear() - 1, name, value, path, domain);
}

function anHttpCookieStringExpiringIn(expiryYear, name, value, path, domain) {
   var expiryString = 'Wed, 25-Dec-' + expiryYear + ' 06:41:05 GMT',
       valueString = value || 'ID=blah:FF=0:TM=2020202020:LM=1010101010:S=B-PcPxpPxPxxpP',
       nameString = (name || 'PREF') + '=',
       domainString = domain || '.google.co.uk';

   return nameString + valueString + '; expires=' + expiryString + '; path=' + (path || '/') + '; domain=' + domainString;
}

var transportFunctions = {};
transportFunctions.end = function () {};
transportFunctions.on = function () {};
transportFunctions.write = function () {};

var http = https = {
   request: function(transportConfig) {
      return transportFunctions;
   }
};

function url() {}
url.parse = function(url) {

   var transportRegex = /(.*):\/\//,
       protocol = url.match(transportRegex);

   protocol = protocol ? protocol[0] : 'http://';

   url = url.replace(transportRegex, '').split('/');

   return {
      protocol: protocol,
      port: protocol == 'http://' ? 80 : 443,
      host: url.shift(),
      pathname: '/' + url.join('/'),
      search: ''
   }
};