
function require(requiredThing) {
   var requiredThingName = ('' + requiredThing).replace(/.*\//, '');
   if(window[requiredThingName] !== undefined) {
      return window[requiredThingName];
   }
   else {
      switch(requiredThingName) {
         case 'cookie':    return window.Cookie;
         case 'cookiejar': return window.CookieJar;
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

function http() {}
function https() {}
function url() {}
url.parse = function() {
   return {
      protocol: 'http:',
      port: 80,
      host: '',
      pathname: '',
      search: ''
   }
}